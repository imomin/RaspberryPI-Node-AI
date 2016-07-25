'use strict';

let mongodb = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    co = require('co');


module.exports = {
    url:'mongodb://localhost:27017/Node-AI',
    _collections: [],
    _conn: null,

    connect: function* (url) {
        console.log('connection');
        if(url)
            this.url = url;
        let connection = yield mongodb.connect(this.url);
        if (this._conn) {
            // connection already exists, was opened by other task, so just close current one and use opened
            yield connection.close();
            return;
        }

        this._conn = connection;

        this._conn.on('error', function(err) {
            config.logger.error('Connection error.', err.stack);
        });

        let self = this;
        this._conn.on('close', function() {
            config.logger.debug('Connection closed');
            self._conn = null;
            self._collection = null;
        });

        console.debug('Connected to ' + this.url);
    },

    close: function* () {
        if (this._conn) {
            yield this._conn.close();
        }
    },

    _createIndex: function* (collection, fields, options) {
        try {
            return yield this._conn.collection(collection).createIndex(fields, options);

        } catch (err) {
            if (err.name === 'MongoError' && err.code === 85) {
                config.logger.debug(
                    'task-runner: Index with such name but with different options is already exists in database.',
                    'Try to drop it and create new one.',
                    'Original error:',
                    err.message
                );

                yield this._conn.collection(collection).dropIndex(options.name);
                return yield this._conn.collection(collection).createIndex(fields, options);
            }

            // it is not expected error, throw it up
            throw err;
        }
    },


    ensureConnection: function* (collection) {
        if (!this.url) {
            throw new Error('Missed connection to mongodb. Please use .connect() method');
        }

        if (!this._conn) {
            //noinspection JSCheckFunctionSignatures
            yield this.connect(this.url);
        }
        // for first usage every collection should be checked for indexes existence
        if (-1 === this._collections.indexOf(collection) && collection === 'tasks') {
            // used: unique identifier
            yield this._createIndex(collection, { taskId: 1 }, { unique: true, name: 'taskId_1' });

            // used: find previous task in group
            yield this._createIndex(collection, { group: 1 }, { sparse: true, name: 'group_1' });

            // used: find next task to process
            yield this._createIndex(
                collection,
                { processedAt: 1, startAt: 1, lockedAt: 1 },
                { name: 'processedAt_1_startAt_1_lockedAt_1' }
            );

            // used: sorting
            yield this._createIndex(collection, { createdAt: 1 }, { name: 'createdAt_1' });

            this._collections.push(collection);
        }
        else if (-1 === this._collections.indexOf(collection) && collection === 'rememberstuffs') {
            // used: sorting
            console.log('index');
            yield this._createIndex(collection, { entity: 1 }, {name: 'entity_1' });
            // used: sorting
            yield this._createIndex(collection, { possessor: 1 }, {name: 'possessor_1' });

            this._collections.push(collection);
        }
    },


    remove: function* (collection, query) {
        yield this.ensureConnection(collection);
        return yield this._conn.collection(collection).deleteMany(query);
    },

    
    addRememberObject: function* (collection, task) {
        let self = this;
        return co(function* () {
            yield self.ensureConnection(collection);
            
            let taskCreated = null,
                _task = Object.assign({
                    createdAt: new Date()
                }, task);

            var result = yield self._conn.collection(collection).insertOne(_task);

            if (result.insertedCount === 1) {
                taskCreated = result.ops[0];
                delete taskCreated._id;
            }
            return taskCreated;
        });
    },

    
    addReminderObject: function* (collection, task) {
        yield this.ensureConnection(collection);
        let taskCreated = null,
            _task = Object.assign({
                taskId: task.taskId,
                name: task.name,
                data: task.data,
                group: task.group,
                startAt: task.startAt,
                repeatEvery: task.repeatEvery,
                retryStrategy: task.retryStrategy,
                lockedAt: new Date(0),
                processedAt: null,
                failedAt: null,
                errorMsg: null,
                retries: 0,
                createdAt: new Date()
            }, task);

        var result = yield this._conn.collection(collection).insertOne(_task);

        if (result.insertedCount === 1) {
            taskCreated = result.ops[0];
            delete taskCreated._id;
        }

        return taskCreated;
    },

    findReminderObject: function* (collection, query) {
        yield this.ensureConnection(collection);
        return yield this._conn.collection(collection).findOne(query);
    }
};
