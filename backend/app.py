from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import cv2
from detector import detect_birds
from classifier import classify_birds
from risk_estimator import estimate_risk
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "data/uploads"
PROCESSED_DIR = "data/processed"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

app.mount("/data", StaticFiles(directory="data"), name="data")

@app.post("/process-video/")
async def process_video(file: UploadFile):
    video_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(video_path, "wb") as f:
        f.write(await file.read())

    max_frame_path = os.path.join(PROCESSED_DIR, "max_birds_frame.jpg")

    # ✅ Now using real detections
    frame_stats, max_frame_path, max_birds, detections = await detect_birds(video_path, max_frame_path)

    frame = cv2.imread(max_frame_path)

    classified_image_path = os.path.join(PROCESSED_DIR, "classified_image.jpg")
    species_list, classified_image_path = await classify_birds(frame, detections, save_path=classified_image_path)

    bbox_sizes = [(x2 - x1) * (y2 - y1) for (x1, y1, x2, y2) in detections]
    overall_risk, risk_levels = estimate_risk(species_list, max_birds, bbox_sizes)

    return JSONResponse({
        "frame_stats": frame_stats,
        "max_birds": max_birds,
        "species_list": [{"name": s[0]} for s in species_list],  # ✅ Dropped confidence as you wanted
        "overall_risk": overall_risk,
        "classified_image_url": f"http://127.0.0.1:8000/data/processed/classified_image.jpg"
    })

