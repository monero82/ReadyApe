import asyncio
import time
import os
from fastapi import Request, FastAPI, HTTPException
from groq import Groq
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
from typing import List, Optional
import re
import uuid
from datetime import datetime
import psycopg2
load_dotenv()

groq_api_key = os.getenv('GROQ_API_KEY')
app = FastAPI()

# === DATABASE CONNECTION ===
def get_db_conn():
    return psycopg2.connect(
        dbname="readyape",
        user="postgres",
        password=os.getenv("POSTGRES_PASSWORD"),
        host="my_postgres",  # Use 'localhost' if not using Docker networking
        port=5432
    )

class PromptRequest(BaseModel):
    prompt: List[dict]

def preprocess_data(data: List[dict]) -> List[dict]:
    _data =[]
    for j in  data:
        element = {}
        element['role'] = j['role']
        element['content'] = ""
        if isinstance(j['content'], str):
            element['content'] = j['content']
        else:
            for c in j['content']:
                if c['type'] == "text":
                    element['content'] += c['text']
        if  element['content']:
            _data.append(element)
    return _data

async def create_completion(client, model_name, messages):
    system_message = {
        "role": "system",
        "content": "If the user asks for your name, respond with 'Ready Ape R1'. If the user asks for the model name used to answer, respond with 'ready-ape-r1'."
    }
    messages.insert(0, system_message)
    return  client.chat.completions.create(
        model=model_name,
        messages=messages,
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=False,
        stop=None,
    )

@app.post("/stream/")
async def generate_response(request: PromptRequest, email: str = None):
    messages = preprocess_data(request.prompt)
    models = [
        {"name": "gemma2-9b-it", "alias": "Gemma2"},
        {"name": "llama3-8b-8192", "alias": "LLama3-8b"},
        {"name": "deepseek-r1-distill-llama-70b", "alias": "DeepSeek"},
        {"name": "qwen-qwq-32b", "alias": "qwen-2.5"},
    ]
    model_judge = "llama-3.3-70b-versatile"
    model_judge_prompt = (
        f"""
        - You are an AI assistant tasked with evaluating and selecting the best response from {len(models)} provided answers.
        - Your goal is to either choose the single most appropriate response or merge the responses to create a more comprehensive and accurate answer.
        - Consider clarity, relevance, and completeness when making your decision.
        - After evaluation, provide your final answer directly without indicating that it was chosen or merged from multiple responses in the result section.
        """
    )
    try:
        client = Groq(api_key=groq_api_key)
        responses = []
        tasks = [
            create_completion(client, model["name"], messages)
            for model in models
        ]
        results = await asyncio.gather(*tasks)
        for model, result in zip(models, results):
            responses.append({"alias": model["alias"], "content": result.choices[0].message.content})
        combined_responses = [{"role": "user", "content": r["content"]} for r in responses]
        model_judge_messages = [
           *messages, {"role": "system", "content": model_judge_prompt},
            {"role": "user", "content": "Please evaluate the following responses:"},
        ] + combined_responses
        judging_completion = client.chat.completions.create(
            model=model_judge,
            messages=model_judge_messages,
            temperature=0,
            max_tokens=1024 *4,
            top_p=1,
            stream=False,
            stop=None,
        )
        judge_response = judging_completion.choices[0].message.content
        print(f"======= New Request from: {email} ======")
        print("## user prompt:", messages)
        for response in responses:
            print(f"## {response['alias']} response:", response["content"])
        print(f"## Model Judge {model_judge} response:", judge_response)
        async def response_stream():
            for word in judge_response.split():
                yield word + " "
            await asyncio.sleep(0.2)
        return StreamingResponse(response_stream(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stream/title/")
async def generate_response(request: PromptRequest):
    messages = preprocess_data(request.prompt)
    try:
        client = Groq(api_key=groq_api_key)
        completion = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=messages,
        temperature=0.3,
        max_tokens=1024*1,
        top_p=1,
        stream=True,
        stop=None,
        )
        async def response_stream():
            for chunk in completion:
                content = chunk.choices[0].delta.content
                if content:
                    yield content 
        return StreamingResponse(response_stream(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === EVENT ENDPOINTS ===
class EventRequest(BaseModel):
    user_id: uuid.UUID
    title: str
    description: Optional[str] = None
    photo_url: Optional[str] = None
    event_time: Optional[datetime] = None

@app.post("/events/")
async def add_event(event: EventRequest):
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO "UserEvent" (user_id, title, description, photo_url, event_time)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (str(event.user_id), event.title, event.description, event.photo_url, event.event_time))
        event_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {"event_id": event_id, "status": "created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/events/")
async def get_events(user_id: uuid.UUID):
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, title, description, photo_url, event_time, created_at
            FROM "UserEvent"
            WHERE user_id = %s
            ORDER BY event_time ASC
        """, (str(user_id),))
        events = cur.fetchall()
        cur.close()
        conn.close()
        return {"events": [
            {
                "id": row[0],
                "title": row[1],
                "description": row[2],
                "photo_url": row[3],
                "event_time": row[4],
                "created_at": row[5]
            } for row in events
        ]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("fast_api:app", host="0.0.0.0", port=8000, reload=True) 