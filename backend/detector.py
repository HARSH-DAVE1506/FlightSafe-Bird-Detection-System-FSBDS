from ultralytics import YOLO
import cv2
import os
import asyncio


model = YOLO("models/best.pt")

async def detect_birds(video_path, save_frame_path):
    cap = cv2.VideoCapture(video_path)
    max_birds = 0
    max_frame = None
    frame_stats = []
    max_detections = []

    frame_idx = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model.predict(frame, conf=0.5, classes=[0])
        bird_count = 0
        detections = []

        for r in results:
            for box in r.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                detections.append((x1, y1, x2, y2))
            bird_count += len(r.boxes)

        frame_stats.append(bird_count)

        if bird_count > max_birds:
            max_birds = bird_count
            max_frame = frame.copy()
            max_detections = detections  # ✅ Store best frame's detections

        frame_idx += 1

    cap.release()

    if max_frame is not None:
        cv2.imwrite(save_frame_path, max_frame)

    return frame_stats, save_frame_path, max_birds, max_detections
