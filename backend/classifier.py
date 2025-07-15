import cv2
import numpy as np
import onnxruntime as rt
import os
import asyncio

session = rt.InferenceSession("models/efficientnet_b0_nabirds.onnx")
input_name = session.get_inputs()[0].name

with open("models/class_labels.txt") as f:
    SPECIES = [line.strip() for line in f.readlines()]

def preprocess(crop):
    img = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    img = img.astype(np.float32) / 255.0
    img = np.transpose(img, (2, 0, 1))
    return np.expand_dims(img, axis=0)

async def classify_birds(frame, detections, save_path="data/processed/classified_image.jpg"):
    """Classify birds, draw only bounding boxes, and save annotated image."""
    species_list = []

    idx = 1
    for (x1, y1, x2, y2) in detections:
        crop = frame[y1:y2, x1:x2]
        if crop.size == 0:
            continue

        preds = session.run(None, {input_name: preprocess(crop)})[0][0]
        species_idx = int(np.argmax(preds))
        species = SPECIES[species_idx]
        conf = round(float(preds[species_idx]) * 100, 1)
        species_list.append((species, conf))

        idx += 1

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    cv2.imwrite(save_path, frame)

    return species_list, save_path
