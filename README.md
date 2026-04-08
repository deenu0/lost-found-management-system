# 🔍 Lost & Found Management System

A full-stack web application for managing lost and found items in a college campus. Built as a Major Project.

![Lost & Found](frontend/public/logo.png)

## ✨ Features

### For Students
- 📢 Report lost or found items with photos
- 🔍 Browse all reports with smart filters
- 🙋 Submit claims with evidence photos
- 🔒 All personal details kept private

### For Admin
- 🔐 Hidden admin panel (type `AdminLogin` in search)
- 📋 View all reports with full reporter details
- ✅ Approve or reject claims
- 🗑️ Delete spam reports
- 🌙 Dark mode support
- 🔑 Change admin password

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| ORM | SQLAlchemy (Async) |
| Image Storage | Local uploads / Cloudinary ready |
| Notifications | Email via SMTP |

## 📁 Project Structure

```
lost-found/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── item.py
│   │   │   └── claim.py
│   │   ├── schemas/
│   │   │   ├── item.py
│   │   │   └── claim.py
│   │   ├── routes/
│   │   │   ├── items.py
│   │   │   ├── claims.py
│   │   │   └── admin.py
│   │   ├── services/
│   │   │   ├── item_service.py
│   │   │   ├── claim_service.py
│   │   │   ├── upload_service.py
│   │   │   └── notification_service.py
│   │   ├── repositories/
│   │   │   ├── item_repository.py
│   │   │   └── claim_repository.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   └── dependencies.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── logo.png
    ├── src/
    │   ├── api/
    │   │   ├── axios.js
    │   │   ├── items.js
    │   │   └── claims.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── tailwind.config.js
```

## 🚀 Local Setup

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 17

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Start server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

```bash
# Connect to PostgreSQL and run schema
psql -U postgres -d lostfound -f schema.sql
```

## ⚙️ Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/lostfound
JWT_SECRET=your-secret-key
SMTP_USER=your@gmail.com
SMTP_PASSWORD=your-app-password
```

## 🔐 Admin Access

1. Go to the website
2. Type `AdminLogin` in the search bar
3. Enter admin password (default: `admin@lostfound123`)
4. Access the full admin dashboard

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/items/` | Report an item |
| GET | `/api/v1/items/` | List all items |
| GET | `/api/v1/items/{id}` | Get item details |
| POST | `/api/v1/claims/{item_id}` | Submit a claim |
| GET | `/api/v1/admin/items` | Admin: all items |
| PATCH | `/api/v1/admin/claims/{id}/review` | Admin: review claim |

## 👨‍💻 Developer

**Deenu** — College Major Project

---

