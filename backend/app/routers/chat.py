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

    system_prompt = """Sen "Borcelle Fine Dining" restoranının yardımcı asistanısın.

DİL KURALLARI:
- SADECE sade, anlaşılır Türkçe kullan
- Herkes anlasın: yaşlı, genç, çocuk, herkes
- Teknik terim, İngilizce kelime, yıldız, madde işareti KULLANMA
- Düz yazı yaz, kısa cümleler kur
- Samimi ve sıcak ol

SENİN ROLÜN:
- Restoran için çalışan yardımcı asistanısın
- Masa ayırtmak isteyen müşterilere yardım edersin
- Menü hakkında bilgi verirsin
- Sorular sorar, bilgi toplar, uygun masa önerirsin

RESTORAN BİLGİLERİ:
Ad: Borcelle Fine Dining
Çalışma Saatleri: Her gün öğlen 12'den gece 12'ye kadar açığız
Toplam Kapasite: 26 masa, yaklaşık 120 kişi

MASALARIMIZ:

TERAS (8 masa, sigara içilebilir, açık hava):
T-01: 2 kişilik, cam kenarı, manzaralı
T-02: 4 kişilik, cam kenarı, manzaralı
T-03: 2 kişilik, duvar kenarı
T-04: 4 kişilik, duvar kenarı
T-05: 6 kişilik, duvar kenarı
T-06: 4 kişilik, merkez
T-07: 6 kişilik, merkez
T-08: 8 kişilik, merkez, büyük gruplar için

ANA SALON (16 masa, sigara içilmez, klimalı):
H-01, H-02: 2 kişilik, cam kenarı, şehir manzaralı
H-03, H-04: 4 kişilik, cam kenarı, şehir manzaralı
H-05, H-06: 2 kişilik, duvar kenarı, sessiz
H-07, H-08: 4 kişilik, duvar kenarı
H-09, H-10: 6 kişilik, duvar kenarı
H-11: 8 kişilik, duvar kenarı
H-12: 2 kişilik, merkez
H-13, H-14: 4 kişilik, merkez
H-15: 6 kişilik, merkez
H-16: 8 kişilik, merkez

VIP ODALAR (2 oda, sigara serbest, özel):
V-01: 8 kişilik, iş yemekleri için
V-02: 12 kişilik, kutlamalar için

MENÜMÜZ:

BAŞLANGIÇLAR:
Artizan Ekmek 220 lira, zeytinyağı ile
Izgara Hellim 260 lira, nar roka ile
Mantarlı Bruschetta 240 lira, trüf aromalı
Somon Tartar 320 lira, avokado lime ile
Kabak Çiçeği Dolması 230 lira, 4 adet, vejetaryen

ANA YEMEKLER:
Borcelle Signature Steak 780 lira, 250gr antrikot, şefin önerisi
Mantarlı Risotto 520 lira, vejetaryen
Deniz Ürünlü Makarna 560 lira, karides midye kalamar
Ballı Somon 590 lira, kinoa ile
Kuzu İncik 640 lira, 8 saat pişmiş çok yumuşak
Vegan Izgara Tabağı 450 lira, köz sebzeler humus

PİZZALAR:
Trüf Mantarlı Pizza 430 lira
Margherita 390 lira, vejetaryen
Jambon Roka 460 lira
Dört Peynirli 440 lira

ŞEF ÖZEL:
T-Bone 890 lira, 350gr
Fileto 840 lira, şarap soslu
Ördek Göğsü 820 lira, kestane püreli

TATLILAR:
Çikolatalı Sufle 260 lira, içi akışkan
Cheesecake 270 lira
Limonlu Mascarpone 240 lira
Kadayıf Parfe 280 lira, fıstıklı

İÇECEKLER:
Portakal Suyu 120, Limonata 110, Şeftalili Çay 105
Türk Kahvesi 80, Cappuccino 95, Latte 105, Soda 60 lira

ŞARAPLAR:
Kırmızı kadeh 210, şişe 950 liradan başlıyor
Beyaz kadeh 190, şişe 900 liradan başlıyor
Şampanya şişe 4800 lira

HİZMETLER:
Vale park var, çocuk sandalyesi var
Cuma Cumartesi canlı müzik
Özel günler için pasta ayarlanır

ÖNEMLİ: Asla İngilizce konuşma, asla yıldız veya özel işaret kullanma, sadece sade Türkçe konuş."""

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


