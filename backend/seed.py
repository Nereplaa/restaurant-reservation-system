"""
Database seeding script
"""
from app.database import SessionLocal, engine, Base
from app.models import User, Table, MenuItem, Reservation, Order, OrderItem
from app.models.user import UserRole
from app.models.table import TableStatus
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
            email="customer@example.com",
            password_hash=hash_password("customer123"),
            first_name="John",
            last_name="Doe",
            phone="+1234567894",
            role=UserRole.customer
        )
        
        db.add_all([admin_user, manager_user, server_user, kitchen_user, customer_user])
        db.commit()
        print("✓ Users created")
        
        # Create tables
        tables_data = [
            {"table_number": "T-01", "capacity": 2, "location": "Main Floor"},
            {"table_number": "T-02", "capacity": 4, "location": "Main Floor"},
            {"table_number": "T-03", "capacity": 4, "location": "Main Floor"},
            {"table_number": "T-04", "capacity": 6, "location": "Main Floor"},
            {"table_number": "T-05", "capacity": 8, "location": "Private Room"},
            {"table_number": "T-06", "capacity": 2, "location": "Patio"},
            {"table_number": "T-07", "capacity": 4, "location": "Patio"},
            {"table_number": "T-08", "capacity": 6, "location": "Patio"},
        ]
        
        for table_data in tables_data:
            table = Table(**table_data, status=TableStatus.available)
            db.add(table)
        
        db.commit()
        print("✓ Tables created")
        
        # Create menu items - Turkish Restaurant Menu
        menu_items = [
            # Soups
            {
                "name": "Lentil Soup",
                "name_tr": "Mercimek Çorbası",
                "description": "Traditional Turkish red lentil soup",
                "price": Decimal("8.99"),
                "category": MenuCategory.soups,
                "dietary_tags": ["vegetarian", "vegan"],
                "preparation_time": 10,
                "calories": 180
            },
            {
                "name": "Yogurt Soup",
                "name_tr": "Yayla Çorbası",
                "description": "Creamy yogurt and rice soup with mint",
                "price": Decimal("9.99"),
                "category": MenuCategory.soups,
                "dietary_tags": ["vegetarian"],
                "preparation_time": 15,
                "calories": 220
            },
            
            # Appetizers
            {
                "name": "Hummus",
                "name_tr": "Humus",
                "description": "Chickpea puree with tahini, olive oil, and garlic",
                "price": Decimal("12.99"),
                "category": MenuCategory.appetizers,
                "dietary_tags": ["vegetarian", "vegan"],
                "preparation_time": 5,
                "calories": 240
            },
            {
                "name": "Stuffed Grape Leaves",
                "name_tr": "Yaprak Sarma",
                "description": "Grape leaves stuffed with rice, herbs, and spices",
                "price": Decimal("14.99"),
                "category": MenuCategory.appetizers,
                "dietary_tags": ["vegetarian", "vegan"],
                "preparation_time": 10,
                "calories": 180
            },
            {
                "name": "Fried Calamari",
                "name_tr": "Kalamar Tava",
                "description": "Crispy fried squid rings with special sauce",
                "price": Decimal("16.99"),
                "category": MenuCategory.appetizers,
                "preparation_time": 15,
                "calories": 320
            },
            
            # Kebabs
            {
                "name": "Adana Kebab",
                "name_tr": "Adana Kebap",
                "description": "Spicy minced lamb kebab on skewer",
                "price": Decimal("24.99"),
                "category": MenuCategory.kebabs,
                "preparation_time": 25,
                "calories": 480,
                "protein": Decimal("35.0")
            },
            {
                "name": "Chicken Shish Kebab",
                "name_tr": "Tavuk Şiş",
                "description": "Marinated grilled chicken cubes",
                "price": Decimal("22.99"),
                "category": MenuCategory.kebabs,
                "preparation_time": 20,
                "calories": 380,
                "protein": Decimal("40.0")
            },
            {
                "name": "Lamb Shish Kebab",
                "name_tr": "Kuzu Şiş",
                "description": "Tender grilled lamb cubes",
                "price": Decimal("26.99"),
                "category": MenuCategory.kebabs,
                "preparation_time": 25,
                "calories": 420,
                "protein": Decimal("38.0")
            },
            
            # Mains
            {
                "name": "Lamb Stew",
                "name_tr": "Kuzu Güveç",
                "description": "Slow-cooked lamb with vegetables in clay pot",
                "price": Decimal("28.99"),
                "category": MenuCategory.mains,
                "preparation_time": 30,
                "calories": 520
            },
            {
                "name": "Turkish Meatballs",
                "name_tr": "İnegöl Köfte",
                "description": "Traditional Turkish meatballs with spices",
                "price": Decimal("21.99"),
                "category": MenuCategory.mains,
                "preparation_time": 20,
                "calories": 450
            },
            {
                "name": "Sultan's Delight",
                "name_tr": "Hünkar Beğendi",
                "description": "Lamb stew on smoky eggplant puree",
                "price": Decimal("29.99"),
                "category": MenuCategory.mains,
                "preparation_time": 30,
                "calories": 560
            },
            
            # Desserts
            {
                "name": "Baklava",
                "name_tr": "Baklava",
                "description": "Layers of filo pastry with nuts and honey syrup",
                "price": Decimal("10.99"),
                "category": MenuCategory.desserts,
                "dietary_tags": ["vegetarian"],
                "preparation_time": 5,
                "calories": 380
            },
            {
                "name": "Turkish Delight",
                "name_tr": "Lokum",
                "description": "Traditional Turkish candy",
                "price": Decimal("8.99"),
                "category": MenuCategory.desserts,
                "dietary_tags": ["vegetarian", "vegan"],
                "preparation_time": 5,
                "calories": 280
            },
            {
                "name": "Kunefe",
                "name_tr": "Künefe",
                "description": "Shredded pastry with cheese, soaked in syrup",
                "price": Decimal("12.99"),
                "category": MenuCategory.desserts,
                "dietary_tags": ["vegetarian"],
                "preparation_time": 15,
                "calories": 520
            },
            
            # Drinks
            {
                "name": "Turkish Tea",
                "name_tr": "Çay",
                "description": "Traditional black tea in tulip glass",
                "price": Decimal("3.99"),
                "category": MenuCategory.drinks,
                "dietary_tags": ["vegetarian", "vegan"],
                "preparation_time": 5,
                "calories": 0
            },
            {
                "name": "Turkish Coffee",
                "name_tr": "Türk Kahvesi",
                "description": "Strong traditional coffee",
                "price": Decimal("5.99"),
                "category": MenuCategory.drinks,
                "dietary_tags": ["vegetarian", "vegan"],
                "preparation_time": 10,
                "calories": 5
            },
            {
                "name": "Ayran",
                "name_tr": "Ayran",
                "description": "Refreshing yogurt drink",
                "price": Decimal("4.99"),
                "category": MenuCategory.drinks,
                "dietary_tags": ["vegetarian"],
                "preparation_time": 5,
                "calories": 80
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
        print("  Customer: customer@example.com / customer123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

