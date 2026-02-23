# Ronit Kumar — Portfolio

A Django portfolio with a live admin editor, Supabase database, and one-click deploy.

---

## ⚡ Quick Start (Local)

```bash
# 1. Clone / unzip the project
cd portfolio

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy env file
cp .env.example .env
# Edit .env with your values (see Supabase setup below)

# 5. Run migrations
python manage.py migrate

# 6. Collect static files
python manage.py collectstatic --noinput

# 7. Start server
python manage.py runserver
```

Open **http://127.0.0.1:8000** — portfolio is live.
Open **http://127.0.0.1:8000/admin-panel/** — editor (password: `ronit2025`).

---

## 🗄️ Supabase Setup (Recommended)

Supabase gives you a free managed PostgreSQL database — your data persists
across deploys unlike SQLite.

### Step 1 — Create a Supabase project

1. Go to **https://supabase.com** → Sign up / Log in
2. Click **New Project**
3. Fill in:
   - **Name**: `portfolio` (or anything)
   - **Database Password**: pick a strong password — **save this!**
   - **Region**: `ap-south-1` (Mumbai) — closest to Bengaluru
4. Click **Create new project** and wait ~2 minutes

### Step 2 — Get your connection string

1. In your project dashboard, go to:
   **Settings** (gear icon) → **Database** → scroll to **Connection string**
2. Select the **URI** tab
3. Copy the string — it looks like:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with the database password you set in Step 1

> ⚠️ Use **port 6543** (Transaction pooler), not 5432. This works on hobby hosting.

### Step 3 — Add to your .env

Open your `.env` file and set:
```env
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
SECRET_KEY=some-long-random-string-here
ADMIN_PASSWORD=your-chosen-password
DEBUG=False
```

### Step 4 — Run migrations against Supabase

```bash
python manage.py migrate
```

Done — your tables are now in Supabase!

---

## 🚀 Deploy on Railway (Free Hosting)

Railway is the easiest way to host a Django app for free.

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Portfolio v3 – Supabase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

### Step 2 — Deploy on Railway

1. Go to **https://railway.app** → Log in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `portfolio` repo
4. Railway will detect the `Procfile` and start deploying

### Step 3 — Add environment variables on Railway

In your Railway project → **Variables** tab, add:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | any long random string |
| `DATABASE_URL` | your Supabase URI from above |
| `ADMIN_PASSWORD` | your chosen password |
| `DEBUG` | `False` |

### Step 4 — Generate a domain

Railway → **Settings** → **Domains** → **Generate Domain**

Your site is live at `https://yourproject.up.railway.app` 🎉

---

## ➕ Adding a New Section (Future)

To add a completely new section (e.g., "Awards", "Talks", "Certifications"):

### 1. Add a Model (`portfolio/models.py`)

```python
class Award(models.Model):
    title       = models.CharField(max_length=200)
    issuer      = models.CharField(max_length=200)
    year        = models.CharField(max_length=10)
    description = models.TextField(blank=True)
    link        = models.URLField(blank=True)
    order       = models.PositiveIntegerField(default=0)
    class Meta:
        ordering = ['order']
```

### 2. Create a Migration

```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Add to View (`portfolio/views.py`)

In the `index` and `admin_panel` functions, add:
```python
from .models import Award
awards = Award.objects.all()
# add 'awards': awards to context dict
```

Add a save API endpoint (copy pattern from `api_save_research`).

### 4. Add URL (`portfolio/urls.py`)

```python
path('api/awards/', views.api_save_awards, name='api_awards'),
```

### 5. Add to Public Template (`templates/index.html`)

Add nav item in sidebar:
```html
<a href="#awards" class="nav-item" data-section="awards">
  <svg>...</svg> Awards
</a>
```

Add section block (copy pattern from research section).

### 6. Add to Admin Panel (`templates/admin_panel.html`)

Add nav button + tab panel (copy pattern from research tab).

---

## 📁 Project Structure

```
portfolio/
├── .env.example              ← copy to .env, fill in secrets
├── .gitignore
├── Procfile                  ← for Railway/Heroku deploy
├── manage.py
├── requirements.txt
├── runtime.txt
├── portfolio/
│   ├── settings.py           ← DATABASE_URL config here
│   ├── urls.py
│   ├── views.py              ← all page + API logic
│   ├── models.py             ← database models
│   └── migrations/
├── templates/
│   ├── index.html            ← public portfolio
│   ├── admin_login.html      ← login page
│   └── admin_panel.html      ← editor dashboard
└── static/
    ├── css/style.css         ← public design
    ├── css/admin.css         ← admin design
    ├── js/main.js            ← public JS
    └── js/admin.js           ← admin JS (CRUD, photo upload)
```

---

## 🔑 Key Files to Know

| File | What to edit |
|------|-------------|
| `portfolio/settings.py` | Database, allowed hosts, secret key |
| `.env` | All secrets and config (never commit!) |
| `portfolio/models.py` | Add new data models |
| `templates/index.html` | Public site layout + new sections |
| `templates/admin_panel.html` | Admin editor tabs |
| `static/css/style.css` | Visual design tokens |

