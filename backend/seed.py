import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_data():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Check if admin exists
    existing_admin = await db.users.find_one({'email': 'admin@glasshq.com'})
    
    if not existing_admin:
        # Create admin user
        hashed_pw = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        admin_user = {
            'id': 'admin-001',
            'email': 'admin@glasshq.com',
            'password': hashed_pw,
            'name': 'Admin User',
            'role': 'Admin',
            'employee_id': None,
            'created_at': '2025-01-01T00:00:00'
        }
        await db.users.insert_one(admin_user)
        print('✓ Admin user created: admin@glasshq.com / admin123')
    else:
        print('✓ Admin user already exists')
    
    # Create some sample employees
    emp_count = await db.employees.count_documents({})
    if emp_count == 0:
        sample_employees = [
            {
                'id': 'emp-001',
                'employee_id': 'EMP0001',
                'name': 'John Doe',
                'email': 'john@glasshq.com',
                'phone': '+91 9876543210',
                'department': 'Engineering',
                'job_role': 'Senior Developer',
                'joining_date': '2024-01-15',
                'salary': 80000,
                'status': 'Active',
                'profile_photo': None,
                'address': 'Mumbai, India',
                'emergency_contact': '+91 9876543211',
                'created_at': '2024-01-15T00:00:00'
            },
            {
                'id': 'emp-002',
                'employee_id': 'EMP0002',
                'name': 'Jane Smith',
                'email': 'jane@glasshq.com',
                'phone': '+91 9876543212',
                'department': 'HR',
                'job_role': 'HR Manager',
                'joining_date': '2024-02-01',
                'salary': 65000,
                'status': 'Active',
                'profile_photo': None,
                'address': 'Bangalore, India',
                'emergency_contact': '+91 9876543213',
                'created_at': '2024-02-01T00:00:00'
            },
            {
                'id': 'emp-003',
                'employee_id': 'EMP0003',
                'name': 'Robert Chen',
                'email': 'robert@glasshq.com',
                'phone': '+91 9876543214',
                'department': 'Marketing',
                'job_role': 'Marketing Lead',
                'joining_date': '2024-03-10',
                'salary': 70000,
                'status': 'Active',
                'profile_photo': None,
                'address': 'Delhi, India',
                'emergency_contact': '+91 9876543215',
                'created_at': '2024-03-10T00:00:00'
            }
        ]
        await db.employees.insert_many(sample_employees)
        print(f'✓ Created {len(sample_employees)} sample employees')
    else:
        print(f'✓ {emp_count} employees already exist')
    
    client.close()
    print('✓ Database seeding completed!')

if __name__ == '__main__':
    asyncio.run(seed_data())
