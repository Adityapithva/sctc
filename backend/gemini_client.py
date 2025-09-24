import google.generativeai as genai
import json
import re

genai.configure(api_key="AIzaSyBFEuMyLK17Ul20zEGuRPAgsyyH9DDrKv0")

model = genai.GenerativeModel("gemini-2.5-flash")

def generate_timetable(prompt: str):
    response = model.generate_content(prompt)
    text = response.text.strip()

    # Remove ```json fences if any
    if text.startswith("```"):
        text = re.sub(r"^```[a-zA-Z]*\n", "", text)
        text = text.rstrip("```").strip()

    try:
        data = json.loads(text)
    except Exception as e:
        raise ValueError(f"Failed to parse Gemini output as JSON: {str(e)}\nOutput: {text}")

    return data
