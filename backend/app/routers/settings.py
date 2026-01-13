"""
Restaurant Settings routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.restaurant_settings import RestaurantSettingsUpdate, RestaurantSettingsResponse
from app.models.restaurant_settings import RestaurantSettings
from app.models.user import User, UserRole
from app.middleware.auth import require_roles
from app.utils.logger import logger

router = APIRouter(prefix="/settings", tags=["Settings"])


def get_or_create_settings(db: Session) -> RestaurantSettings:
    """Get the singleton settings record, or create it if it doesn't exist"""
    settings = db.query(RestaurantSettings).first()
    if not settings:
        settings = RestaurantSettings(
            name="Borcelle Fine Dining",
            slogan="Fine Dining • 2004",
            address="Merkez Mah. Lüks Sokak No:1, İstanbul",
            phone="+90 (212) 555 01 23",
            opening_time="11:00",
            closing_time="23:00",
            total_tables="26",
            total_capacity="120",
            hero_video_url="https://www.youtube.com/embed/F3zw1Gvn4Mk?autoplay=1&mute=1&loop=1&playlist=F3zw1Gvn4Mk&controls=0&modestbranding=1&rel=0&playsinline=1&showinfo=0",
            hero_title="Borcelle Fine Dining",
            hero_subtitle="Zamansız zarafet, titiz servis ve şefin imzasını taşıyan tabaklar…\nHer detay fine-dining sofralarına yakışır bir ritüele dönüşür.",
            gallery_images=["fined1.webp", "fined2.jpeg", "fined3.webp", "fined4.webp"],
            mission="En nadide hammaddeleri rafine tekniklerle buluşturarak, her tabakta sanat eseri yaratmak. Misafirlerimize tutarlı lezzet ve kusursuz servis standardı sunmak.",
            vision="Modern gastronomi anlayışını zamansız bir atmosferle birleştirerek, Türkiye'nin en prestijli fine-dining deneyimini sunmak.",
            experience="Sakin bir lüks atmosferi, özenle tasarlanmış ambiyans ve mevsimin en taze ürünleriyle hazırlanan tadım menüsü. Her kurs, şefin yaratıcılığının bir yansıması.",
            philosophy="\"Az ama öz\" yaklaşımıyla, her detayda mükemmellik arayışı. Yemeğin ötesinde, unutulmaz anılar biriktirdiğiniz bir mekan.",
            services=["Vale park", "Çocuk sandalyesi", "Cuma-Cumartesi canlı müzik", "Özel günler için pasta"],
            hero_badges=["Tadım Menüsü", "Şefin Seçkisi", "Rezervasyon Önerilir"],
            features=[
                {"icon": "🍽️", "title": "Ustalık & Lezzet", "description": "Michelin yıldızlı mutfaklardan ilham alan şefimiz, en seçkin malzemelerle damağınızda iz bırakan tatlar yaratıyor. Her tabak, bir sanat eseri."},
                {"icon": "✨", "title": "Zarif Atmosfer", "description": "Özenle tasarlanmış iç mekan, yumuşak aydınlatma ve klasik müzik eşliğinde romantik akşam yemeklerinden iş görüşmelerine ideal ortam."},
                {"icon": "⭐", "title": "Kusursuz Hizmet", "description": "Deneyimli ekibimiz, her misafirimize özel ilgi göstererek beklentilerin ötesinde bir deneyim sunmak için titizlikle çalışıyor."}
            ]
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("/", response_model=RestaurantSettingsResponse)
async def get_settings(db: Session = Depends(get_db)):
    """
    Get restaurant settings (public endpoint)
    """
    settings = get_or_create_settings(db)
    return RestaurantSettingsResponse.model_validate(settings)


@router.patch("/", response_model=RestaurantSettingsResponse)
async def update_settings(
    settings_update: RestaurantSettingsUpdate,
    current_user: User = Depends(require_roles(UserRole.admin)),
    db: Session = Depends(get_db)
):
    """
    Update restaurant settings (admin only)
    """
    settings = get_or_create_settings(db)
    
    # Update fields
    update_data = settings_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    db.commit()
    db.refresh(settings)
    
    logger.info(f"Restaurant settings updated by {current_user.email}")
    
    return RestaurantSettingsResponse.model_validate(settings)
