from infer import relationsClf
from fastapi import FastAPI
from websockets.sync.client import connect
import lmql
from pydantic import BaseModel, validator
from enum import Enum
from typing import Optional
import json
from typing import Literal
from load_model import load_model_and_tokenizer


app = FastAPI()

completion = ["attack", "support"]

model = lmql.model("google/gemma-2b")

with open("models_config.json") as json_config_file:
    modelConfigs = json.load(json_config_file)

class LlmModelEnum(Enum):
    gpt2Medium = "gpt2-medium"
    gemma_2b = "google/gemma-2b"

class PredictionQuery(BaseModel):
    model: Literal[tuple(modelConfigs)]
    isLlamaCppModel : bool
    topArgument : str
    subArgument : str
    promptTechnique : Literal["fixed-4-Shots", "0-shot"]
    modelPath: Optional[str] = None
    @validator("modelPath", always=True)
    def validate_date(cls, value, values):
        if values["isLlamaCppModel"] and value is None:
            raise ValueError('Model path missing')

class PredictionResult(BaseModel):
    attack: float
    support: float
    prompt: str



@app.post("/predict")
async def predict(body: PredictionQuery) -> PredictionResult :
    model = load_model_and_tokenizer(modelConfigs[body.model])
    modelConfig = modelConfigs[body.model]
    
    res = await relationsClf(model, body.topArgument, body.subArgument, body.promptTechnique, modelConfig["promptTemplate"])
    return res

@app.get("/model")
async def predict():
    return model

@app.get("/models")
async def predict():
    return {"modelList" : list(modelConfigs)}