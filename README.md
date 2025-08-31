# MedRisk AI

An open-source web application that predicts patient health risk levels (Normal, Low, Medium, High) based on vital signs and clinical inputs. Built for rapid triage and early warning systems in healthcare settings.

## Live Web App

Access the deployed app - [MedRisk AI](https://med-risk-ai.vercel.app) 
Hosted Via vercel*

## API & Source Code

The API is hosted on Hugging Face Spaces. You can explore the source files for the API:  
🔗 [API & Code Repository](https://huggingface.co/spaces/ItsMeArm00n/Health-Risk-Predictor/tree/main)

## Input Parameters

The model expects the following features:

- **Patient_ID** – Unique anonymized patient identifier  
- **Respiratory_Rate** – Breaths per minute  
- **Oxygen_Saturation** – Oxygen saturation level (%) in the blood  
- **O2_Scale** – Oxygen therapy scale used  
- **Systolic_BP** – Systolic blood pressure (mmHg)  
- **Heart_Rate** – Heart beats per minute  
- **Temperature** – Body temperature (°C)  
- **Consciousness** – Level of consciousness  
  - A = Alert  
  - P = Pain response  
  - C = Confusion  
  - V = Verbal  
  - U = Unresponsive  
- **On_Oxygen** – Whether the patient is on supplemental oxygen  
  - 0 = No  
  - 1 = Yes  
- **Risk_Level** – Target variable  
  - Normal, Low, Medium, High

## Output

Returns a predicted risk level:
- `Normal`
- `Low`
- `Medium`
- `High`

## Tech Stack

- Python
- Scikit-learn
- xgboost
- FastAPI
- Hugging Face Spaces
- Vercel
