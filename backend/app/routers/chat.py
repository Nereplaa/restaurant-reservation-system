"""
Chat router that proxies requests to a local AI model server (e.g. LM Studio).
System prompt is now dynamically generated from database.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import httpx

from app.config import settings
from app.database import get_db
from app.models.restaurant_settings import RestaurantSettings
from app.models.menu_item import MenuItem
from app.models.table import Table, TableArea
from app.models.category import Category


router = APIRouter(tags=["chat"])


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


def generate_system_prompt(db: Session) -> str:
    """
    Generate system prompt dynamically from database.
    Fetches restaurant settings, menu items, and tables.
    """
    # Get restaurant settings
    settings_record = db.query(RestaurantSettings).first()
    
    # Default values if no settings exist
    if not settings_record:
        restaurant_name = "Borcelle Fine Dining"
        opening_time = "11:00"
        closing_time = "23:00"
        total_tables = "26"
        total_capacity = "120"
        services_list = ["Vale park", "Çocuk sandalyesi", "Cuma-Cumartesi canlı müzik", "Özel günler için pasta"]
    else:
        restaurant_name = settings_record.name
        opening_time = settings_record.opening_time
        closing_time = settings_record.closing_time
        total_tables = settings_record.total_tables or "26"
        total_capacity = settings_record.total_capacity or "120"
        services_list = settings_record.services or []
    
    # Get menu items grouped by category
    menu_items = db.query(MenuItem).filter(MenuItem.available == True).all()
    
    # Get categories
    categories = db.query(Category).filter(Category.is_active == True).order_by(Category.sort_order).all()
    category_map = {cat.key: cat.label for cat in categories}
    
    # Get tables grouped by area
    tables = db.query(Table).all()
    
    # Build menu section
    menu_by_category = {}
    for item in menu_items:
        cat_key = item.category.value if hasattr(item.category, 'value') else str(item.category)
        if cat_key not in menu_by_category:
            menu_by_category[cat_key] = []
        menu_by_category[cat_key].append(item)
    
    menu_text = "\nMENÜMÜZ:\n"
    
    # Category order and Turkish names
    category_order = ['starters', 'appetizers', 'mains', 'pizzas', 'chef', 'specials', 'desserts', 'drinks', 'wines']
    category_names = {
        'starters': 'BAŞLANGIÇLAR',
        'appetizers': 'BAŞLANGIÇLAR',
        'mains': 'ANA YEMEKLER',
        'pizzas': 'PİZZALAR',
        'chef': 'ŞEF ÖZEL',
        'specials': 'ŞEF ÖZEL',
        'desserts': 'TATLILAR',
        'drinks': 'İÇECEKLER',
        'wines': 'ŞARAPLAR'
    }
    
    for cat_key in category_order:
        if cat_key in menu_by_category:
            items = menu_by_category[cat_key]
            cat_name = category_map.get(cat_key) or category_names.get(cat_key, cat_key.upper())
            menu_text += f"\n{cat_name}:\n"
            for item in items:
                dietary = ""
                if item.dietary_tags:
                    if 'vegan' in [t.lower() for t in item.dietary_tags]:
                        dietary = ", vegan"
                    elif 'vegetarian' in [t.lower() for t in item.dietary_tags]:
                        dietary = ", vejetaryen"
                menu_text += f"{item.name} {int(item.price)} lira{dietary}\n"
    
    # Build tables section
    tables_text = "\nMASALARIMIZ:\n"
    
    terrace_tables = [t for t in tables if t.area == TableArea.TERRACE]
    main_hall_tables = [t for t in tables if t.area == TableArea.MAIN_HALL]
    vip_tables = [t for t in tables if t.area == TableArea.VIP]
    
    if terrace_tables:
        tables_text += f"\nTERAS ({len(terrace_tables)} masa, sigara içilebilir, açık hava):\n"
        for t in terrace_tables:
            position = "cam kenarı" if t.is_window else ("duvar kenarı" if t.is_wall else "merkez")
            tables_text += f"{t.table_number}: {t.capacity} kişilik, {position}\n"
    
    if main_hall_tables:
        tables_text += f"\nANA SALON ({len(main_hall_tables)} masa, sigara içilmez, klimalı):\n"
        for t in main_hall_tables:
            position = "cam kenarı" if t.is_window else ("duvar kenarı" if t.is_wall else "merkez")
            tables_text += f"{t.table_number}: {t.capacity} kişilik, {position}\n"
    
    if vip_tables:
        tables_text += f"\nVIP ODALAR ({len(vip_tables)} oda, sigara serbest, özel):\n"
        for t in vip_tables:
            tables_text += f"{t.table_number}: {t.capacity} kişilik, özel oda\n"
    
    # Build services section
    services_text = "\nHİZMETLER:\n"
    for service in services_list:
        services_text += f"{service}\n"
    
    # Build complete system prompt
    system_prompt = f"""Sen "{restaurant_name}" restoranının yardımcı asistanısın.

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
Ad: {restaurant_name}
Çalışma Saatleri: Her gün {opening_time}'den {closing_time}'e kadar açığız
Toplam Kapasite: {total_tables} masa, yaklaşık {total_capacity} kişi
{tables_text}
{menu_text}
{services_text}
ÖNEMLİ: Asla İngilizce konuşma, asla yıldız veya özel işaret kullanma, sadece sade Türkçe konuş."""

    return system_prompt


async def _call_llm(message: str, db: Session) -> str:
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

    # Generate dynamic system prompt from database
    system_prompt = generate_system_prompt(db)

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
async def chat(request: ChatRequest, db: Session = Depends(get_db)) -> ChatResponse:
    """Chat endpoint used by the customer-facing chatbot."""
    reply = await _call_llm(request.message, db)
    return ChatResponse(reply=reply)
