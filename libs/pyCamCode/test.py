import cv2, imutils, base64, socket, sys, time
import numpy as np
from picamera.array import PiRGBArray
from picamera import PiCamera

if __name__ == '__main__':
    if len(sys.argv) == 2:
        TCP_IP = '127.0.0.1'
        TCP_PORT = int(sys.argv[1])
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind((TCP_IP, TCP_PORT))
        s.listen(1)
        conn, addr = s.accept()

        camera = PiCamera()
        camera.resolution = (640, 480)
        camera.framerate = 32
        rawCapture = PiRGBArray(camera, size=(640, 480))

        for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
                image = frame.array
                cv2.imshow("Frame", image)
                ret, image = cv2.imencode('.jpeg', image)
                b64 = base64.encodestring(image)
                conn.sendall('WEBCAM%s' % b64)
                rawCapture.truncate( 0 )
        conn.close()
