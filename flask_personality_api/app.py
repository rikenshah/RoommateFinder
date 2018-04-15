# A very simple Flask Hello World app for you to get started with...

from flask import Flask,request
from personality import Personality
import json

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello from Flask!'

@app.route('/predict')
def get_personality():
    text = request.args.get("text")
    p = Personality()
    token = p.auth(3459, 'vmp75o3e1mqq9adt4968vqpdvv')
    prediction_result = p.predict_from_text(token, text)
    return json.dumps(prediction_result, indent=4)

