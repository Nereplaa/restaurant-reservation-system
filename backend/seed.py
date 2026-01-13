"""
Database seeding script
"""
from app.database import SessionLocal, engine, Base
from app.models import User, Table, MenuItem, Reservation, Order, OrderItem, RestaurantSettings, Category
from app.models.user import UserRole
from app.models.table import TableStatus, TableArea
from app.models.menu_item import MenuCategory
from app.models.reservation import ReservationStatus
from app.models.order import OrderStatus
from app.utils.auth import hash_password
from datetime import datetime, date, time, timedelta
from decimal import Decimal
import uuid

def seed_database():
    """Seed database with initial data"""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("Database already seeded. Skipping...")
            return
        
        print("Starting database seeding...")
        
        # Create users
        admin_user = User(
            email="admin@restaurant.com",
            password_hash=hash_password("admin123"),
            first_name="Admin",
            last_name="User",
            phone="+1234567890",
            role=UserRole.admin
        )
        
        manager_user = User(
            email="manager@restaurant.com",
            password_hash=hash_password("manager123"),
            first_name="Manager",
            last_name="User",
            phone="+1234567891",
            role=UserRole.manager
        )
        
        server_user = User(
            email="server@restaurant.com",
            password_hash=hash_password("server123"),
            first_name="Server",
            last_name="User",
            phone="+1234567892",
            role=UserRole.server
        )
        
        kitchen_user = User(
            email="kitchen@restaurant.com",
            password_hash=hash_password("kitchen123"),
            first_name="Kitchen",
            last_name="User",
            phone="+1234567893",
            role=UserRole.kitchen
        )
        
        customer_user = User(
            email="john.doe@example.com",
            password_hash=hash_password("customer123"),
            first_name="John",
            last_name="Doe",
            phone="+1234567894",
            role=UserRole.customer
        )
        
        db.add_all([admin_user, manager_user, server_user, kitchen_user, customer_user])
        db.commit()
        print("✓ Users created")
        
        # Create restaurant settings
        restaurant_settings = RestaurantSettings(
            name="Borcelle Fine Dining",
            slogan="Fine Dining • 2004",
            description="Zamansız zarafet, titiz servis ve şefin imzasını taşıyan tabaklar…",
            address="Merkez Mah. Lüks Sokak No:1, İstanbul",
            phone="+90 (212) 555 01 23",
            email="info@borcellefinedining.com",
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
            philosophy='"Az ama öz" yaklaşımıyla, her detayda mükemmellik arayışı. Yemeğin ötesinde, unutulmaz anılar biriktirdiğiniz bir mekan.',
            services=["Vale park", "Çocuk sandalyesi", "Cuma-Cumartesi canlı müzik", "Özel günler için pasta"],
            hero_badges=["Tadım Menüsü", "Şefin Seçkisi", "Rezervasyon Önerilir"],
            features=[
                {"icon": "🍽️", "title": "Ustalık & Lezzet", "description": "Michelin yıldızlı mutfaklardan ilham alan şefimiz, en seçkin malzemelerle damağınızda iz bırakan tatlar yaratıyor. Her tabak, bir sanat eseri."},
                {"icon": "✨", "title": "Zarif Atmosfer", "description": "Özenle tasarlanmış iç mekan, yumuşak aydınlatma ve klasik müzik eşliğinde romantik akşam yemeklerinden iş görüşmelerine ideal ortam."},
                {"icon": "⭐", "title": "Kusursuz Hizmet", "description": "Deneyimli ekibimiz, her misafirimize özel ilgi göstererek beklentilerin ötesinde bir deneyim sunmak için titizlikle çalışıyor."}
            ]
        )
        db.add(restaurant_settings)
        db.commit()
        print("✓ Restaurant settings created")
        
        # Create categories
        categories_data = [
            {"key": "starters", "label": "Başlangıçlar", "label_tr": "Başlangıçlar", "emoji": "🥗", "sort_order": 1},
            {"key": "mains", "label": "Ana Yemekler", "label_tr": "Ana Yemekler", "emoji": "🍛", "sort_order": 2},
            {"key": "pizzas", "label": "Gurme Pizzalar", "label_tr": "Gurme Pizzalar", "emoji": "🍕", "sort_order": 3},
            {"key": "chef", "label": "Şef Özel", "label_tr": "Şef Özel", "emoji": "👨‍🍳", "sort_order": 4},
            {"key": "specials", "label": "Şef Özel", "label_tr": "Şef Özel", "emoji": "👨‍🍳", "sort_order": 5},
            {"key": "desserts", "label": "Tatlılar", "label_tr": "Tatlılar", "emoji": "🍰", "sort_order": 6},
            {"key": "drinks", "label": "İçecekler", "label_tr": "İçecekler", "emoji": "🥤", "sort_order": 7},
            {"key": "wines", "label": "Şaraplar", "label_tr": "Şaraplar", "emoji": "🍷", "sort_order": 8},
        ]
        
        for cat_data in categories_data:
            category = Category(**cat_data)
            db.add(category)
        
        db.commit()
        print("✓ Categories created")
        
        # Create tables with enhanced features
        # Rules:
        # - TERRACE: 8 tables, smoking ALLOWED
        # - MAIN_HALL: 16 tables, smoking NOT allowed
        # - VIP: 2 rooms, smoking ALLOWED
        # - Window seats: 6 total (2 terrace, 4 main hall)
        # - Wall seats: 10 total (3 terrace, 7 main hall)
        
        tables_data = [
            # ========== TERRACE TABLES (8) - Smoking Allowed ==========
            # 2 window, 3 wall, 3 center
            {"table_number": "T-01", "capacity": 2, "area": TableArea.TERRACE, "location": "Teras - Cam Kenarı", 
             "smoking_allowed": True, "is_window": True, "is_wall": False, "is_vip": False},
            {"table_number": "T-02", "capacity": 4, "area": TableArea.TERRACE, "location": "Teras - Cam Kenarı",
             "smoking_allowed": True, "is_window": True, "is_wall": False, "is_vip": False},
            {"table_number": "T-03", "capacity": 2, "area": TableArea.TERRACE, "location": "Teras - Duvar Kenarı",
             "smoking_allowed": True, "is_window": False, "is_wall": True, "is_vip": False},
            {"table_number": "T-04", "capacity": 4, "area": TableArea.TERRACE, "location": "Teras - Duvar Kenarı",
             "smoking_allowed": True, "is_window": False, "is_wall": True, "is_vip": False},
            {"table_number": "T-05", "capacity": 6, "area": TableArea.TERRACE, "location": "Teras - Duvar Kenarı",
             "smoking_allowed": True, "is_window": False, "is_wall": True, "is_vip": False},
            {"table_number": "T-06", "capacity": 4, "area": TableArea.TERRACE, "location": "Teras - Merkez",
             "smoking_allowed": True, "is_window": False, "is_wall": False, "is_vip": False},
            {"table_number": "T-07", "capacity": 6, "area": TableArea.TERRACE, "location": "Teras - Merkez",
             "smoking_allowed": True, "is_window": False, "is_wall": False, "is_vip": False},
            {"table_number": "T-08", "capacity": 8, "area": TableArea.TERRACE, "location": "Teras - Merkez",
             "smoking_allowed": True, "is_window": False, "is_wall": False, "is_vip": False},
            
            # ========== MAIN HALL TABLES (16) - No Smoking ==========
            # 4 window, 7 wall, 5 center
            {"table_number": "H-01", "capacity": 2, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Cam Kenarı",
             "smoking_allowed": False, "is_window": True, "is_wall": False, "is_vip": False},
            {"table_number": "H-02", "capacity": 2, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Cam Kenarı",
             "smoking_allowed": False, "is_window": True, "is_wall": False, "is_vip": False},
            {"table_number": "H-03", "capacity": 4, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Cam Kenarı",
             "smoking_allowed": False, "is_window": True, "is_wall": False, "is_vip": False},
            {"table_number": "H-04", "capacity": 4, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Cam Kenarı",
             "smoking_allowed": False, "is_window": True, "is_wall": False, "is_vip": False},
            {"table_number": "H-05", "capacity": 2, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Duvar Kenarı",
             "smoking_allowed": False, "is_window": False, "is_wall": True, "is_vip": False},
            {"table_number": "H-06", "capacity": 2, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Duvar Kenarı",
             "smoking_allowed": False, "is_window": False, "is_wall": True, "is_vip": False},
            {"table_number": "H-07", "capacity": 4, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Duvar Kenarı",
             "smoking_allowed": False, "is_window": False, "is_wall": True, "is_vip": False},
            {"table_number": "H-08", "capacity": 4, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Duvar Kenarı",
             "smoking_allowed": False, "is_window": False, "is_wall": True, "is_vip": False},
            {"table_number": "H-09", "capacity": 6, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Duvar Kenarı",
             "smoking_allowed": False, "is_window": False, "is_wall": True, "is_vip": False},
            {"table_number": "H-10", "capacity": 6, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Duvar Kenarı",
             "smoking_allowed": False, "is_window": False, "is_wall": True, "is_vip": False},
            {"table_number": "H-11", "capacity": 8, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Duvar Kenarı",
             "smoking_allowed": False, "is_window": False, "is_wall": True, "is_vip": False},
            {"table_number": "H-12", "capacity": 2, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Merkez",
             "smoking_allowed": False, "is_window": False, "is_wall": False, "is_vip": False},
            {"table_number": "H-13", "capacity": 4, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Merkez",
             "smoking_allowed": False, "is_window": False, "is_wall": False, "is_vip": False},
            {"table_number": "H-14", "capacity": 4, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Merkez",
             "smoking_allowed": False, "is_window": False, "is_wall": False, "is_vip": False},
            {"table_number": "H-15", "capacity": 6, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Merkez",
             "smoking_allowed": False, "is_window": False, "is_wall": False, "is_vip": False},
            {"table_number": "H-16", "capacity": 8, "area": TableArea.MAIN_HALL, "location": "Ana Salon - Merkez",
             "smoking_allowed": False, "is_window": False, "is_wall": False, "is_vip": False},
            
            # ========== VIP ROOMS (2) - Smoking Allowed ==========
            {"table_number": "V-01", "capacity": 8, "area": TableArea.VIP, "location": "VIP Oda 1",
             "smoking_allowed": True, "is_window": False, "is_wall": False, "is_vip": True},
            {"table_number": "V-02", "capacity": 12, "area": TableArea.VIP, "location": "VIP Oda 2",
             "smoking_allowed": True, "is_window": False, "is_wall": False, "is_vip": True},
        ]
        
        for table_data in tables_data:
            table = Table(**table_data, status=TableStatus.available)
            db.add(table)
        
        db.commit()
        print("✓ Tables created (8 Terrace + 16 Main Hall + 2 VIP = 26 total)")
        
        # Create menu items - Borcelle Fine Dining Menu
        menu_items = [
            # Başlangıçlar (Starters)
            {
                "name": "Zeytin & Kekikli Artizan Ekmek Trio",
                "name_tr": "Zeytin & Kekikli Artizan Ekmek Trio",
                "description": "Sıcak taş fırın ekmekleri, zeytinyağı-balsamik dip sos ve deniz tuzu ile.",
                "price": Decimal("220"),
                "category": MenuCategory.starters,
                "preparation_time": 10,
                "calories": 220
            },
            {
                "name": "Izgara Halloumi & Nar Roka",
                "name_tr": "Izgara Halloumi & Nar Roka",
                "description": "Nar ekşili roka yatağında ızgara hellim, kavrulmuş fındık parçaları ile.",
                "price": Decimal("260"),
                "category": MenuCategory.starters,
                "preparation_time": 15,
                "calories": 310
            },
            {
                "name": "Trüf Aromalı Mantarlı Bruschetta",
                "name_tr": "Trüf Aromalı Mantarlı Bruschetta",
                "description": "Karamelize soğan, sote mantar ve hafif trüf yağı ile kızarmış ekmek üstü lezzet.",
                "price": Decimal("240"),
                "category": MenuCategory.starters,
                "preparation_time": 12,
                "calories": 270
            },
            {
                "name": "Somon Tartar Lime Breeze",
                "name_tr": "Somon Tartar Lime Breeze",
                "description": "Taze somon, avokado, lime sos ve susam ile rafine bir soğuk başlangıç.",
                "price": Decimal("320"),
                "category": MenuCategory.starters,
                "preparation_time": 15,
                "calories": 260
            },
            {
                "name": "Kabak Çiçeği Dolması Serisi",
                "name_tr": "Kabak Çiçeği Dolması Serisi",
                "description": "Otlu pirinç iç harcı ile doldurulmuş hafif Ege klasiği. (4 adet)",
                "price": Decimal("230"),
                "category": MenuCategory.starters,
                "dietary_tags": ["vegetarian"],
                "preparation_time": 20,
                "calories": 190
            },
            
            # Ana Yemekler (Mains)
            {
                "name": "Borcelle Signature Steak",
                "name_tr": "Borcelle Signature Steak",
                "description": "250 gr dry-aged dana antrikot, demi-glace sos, ızgara sebzeler ve patates püresi ile.",
                "price": Decimal("780"),
                "category": MenuCategory.mains,
                "preparation_time": 30,
                "calories": 720
            },
            {
                "name": "Kremalı Porçini Risotto",
                "name_tr": "Kremalı Porçini Risotto",
                "description": "Parmesan ve tereyağı ile bağlanmış, yoğun aromalı porçini mantarlı risotto.",
                "price": Decimal("520"),
                "category": MenuCategory.mains,
                "dietary_tags": ["vegetarian"],
                "preparation_time": 25,
                "calories": 580
            },
            {
                "name": "Deniz Mahsullü Linguine",
                "name_tr": "Deniz Mahsullü Linguine",
                "description": "Karides, midye ve kalamarla zenginleştirilmiş, beyaz şarap soslu ince makarna.",
                "price": Decimal("560"),
                "category": MenuCategory.mains,
                "preparation_time": 25,
                "calories": 650
            },
            {
                "name": "Ballı Hardallı Fırın Somon",
                "name_tr": "Ballı Hardallı Fırın Somon",
                "description": "Kinoa yatağında narenciye dokunuşlu ballı hardal sos ile fırınlanmış somon.",
                "price": Decimal("590"),
                "category": MenuCategory.mains,
                "preparation_time": 25,
                "calories": 520
            },
            {
                "name": "Osmanlı Usulü Kuzu İncik",
                "name_tr": "Osmanlı Usulü Kuzu İncik",
                "description": "8 saat düşük ısıda pişirilmiş kuzu incik, patlıcan püresi ve kendi sosu ile.",
                "price": Decimal("640"),
                "category": MenuCategory.mains,
                "preparation_time": 35,
                "calories": 780
            },
            {
                "name": "Vegan Izgara Köz Tabağı",
                "name_tr": "Vegan Izgara Köz Tabağı",
                "description": "Köz patlıcan, kabak, kapya biber ve humus ile dengeli bir bitkisel ana yemek.",
                "price": Decimal("450"),
                "category": MenuCategory.mains,
                "dietary_tags": ["vegan"],
                "preparation_time": 20,
                "calories": 470
            },
            
            # Gurme Pizzalar (Gourmet Pizzas)
            {
                "name": "Truffle Mushroom Pizza",
                "name_tr": "Truffle Mushroom Pizza",
                "description": "Mozzarella, mantar ve trüf yağı ile yoğun aromalı gurme pizza.",
                "price": Decimal("430"),
                "category": MenuCategory.pizzas,
                "preparation_time": 20,
                "calories": 690
            },
            {
                "name": "Napoli Margherita Deluxe",
                "name_tr": "Napoli Margherita Deluxe",
                "description": "San Marzano domates sosu, buffalo mozzarella ve taze fesleğen.",
                "price": Decimal("390"),
                "category": MenuCategory.pizzas,
                "dietary_tags": ["vegetarian"],
                "preparation_time": 18,
                "calories": 610
            },
            {
                "name": "Prosciutto & Roka",
                "name_tr": "Prosciutto & Roka",
                "description": "İnce dilim prosciutto, roka ve parmesan ile dengeli tuzlulukta.",
                "price": Decimal("460"),
                "category": MenuCategory.pizzas,
                "preparation_time": 20,
                "calories": 720
            },
            {
                "name": "Quattro Formaggi",
                "name_tr": "Quattro Formaggi",
                "description": "Gorgonzola, mozzarella, parmesan ve kaşar karışımı peynir şöleni.",
                "price": Decimal("440"),
                "category": MenuCategory.pizzas,
                "preparation_time": 18,
                "calories": 780
            },
            
            # Şef Özel (Chef's Specials)
            {
                "name": "Karamelize Soğanlı T-Bone",
                "name_tr": "Karamelize Soğanlı T-Bone",
                "description": "350 gr premium T-Bone, karamelize soğan ve rosmarinli patatesler ile.",
                "price": Decimal("890"),
                "category": MenuCategory.chef,
                "preparation_time": 35,
                "calories": 950
            },
            {
                "name": "Borcelle Fileto Sufle",
                "name_tr": "Borcelle Fileto Sufle",
                "description": "Şarap indirgemeli sos ile tereyağında mühürlenmiş dana fileto.",
                "price": Decimal("840"),
                "category": MenuCategory.chef,
                "preparation_time": 30,
                "calories": 860
            },
            {
                "name": "Kestane Püreli Ördek Göğsü",
                "name_tr": "Kestane Püreli Ördek Göğsü",
                "description": "Portakal glaze ve kestane püresi ile dengelenmiş gurme ördek tabağı.",
                "price": Decimal("820"),
                "category": MenuCategory.chef,
                "preparation_time": 35,
                "calories": 740
            },
            
            # Tatlılar (Desserts)
            {
                "name": "Çikolatalı Volkan Sufle",
                "name_tr": "Çikolatalı Volkan Sufle",
                "description": "Akışkan bitter çekirdek, yanında dondurma ile servis edilir.",
                "price": Decimal("260"),
                "category": MenuCategory.desserts,
                "preparation_time": 15,
                "calories": 480
            },
            {
                "name": "San Sebastian Cheesecake",
                "name_tr": "San Sebastian Cheesecake",
                "description": "Orta şekerli, kremamsı dokuda klasik yanık cheesecake.",
                "price": Decimal("270"),
                "category": MenuCategory.desserts,
                "preparation_time": 5,
                "calories": 510
            },
            {
                "name": "Limonlu Mascarpone Cup",
                "name_tr": "Limonlu Mascarpone Cup",
                "description": "Limon kreması, mascarpone ve bisküvi katmanlı ferahlatıcı tatlı.",
                "price": Decimal("240"),
                "category": MenuCategory.desserts,
                "preparation_time": 5,
                "calories": 390
            },
            {
                "name": "Fıstıklı Kadayıf Parfe",
                "name_tr": "Fıstıklı Kadayıf Parfe",
                "description": "Antep fıstığı, kıtır kadayıf ve parfe katmanlarıyla modernleştirilmiş yerel tat.",
                "price": Decimal("280"),
                "category": MenuCategory.desserts,
                "preparation_time": 5,
                "calories": 520
            },
            
            # İçecekler (Drinks)
            {
                "name": "Taze Portakal Suyu",
                "name_tr": "Taze Portakal Suyu",
                "description": "Sıkma günlük portakal suyu.",
                "price": Decimal("120"),
                "category": MenuCategory.drinks,
                "dietary_tags": ["vegan"],
                "preparation_time": 5,
                "calories": 120
            },
            {
                "name": "Ev Yapımı Limonata",
                "name_tr": "Ev Yapımı Limonata",
                "description": "Buzlu, naneli seçenekleriyle hafif ekşi-dengeli lezzet.",
                "price": Decimal("110"),
                "category": MenuCategory.drinks,
                "dietary_tags": ["vegan"],
                "preparation_time": 5,
                "calories": 140
            },
            {
                "name": "Şeftalili Soğuk Çay",
                "name_tr": "Şeftalili Soğuk Çay",
                "description": "Demlenmiş çay bazlı, şeftali aromalı ferah içecek.",
                "price": Decimal("105"),
                "category": MenuCategory.drinks,
                "dietary_tags": ["vegan"],
                "preparation_time": 3,
                "calories": 110
            },
            {
                "name": "Türk Kahvesi",
                "name_tr": "Türk Kahvesi",
                "description": "Klasik, orta kavrum Türk kahvesi.",
                "price": Decimal("80"),
                "category": MenuCategory.drinks,
                "dietary_tags": ["vegan"],
                "preparation_time": 8,
                "calories": 5
            },
            {
                "name": "Cappuccino",
                "name_tr": "Cappuccino",
                "description": "Yoğun espresso ve süt köpüğü ile.",
                "price": Decimal("95"),
                "category": MenuCategory.drinks,
                "dietary_tags": ["vegetarian"],
                "preparation_time": 5,
                "calories": 80
            },
            {
                "name": "Latte",
                "name_tr": "Latte",
                "description": "Yumuşak içimli, süt oranı yüksek kahve.",
                "price": Decimal("105"),
                "category": MenuCategory.drinks,
                "dietary_tags": ["vegetarian"],
                "preparation_time": 5,
                "calories": 120
            },
            {
                "name": "Sade Soda",
                "name_tr": "Sade Soda",
                "description": "Gazlı mineral içecek.",
                "price": Decimal("60"),
                "category": MenuCategory.drinks,
                "dietary_tags": ["vegan"],
                "preparation_time": 1,
                "calories": 0
            },
            
            # Şaraplar (Wines)
            {
                "name": "Château Elegante Reserva",
                "name_tr": "Château Elegante Reserva",
                "description": "Yoğun tanenli, karadut ve siyah erik notalarına sahip gövdeli kırmızı.",
                "price": Decimal("1700"),
                "category": MenuCategory.wines,
                "preparation_time": 2,
                "calories": 125
            },
            {
                "name": "Borcelle Cabernet Special",
                "name_tr": "Borcelle Cabernet Special",
                "description": "Meşe fıçıda dinlendirilmiş, baharat ve siyah meyve notaları taşıyan özel harman.",
                "price": Decimal("950"),
                "category": MenuCategory.wines,
                "preparation_time": 2,
                "calories": 130
            },
            {
                "name": "Pinot Noir Rosé Serenade",
                "name_tr": "Pinot Noir Rosé Serenade",
                "description": "Çilek ve narenciye profiline sahip, hafif gövdeli taze roze.",
                "price": Decimal("850"),
                "category": MenuCategory.wines,
                "preparation_time": 2,
                "calories": 115
            },
            {
                "name": "Sauvignon Blanc Crystal",
                "name_tr": "Sauvignon Blanc Crystal",
                "description": "Tropik meyve ve bitkisel notalara sahip, yüksek asiditeli ferah beyaz şarap.",
                "price": Decimal("900"),
                "category": MenuCategory.wines,
                "preparation_time": 2,
                "calories": 105
            },
            {
                "name": "Chardonnay Gold Barrel",
                "name_tr": "Chardonnay Gold Barrel",
                "description": "Vanilya ve tereyağı hissi barındıran, tam gövdeli fıçı Chardonnay.",
                "price": Decimal("1100"),
                "category": MenuCategory.wines,
                "preparation_time": 2,
                "calories": 120
            },
            {
                "name": "Prosecco Stella",
                "name_tr": "Prosecco Stella",
                "description": "İnce kabarcıklı, hafif tatlı bitişli İtalyan prosecco.",
                "price": Decimal("820"),
                "category": MenuCategory.wines,
                "preparation_time": 2,
                "calories": 98
            },
            {
                "name": "Champagne Maison Royale",
                "name_tr": "Champagne Maison Royale",
                "description": "Özel anlar için önerilen, dengeli asiditeye sahip prestijli Champagne.",
                "price": Decimal("4800"),
                "category": MenuCategory.wines,
                "preparation_time": 2,
                "calories": 95
            },
        ]
        
        for item_data in menu_items:
            menu_item = MenuItem(**item_data)
            db.add(menu_item)
        
        db.commit()
        print("✓ Menu items created")
        
        # Create sample reservation
        tomorrow = date.today() + timedelta(days=1)
        reservation = Reservation(
            user_id=customer_user.id,
            date=tomorrow,
            time=time(19, 0),  # 7:00 PM
            party_size=4,
            special_request="Window seat preferred",
            confirmation_number=f"RES-{uuid.uuid4().hex[:8].upper()}",
            status=ReservationStatus.confirmed
        )
        db.add(reservation)
        db.commit()
        print("✓ Sample reservation created")
        
        print("\n✅ Database seeded successfully!")
        print("\nTest accounts:")
        print("  Admin: admin@restaurant.com / admin123")
        print("  Manager: manager@restaurant.com / manager123")
        print("  Server: server@restaurant.com / server123")
        print("  Kitchen: kitchen@restaurant.com / kitchen123")
        print("  Customer: john.doe@example.com / customer123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

