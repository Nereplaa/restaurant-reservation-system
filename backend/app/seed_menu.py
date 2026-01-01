"""
Seed menu items into database
"""
from app.database import SessionLocal, engine
from app.models.menu_item import MenuItem, MenuCategory
import uuid

# Menu items data
MENU_ITEMS = [
    # BAŞLANGIÇLAR (Appetizers)
    {
        "name": "Humus",
        "name_tr": "Humus",
        "description": "Nohut, tahin, limon ve zeytinyağı ile hazırlanan geleneksel meze",
        "price": 75,
        "category": MenuCategory.appetizers,
        "calories": 166,
        "preparation_time": 10,
        "dietary_tags": ["vegan", "gluten-free"],
        "available": True
    },
    {
        "name": "Patlıcan Salatası",
        "name_tr": "Patlıcan Salatası",
        "description": "Közlenmiş patlıcan, sarımsak, zeytinyağı ve baharatlarla",
        "price": 70,
        "category": MenuCategory.appetizers,
        "calories": 120,
        "preparation_time": 15,
        "dietary_tags": ["vegan", "gluten-free"],
        "available": True
    },
    {
        "name": "Mercimek Köftesi",
        "name_tr": "Mercimek Köftesi",
        "description": "Kırmızı mercimek, bulgur ve baharatlarla hazırlanan vejetaryen köfte",
        "price": 65,
        "category": MenuCategory.appetizers,
        "calories": 180,
        "preparation_time": 20,
        "dietary_tags": ["vegan"],
        "available": True
    },
    {
        "name": "Sigara Böreği",
        "name_tr": "Sigara Böreği",
        "description": "Beyaz peynir ve maydanoz ile hazırlanan çıtır börek (4 adet)",
        "price": 85,
        "category": MenuCategory.appetizers,
        "calories": 320,
        "preparation_time": 15,
        "dietary_tags": ["vegetarian"],
        "available": True
    },
    {
        "name": "Yaprak Sarma",
        "name_tr": "Yaprak Sarma",
        "description": "Zeytinyağlı, pirinçli ve baharatlı asma yaprağı sarması",
        "price": 80,
        "category": MenuCategory.appetizers,
        "calories": 220,
        "preparation_time": 10,
        "dietary_tags": ["vegan", "gluten-free"],
        "available": True
    },
    {
        "name": "Çiğ Köfte",
        "name_tr": "Çiğ Köfte",
        "description": "Bulgur, biber salçası ve baharatlarla hazırlanan geleneksel çiğ köfte",
        "price": 75,
        "category": MenuCategory.appetizers,
        "calories": 200,
        "preparation_time": 10,
        "dietary_tags": ["vegan"],
        "available": True
    },
    
    # ÇORBALAR (Soups)
    {
        "name": "Mercimek Çorbası",
        "name_tr": "Mercimek Çorbası",
        "description": "Geleneksel kırmızı mercimek çorbası, limon ve kruton ile",
        "price": 55,
        "category": MenuCategory.soups,
        "calories": 180,
        "preparation_time": 10,
        "dietary_tags": ["vegan"],
        "available": True
    },
    {
        "name": "Ezogelin Çorbası",
        "name_tr": "Ezogelin Çorbası",
        "description": "Kırmızı mercimek, bulgur ve baharatlarla hazırlanan Türk klasiği",
        "price": 55,
        "category": MenuCategory.soups,
        "calories": 195,
        "preparation_time": 10,
        "dietary_tags": ["vegan"],
        "available": True
    },
    {
        "name": "İşkembe Çorbası",
        "name_tr": "İşkembe Çorbası",
        "description": "Sarımsaklı ve sirkeli geleneksel işkembe çorbası",
        "price": 75,
        "category": MenuCategory.soups,
        "calories": 220,
        "preparation_time": 15,
        "dietary_tags": [],
        "available": True
    },
    {
        "name": "Yayla Çorbası",
        "name_tr": "Yayla Çorbası",
        "description": "Yoğurt, pirinç ve nane ile hazırlanan ferahlatıcı çorba",
        "price": 60,
        "category": MenuCategory.soups,
        "calories": 150,
        "preparation_time": 12,
        "dietary_tags": ["vegetarian", "gluten-free"],
        "available": True
    },
    
    # ANA YEMEKLER (Mains)
    {
        "name": "Adana Kebap",
        "name_tr": "Adana Kebap",
        "description": "Acılı dana kıyma, közlenmiş biber ve domates ile şişte pişirilmiş",
        "price": 195,
        "category": MenuCategory.kebabs,
        "calories": 450,
        "preparation_time": 25,
        "dietary_tags": ["gluten-free"],
        "available": True
    },
    {
        "name": "Urfa Kebap",
        "name_tr": "Urfa Kebap",
        "description": "Acısız dana kıyma kebabı, lavaş ve garnitürlerle",
        "price": 185,
        "category": MenuCategory.kebabs,
        "calories": 420,
        "preparation_time": 25,
        "dietary_tags": ["gluten-free"],
        "available": True
    },
    {
        "name": "İskender Kebap",
        "name_tr": "İskender Kebap",
        "description": "Döner, tereyağlı domates sosu, yoğurt ve pide üzerinde",
        "price": 220,
        "category": MenuCategory.kebabs,
        "calories": 680,
        "preparation_time": 20,
        "dietary_tags": [],
        "available": True
    },
    {
        "name": "Beyti Sarma",
        "name_tr": "Beyti Sarma",
        "description": "Dana kıyma kebabı lavaşa sarılmış, yoğurt ve domates soslu",
        "price": 210,
        "category": MenuCategory.kebabs,
        "calories": 580,
        "preparation_time": 25,
        "dietary_tags": [],
        "available": True
    },
    {
        "name": "Kuzu Pirzola",
        "name_tr": "Kuzu Pirzola",
        "description": "Izgarada pişirilmiş kuzu pirzola, taze otlar ve sebze ile",
        "price": 320,
        "category": MenuCategory.grills,
        "calories": 520,
        "preparation_time": 30,
        "dietary_tags": ["gluten-free"],
        "available": True
    },
    {
        "name": "Tavuk Şiş",
        "name_tr": "Tavuk Şiş",
        "description": "Marine edilmiş tavuk göğsü şişte, sebze ve pilav ile",
        "price": 165,
        "category": MenuCategory.grills,
        "calories": 380,
        "preparation_time": 20,
        "dietary_tags": ["gluten-free"],
        "available": True
    },
    {
        "name": "Karışık Izgara",
        "name_tr": "Karışık Izgara",
        "description": "Adana, kuzu pirzola, tavuk şiş ve köfte bir arada",
        "price": 280,
        "category": MenuCategory.grills,
        "calories": 750,
        "preparation_time": 30,
        "dietary_tags": ["gluten-free"],
        "available": True
    },
    {
        "name": "Kuru Fasulye",
        "name_tr": "Kuru Fasulye",
        "description": "Geleneksel Türk usulü kuru fasulye, pilav ile servis edilir",
        "price": 95,
        "category": MenuCategory.mains,
        "calories": 350,
        "preparation_time": 15,
        "dietary_tags": ["vegetarian"],
        "available": True
    },
    {
        "name": "İmam Bayıldı",
        "name_tr": "İmam Bayıldı",
        "description": "Zeytinyağlı patlıcan dolması, soğan ve domates ile",
        "price": 110,
        "category": MenuCategory.mains,
        "calories": 280,
        "preparation_time": 20,
        "dietary_tags": ["vegan", "gluten-free"],
        "available": True
    },
    {
        "name": "Hünkar Beğendi",
        "name_tr": "Hünkar Beğendi",
        "description": "Kuzu kavurma, közlenmiş patlıcan püresi üzerinde",
        "price": 245,
        "category": MenuCategory.mains,
        "calories": 580,
        "preparation_time": 25,
        "dietary_tags": ["gluten-free"],
        "available": True
    },
    
    # TATLILAR (Desserts)
    {
        "name": "Baklava",
        "name_tr": "Baklava",
        "description": "Fıstıklı geleneksel Türk baklavası (4 dilim)",
        "price": 120,
        "category": MenuCategory.desserts,
        "calories": 450,
        "preparation_time": 5,
        "dietary_tags": ["vegetarian"],
        "available": True
    },
    {
        "name": "Künefe",
        "name_tr": "Künefe",
        "description": "Sıcak servis edilen peynirli kadayıf tatlısı, kaymak ile",
        "price": 135,
        "category": MenuCategory.desserts,
        "calories": 520,
        "preparation_time": 15,
        "dietary_tags": ["vegetarian"],
        "available": True
    },
    {
        "name": "Sütlaç",
        "name_tr": "Sütlaç",
        "description": "Fırında pişirilmiş geleneksel sütlaç",
        "price": 65,
        "category": MenuCategory.desserts,
        "calories": 280,
        "preparation_time": 5,
        "dietary_tags": ["vegetarian", "gluten-free"],
        "available": True
    },
    {
        "name": "Kazandibi",
        "name_tr": "Kazandibi",
        "description": "Karamelize edilmiş muhallebi, tavuk göğsü ile",
        "price": 70,
        "category": MenuCategory.desserts,
        "calories": 320,
        "preparation_time": 5,
        "dietary_tags": ["gluten-free"],
        "available": True
    },
    {
        "name": "Revani",
        "name_tr": "Revani",
        "description": "Şerbetli irmik tatlısı, dondurma ile",
        "price": 75,
        "category": MenuCategory.desserts,
        "calories": 380,
        "preparation_time": 5,
        "dietary_tags": ["vegetarian"],
        "available": True
    },
    {
        "name": "Aşure",
        "name_tr": "Aşure",
        "description": "Buğday, kuruyemiş ve meyvelerle hazırlanan geleneksel tatlı",
        "price": 60,
        "category": MenuCategory.desserts,
        "calories": 300,
        "preparation_time": 5,
        "dietary_tags": ["vegan"],
        "available": True
    },
    
    # İÇECEKLER (Drinks)
    {
        "name": "Türk Kahvesi",
        "name_tr": "Türk Kahvesi",
        "description": "Geleneksel usulde pişirilmiş Türk kahvesi",
        "price": 40,
        "category": MenuCategory.drinks,
        "calories": 15,
        "preparation_time": 8,
        "dietary_tags": ["vegan"],
        "available": True
    },
    {
        "name": "Çay",
        "name_tr": "Çay",
        "description": "Demlik çayı, ince belli bardakta",
        "price": 20,
        "category": MenuCategory.drinks,
        "calories": 2,
        "preparation_time": 3,
        "dietary_tags": ["vegan"],
        "available": True
    },
    {
        "name": "Ayran",
        "name_tr": "Ayran",
        "description": "Taze yapım köpüklü ayran",
        "price": 25,
        "category": MenuCategory.drinks,
        "calories": 60,
        "preparation_time": 2,
        "dietary_tags": ["vegetarian", "gluten-free"],
        "available": True
    },
    {
        "name": "Şalgam",
        "name_tr": "Şalgam",
        "description": "Geleneksel mor havuç içeceği, acılı veya acısız",
        "price": 25,
        "category": MenuCategory.drinks,
        "calories": 20,
        "preparation_time": 2,
        "dietary_tags": ["vegan", "gluten-free"],
        "available": True
    },
    {
        "name": "Limonata",
        "name_tr": "Limonata",
        "description": "Taze sıkılmış limonata, nane ile",
        "price": 35,
        "category": MenuCategory.drinks,
        "calories": 80,
        "preparation_time": 3,
        "dietary_tags": ["vegan", "gluten-free"],
        "available": True
    },
    
    # ÖZEL YEMEKLER (Specials)
    {
        "name": "Şef'in Özel Kuzu",
        "name_tr": "Şef'in Özel Kuzu",
        "description": "6 saat fırında pişirilmiş kuzu incik, sebze püresi ile",
        "price": 380,
        "category": MenuCategory.specials,
        "calories": 650,
        "preparation_time": 35,
        "dietary_tags": ["gluten-free"],
        "available": True
    },
    {
        "name": "Testi Kebabı",
        "name_tr": "Testi Kebabı",
        "description": "Tandır usulü kuzu ve sebzeler çömlek içinde pişirilmiş",
        "price": 350,
        "category": MenuCategory.specials,
        "calories": 580,
        "preparation_time": 40,
        "dietary_tags": ["gluten-free"],
        "available": True
    },
    {
        "name": "Mantı",
        "name_tr": "Mantı",
        "description": "El açması Türk mantısı, yoğurt ve sarımsaklı sos ile",
        "price": 145,
        "category": MenuCategory.specials,
        "calories": 450,
        "preparation_time": 20,
        "dietary_tags": [],
        "available": True
    },
]


def seed_menu_items():
    """Seed menu items into database"""
    db = SessionLocal()
    
    try:
        # Check if menu items already exist
        existing_count = db.query(MenuItem).count()
        if existing_count > 0:
            print(f"Menu items already exist ({existing_count} items). Skipping seed.")
            return
        
        # Add menu items
        for item_data in MENU_ITEMS:
            menu_item = MenuItem(
                id=str(uuid.uuid4()),
                **item_data
            )
            db.add(menu_item)
        
        db.commit()
        print(f"Successfully seeded {len(MENU_ITEMS)} menu items!")
        
    except Exception as e:
        print(f"Error seeding menu items: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_menu_items()
