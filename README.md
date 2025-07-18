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
git clone https://github.com/HARSH-DAVE1506/FlightSafe-Bird-Detection-System-FSBDS.git
cd FlightSafe-Bird-Detection-System-FSBDS-
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

## Demonstration Assets

### System Screenshots
Below are screenshots showcasing the user interface and functionality of the Bird Risk Detection System:

- **Dashboard Interface**:  
  <img width="1475" height="467" alt="Screenshot 2025-07-15 173601" src="https://github.com/user-attachments/assets/ae9ccc5c-435e-45ac-a74a-5677f4b93600" />

  *Description*: The main dashboard displaying the upload section and detection results.

- **Risk Assessment Panel**:  
  <img width="1486" height="850" alt="Screenshot 2025-07-15 173630" src="https://github.com/user-attachments/assets/a9cacdc1-2c00-4262-a29e-e9c2d411c9dc" />
  
  *Description*: The panel showing the overall risk level and species detected.

### Model Output Image
This image demonstrates the output of the bird detection and classification model on a sample frame:

- **Classified Frame**:  
![classified_image](https://github.com/user-attachments/assets/581e476d-90ed-4346-9de7-1e968fdf17b6)


  *Description*: A sample frame with bounding boxes. 

## Future Work

- Parallel Processing Pipeline (async batch inference).
- RTSP Camera Integration for live airport CCTV.
- Altitude & Behavior Risk Analysis (gliding, diving).
- Cloud Deployment & edge optimization (Jetson Nano, Google Coral).
- Risk Trend Graphs in UI.
