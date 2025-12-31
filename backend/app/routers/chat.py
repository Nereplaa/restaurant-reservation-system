"""
Chat router that proxies requests to a local AI model server (e.g. LM Studio).
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

from app.config import settings


router = APIRouter(tags=["chat"])


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


async def _call_llm(message: str) -> str:
    """
    Call the local LLM server (LM Studio or similar) using an OpenAI-compatible API.

    Configuration is taken from environment variables:
    - LLM_API_URL (e.g. http://localhost:1234/v1/chat/completions)
    - LLM_API_KEY (optional)
    - LLM_MODEL (e.g. the model name shown in LM Studio)
    """
    llm_api_url = getattr(settings, "LLM_API_URL", None)
    llm_api_key = getattr(settings, "LLM_API_KEY", None)
    llm_model = getattr(settings, "LLM_MODEL", "openai/gpt-oss-20b")

    if not llm_api_url:
        raise HTTPException(
            status_code=500,
            detail="LLM_API_URL is not configured on the server.",
        )

    system_prompt = (
        "You are an AI assistant for a restaurant's online booking system. "
        "Help users check availability and make reservations. "
        "Ask for date, time, number of guests, and any special requests. "
        "Be concise and friendly. You do not actually confirm the booking, "
        "but you can guide the user and summarize the reservation details."
    )

    payload = {
        "model": llm_model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ],
        "temperature": 0.4,
    }

    headers = {}
    if llm_api_key:
        headers["Authorization"] = f"Bearer {llm_api_key}"

    async with httpx.AsyncClient(timeout=60) as client:
        try:
            response = await client.post(llm_api_url, json=payload, headers=headers)
            response.raise_for_status()
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Error communicating with LLM server: {exc}",
            )

    data = response.json()
    try:
        return data["choices"][0]["message"]["content"]
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Unexpected response format from LLM server.",
        )


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Chat endpoint used by the customer-facing chatbot."""
    reply = await _call_llm(request.message)
    return ChatResponse(reply=reply)


