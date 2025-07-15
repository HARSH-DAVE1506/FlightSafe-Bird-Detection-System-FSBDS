# FlightSafe-Bird-Detection-System-FSBDS-

Bird Detection & Risk Assessment: AI-powered Airport Safety Monitoring

## Objective

This project is a prototype AI-powered system to detect birds from video feeds, classify their species, and estimate a risk level for airport flight operations.

## ⚠️⚠️⚠️ Important Tip Before You Start⚠️⚠️⚠️
**Use a video shorter than 5 seconds for testing.** Longer videos will significantly increase detection time and may heavily utilize your CPU/GPU resources, which could potentially overheat or stress your machine.

## Features

- **Bird Detection**: Custom-trained YOLOv8m model.
- **Species Classification**: EfficientNet-B0 ONNX trained on NABirds dataset.
- **Risk Index Estimation**: Based on bird count & size.
- **Interactive Dashboard (React)**: Displays detected species, overall risk, and annotated classified image.

## Project Structure

```
BIRD-RISK-DETECTION/
│
├── backend/
│   ├── app.py                    # FastAPI API server
│   ├── detector.py               # Bird detection logic (YOLOv8)
│   ├── classifier.py             # Species classification (EfficientNet)
│   ├── risk_estimator.py         # Risk calculation logic
│   ├── requirements.txt          # Python dependencies
│   │
│   ├── data/
│   │   ├── processed/
│   │   │   ├── classified_image.jpg
│   │   │   └── max_birds_frame.jpg
│   │   ├── uploads/
│   │   │   ├── testbird.mp4
│   │   │   └── istockphoto-1441714973-640_adpp_is.mp4
│   │
│   ├── models/
│   │   ├── best.pt               # Custom-trained YOLOv8 model
│   │   ├── yolov8n.pt            # Base YOLO model
│   │   ├── efficientnet_b0_nabirds.onnx  # Classification model
│   │   └── class_labels.txt      # Bird species labels
│
├── bird-risk-app/                # React frontend
│   ├── src/
│   │   ├── App.js                # Main React UI
│   │   ├── App.css
│   │   ├── index.css
│   │   └── logo.svg
```

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/bird-risk-detection.git
cd bird-risk-detection
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Run the backend:
```bash
uvicorn app:app --reload
```

**Backend Live at:** http://127.0.0.1:8000

### 3. Frontend Setup

```bash
cd ../bird-risk-app
npm install
npm start
```

**Frontend Live at:** http://localhost:3000

## Models Used

### Bird Detection (YOLOv8m Custom Trained)
- **Model summary (fused)**: 92 layers, 25,840,339 parameters  
- **Precision**: 0.825 | **Recall**: 0.725 | **mAP50**: 0.838 | **mAP50-95**: 0.326

### Bird Classification (EfficientNet-B0 ONNX)
- Trained on **NABirds dataset**.  
- **Reference**: [NABirds Dataset](https://dl.allaboutbirds.org/nabirds)

## Risk Index Logic
| Condition | Risk Level |
|-----------|------------|
| Large birds (bbox area > 50,000 px²) or >5 birds | **High** |
| Medium birds (20,000 < bbox ≤ 50,000 px²) or 3–5 birds | **Moderate** |
| Small birds or ≤3 birds | **Low** |

## Future Work

- Parallel Processing Pipeline (async batch inference).
- RTSP Camera Integration for live airport CCTV.
- Altitude & Behavior Risk Analysis (gliding, diving).
- Cloud Deployment & edge optimization (Jetson Nano, Google Coral).
- Risk Trend Graphs in UI.
