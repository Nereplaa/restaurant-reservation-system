import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️  Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.table.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@restaurant.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: 'admin',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create some customer users
  console.log('👥 Creating customer users...');
  const customerPassword = await bcrypt.hash('customer123', 10);
  
  const customer1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      passwordHash: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567891',
      role: 'customer',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      passwordHash: customerPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1234567892',
      role: 'customer',
    },
  });

  // Create kitchen staff user
  console.log('👨‍🍳 Creating kitchen staff user...');
  const kitchenPassword = await bcrypt.hash('kitchen123', 10);
  
  await prisma.user.create({
    data: {
      email: 'kitchen@restaurant.com',
      passwordHash: kitchenPassword,
      firstName: 'Chef',
      lastName: 'Kitchen',
      phone: '+1234567893',
      role: 'kitchen',
    },
  });

  // Create tables
  console.log('🪑 Creating tables...');
  const tables = [];
  
  // Small tables (2-person capacity)
  for (let i = 1; i <= 5; i++) {
    tables.push(
      await prisma.table.create({
        data: {
          tableNumber: `T${i.toString().padStart(2, '0')}`,
          capacity: 2,
          location: 'Main Dining Area',
          status: 'available',
        },
      })
    );
  }

  // Medium tables (4-person capacity)
  for (let i = 6; i <= 12; i++) {
    tables.push(
      await prisma.table.create({
        data: {
          tableNumber: `T${i.toString().padStart(2, '0')}`,
          capacity: 4,
          location: 'Main Dining Area',
          status: 'available',
        },
      })
    );
  }

  // Large tables (6-person capacity)
  for (let i = 13; i <= 15; i++) {
    tables.push(
      await prisma.table.create({
        data: {
          tableNumber: `T${i.toString().padStart(2, '0')}`,
          capacity: 6,
          location: 'Private Section',
          status: 'available',
        },
      })
    );
  }

  // Create menu items
  console.log('🍽️  Creating menu items...');

  // Appetizers
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce, parmesan cheese, croutons, and Caesar dressing',
        price: 8.99,
        category: 'appetizers',
        dietaryTags: ['vegetarian'],
        preparationTime: 10,
        available: true,
      },
      {
        name: 'Bruschetta',
        description: 'Toasted bread topped with tomatoes, garlic, basil, and olive oil',
        price: 7.99,
        category: 'appetizers',
        dietaryTags: ['vegan', 'vegetarian'],
        preparationTime: 8,
        available: true,
      },
      {
        name: 'Mozzarella Sticks',
        description: 'Crispy breaded mozzarella served with marinara sauce',
        price: 9.99,
        category: 'appetizers',
        dietaryTags: ['vegetarian'],
        preparationTime: 12,
        available: true,
      },
      {
        name: 'Buffalo Wings',
        description: 'Spicy chicken wings served with blue cheese dressing',
        price: 11.99,
        category: 'appetizers',
        dietaryTags: [],
        preparationTime: 15,
        available: true,
      },
    ],
  });

  // Main courses
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with lemon butter sauce, vegetables, and rice',
        price: 24.99,
        category: 'mains',
        dietaryTags: ['gluten-free'],
        preparationTime: 25,
        available: true,
      },
      {
        name: 'Ribeye Steak',
        description: '12oz premium ribeye with garlic mashed potatoes and asparagus',
        price: 32.99,
        category: 'mains',
        dietaryTags: ['gluten-free'],
        preparationTime: 30,
        available: true,
      },
      {
        name: 'Chicken Parmesan',
        description: 'Breaded chicken breast with marinara sauce and melted mozzarella',
        price: 19.99,
        category: 'mains',
        dietaryTags: [],
        preparationTime: 25,
        available: true,
      },
      {
        name: 'Vegetable Pasta',
        description: 'Penne pasta with seasonal vegetables in olive oil and garlic',
        price: 16.99,
        category: 'mains',
        dietaryTags: ['vegan', 'vegetarian'],
        preparationTime: 20,
        available: true,
      },
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil',
        price: 14.99,
        category: 'mains',
        dietaryTags: ['vegetarian'],
        preparationTime: 18,
        available: true,
      },
    ],
  });

  // Desserts
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
        price: 8.99,
        category: 'desserts',
        dietaryTags: ['vegetarian'],
        preparationTime: 5,
        available: true,
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        price: 9.99,
        category: 'desserts',
        dietaryTags: ['vegetarian'],
        preparationTime: 12,
        available: true,
      },
      {
        name: 'Cheesecake',
        description: 'New York style cheesecake with berry compote',
        price: 7.99,
        category: 'desserts',
        dietaryTags: ['vegetarian'],
        preparationTime: 5,
        available: true,
      },
    ],
  });

  // Drinks
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Coca Cola',
        description: 'Classic Coca Cola',
        price: 2.99,
        category: 'drinks',
        dietaryTags: ['vegan', 'vegetarian'],
        preparationTime: 2,
        available: true,
      },
      {
        name: 'Fresh Lemonade',
        description: 'Homemade lemonade with fresh lemons',
        price: 3.99,
        category: 'drinks',
        dietaryTags: ['vegan', 'vegetarian'],
        preparationTime: 3,
        available: true,
      },
      {
        name: 'Iced Tea',
        description: 'Freshly brewed iced tea',
        price: 2.99,
        category: 'drinks',
        dietaryTags: ['vegan', 'vegetarian'],
        preparationTime: 2,
        available: true,
      },
      {
        name: 'Coffee',
        description: 'Freshly brewed coffee',
        price: 2.49,
        category: 'drinks',
        dietaryTags: ['vegan', 'vegetarian'],
        preparationTime: 3,
        available: true,
      },
    ],
  });

  // Create some sample reservations
  console.log('📅 Creating sample reservations...');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.reservation.create({
    data: {
      userId: customer1.id,
      tableId: tables[5].id,
      date: tomorrow,
      time: new Date('1970-01-01T19:00:00'),
      partySize: 4,
      status: 'confirmed',
      specialRequest: 'Window seat if possible',
      confirmationNumber: 'RES-DEMO-001',
    },
  });

  await prisma.reservation.create({
    data: {
      userId: customer2.id,
      tableId: tables[12].id,
      date: tomorrow,
      time: new Date('1970-01-01T20:00:00'),
      partySize: 6,
      status: 'confirmed',
      specialRequest: 'Celebrating anniversary',
      confirmationNumber: 'RES-DEMO-002',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:');
  console.log('  Email: admin@restaurant.com');
  console.log('  Password: admin123');
  console.log('\nKitchen Staff:');
  console.log('  Email: kitchen@restaurant.com');
  console.log('  Password: kitchen123');
  console.log('\nCustomer 1:');
  console.log('  Email: john.doe@example.com');
  console.log('  Password: customer123');
  console.log('\nCustomer 2:');
  console.log('  Email: jane.smith@example.com');
  console.log('  Password: customer123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

