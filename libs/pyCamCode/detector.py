import cv2, platform

import numpy as np

class FaceDetection:
    @staticmethod
    def find(image, haarcascade, scaleFactor = 1.2, minNeighbors = 8):
        img = image.decode('base64', 'strict')
        img = cv2.imdecode(np.fromstring(img, dtype=np.uint8), -1)
        faceCascade = cv2.CascadeClassifier(haarcascade)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)
        faces = faceCascade.detectMultiScale(gray, scaleFactor, minNeighbors)
        return faces

class MoveDetection:
    @staticmethod
    def find(image1, image2):
        rect = (0, 0, 0, 0)
        firstFrame = image1.decode('base64', 'strict')
        firstFrame = cv2.imdecode(np.fromstring(firstFrame, dtype=np.uint8), -1)
        img = image2.decode('base64', 'strict')
        img = cv2.imdecode(np.fromstring(img, dtype=np.uint8), -1)
        if firstFrame is not None and img is not None:
            firstGray = cv2.cvtColor(firstFrame, cv2.COLOR_BGR2GRAY)
            firstGray = cv2.equalizeHist(firstGray)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            gray = cv2.equalizeHist(gray)
            frameDelta = cv2.absdiff(firstGray, gray)
            thresh = cv2.threshold(frameDelta, 25, 255, cv2.THRESH_BINARY)[1]
            thresh = cv2.dilate(thresh, None, iterations=2)
            if platform.system() == 'Windows':
                _, cnts, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            else:
                cnts, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            contourMax = None
            areaMax = None
            for c in cnts:
                contour = cv2.contourArea(c)
                if contour < 500:
                    continue
                if contourMax is None or contour > contourMax:
                    contourMax = contour
                    areaMax = c
            if not areaMax is None:
                (x, y, w, h) = cv2.boundingRect(areaMax)
                rect = (x, y, w, h)
        return rect
