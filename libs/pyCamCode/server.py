import socket, sys, detector, recognizer

MOVE_DETECTION = 'MOVDET'
FACE_DETECTION = 'FACDET'
FACE_RECOGNIZE = 'FACREC'

if __name__ == '__main__':
    if len(sys.argv) == 2:
        TCP_IP = '127.0.0.1'
        TCP_PORT = int(sys.argv[1])
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind((TCP_IP, TCP_PORT))
        s.listen(1)
        while 1:
            conn, addr = s.accept()
            data = conn.recv(16)
            try:
                if data == 'STOP':
                    break
                if data.startswith(FACE_RECOGNIZE):
                    buffer = int(data[6:])
                    conn.send('BUFFER OK')
                    data = conn.recv(buffer)
                    flux = data.split(' ')
                    faces = recognizer.Face.find(flux[0], flux[1], flux[2], float(flux[3]), int(flux[4]))
                    finds = '{"faces": ['
                    index = 0
                    for data in faces:
                        index += 1
                        finds += '%s' % data
                        if index < len(faces):
                            finds += ','
                    finds += ']}'
                    conn.send('%s' % finds)
                if data.startswith(MOVE_DETECTION):
                    buffer = int(data[6:])
                    conn.send('BUFFER OK')
                    data = conn.recv(buffer)
                    flux = data.split(' ')
                    (x, y, w, h) = detector.MoveDetection.find(flux[0], flux[1])
                    conn.send('{"x": "%s", "y": "%s", "w": "%s", "h": "%s"}' % (x, y, w, h))
                if data.startswith(FACE_DETECTION):
                    buffer = int(data[6:])
                    conn.send('BUFFER OK')
                    data = conn.recv(buffer)
                    flux = data.split(' ')
                    faces = detector.FaceDetection.find(flux[0], flux[1], float(flux[2]), int(flux[3]))
                    finds = '{"faces": ['
                    index = 0
                    for (x, y, w, h) in faces:
                        index += 1
                        finds += '{"x": "%s", "y": "%s", "w": "%s", "h": "%s"}' % (x, y, w, h)
                        if index < len(faces):
                            finds += ','
                    finds += ']}'
                    conn.send('%s' % finds)
            except:
                message = '%s' % sys.exc_value
                message = message.replace('\\', '/').replace('\n', '').replace('\r', '')
                conn.send('{"error": "%s"}' % message)
            conn.close()
        s.close()
