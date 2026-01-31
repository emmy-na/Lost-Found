<<<<<<< HEAD
# Lost & Found Application

A full-stack web application built with Laravel (backend) and React (frontend) for managing lost and found items.

## 🎯 Features

- User authentication (register/login/logout)
- Role-based access control (user/admin)
- Report lost/found items
- Browse and filter items
- View personal items
- Admin panel for managing all items
- Responsive UI with Tailwind CSS

## 🛠️ Tech Stack

- **Backend**: Laravel 11.x with Sanctum for API authentication
- **Frontend**: React 18.x with TypeScript and Tailwind CSS
- **Database**: MySQL
- **Containerization**: Docker & Docker Compose
- **API**: RESTful API with JWT-like authentication via Sanctum

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js (for local development without Docker)

## 🚀 Installation & Setup

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <your-repo-url>
cd projet-fin-de-formation
```

2. Build and start the containers:
```bash
docker-compose up -d --build
```

3. Install backend dependencies and run migrations:
```bash
docker-compose exec backend composer install
docker-compose exec backend php artisan migrate --seed
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Admin user credentials: admin@example.com / password

### Local Development Setup

#### Backend (Laravel)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Create a copy of the `.env` file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure your database settings in `.env`

6. Run migrations:
```bash
php artisan migrate --seed
```

7. Start the Laravel server:
```bash
php artisan serve
```

#### Frontend (React)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a copy of the `.env` file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

## 🗂️ Project Structure

```
projet-fin-de-formation/
├── backend/                 # Laravel backend
│   ├── app/                # Application code
│   │   ├── Http/           # Controllers, Middleware
│   │   ├── Models/         # Eloquent models
│   │   └── ...
│   ├── database/           # Migrations, Seeds, Factories
│   ├── routes/             # API and web routes
│   ├── tests/              # Unit and Feature tests
│   └── ...
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── ...
├── docker-compose.yml      # Docker configuration
└── README.md
```

## 🔐 Roles & Permissions

- **User**: Can register, login, report items, view all items, manage own items
- **Admin**: All user permissions plus manage all items (update status, delete)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout the current user
- `GET /api/auth/me` - Get current user info

### Items
- `GET /api/items` - Get all items (with optional filters: type, location, search)
- `GET /api/items/{id}` - Get a specific item
- `POST /api/items` - Create a new item (requires authentication)
- `PUT /api/items/{id}` - Update an item (requires authentication)
- `DELETE /api/items/{id}` - Delete an item (requires authentication)
- `GET /api/my-items` - Get items created by the authenticated user

### Admin-only Endpoints
- Admin users can access all item endpoints and manage all items regardless of ownership

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
php artisan test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🐳 Docker Commands

- Start services: `docker-compose up -d`
- Stop services: `docker-compose down`
- View logs: `docker-compose logs -f`
- Run backend commands: `docker-compose exec backend <command>`
- Run frontend commands: `docker-compose exec frontend <command>`

## 🚨 Troubleshooting

- If you encounter permission errors on Linux, try changing the ownership of the storage directories
- Make sure all Docker ports (3000, 8000, 3306) are available
- Clear Docker cache if experiencing build issues: `docker system prune -a`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
=======
# Lost-Found
>>>>>>> 445ef239851e76ecd5e242c12498654899c59930
