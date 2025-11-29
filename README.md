# Marketing Campaign Generator

Generate compelling marketing campaigns for your products using AI. Create content for social media, email, ads, and more in seconds.

## Features

- **Multi-Platform Support**: Generate content for Facebook, Instagram, Twitter, LinkedIn, TikTok, and more
- **AI-Powered**: Leverage advanced AI to create engaging, targeted marketing copy
- **Multiple Campaign Types**: Social media posts, email campaigns, ad copy, blog posts, landing pages
- **Save & Manage**: Store your campaigns and access them anytime

## Tech Stack

**Backend:**
- Python 3.11+
- FastAPI
- Pydantic
- OpenAI / Anthropic APIs (optional)

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Query

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Run the server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/campaigns/generate` | Generate a new campaign |
| GET | `/api/campaigns/` | List all campaigns |
| GET | `/api/campaigns/{id}` | Get a specific campaign |
| DELETE | `/api/campaigns/{id}` | Delete a campaign |

## Project Structure

```
marketing-campaign-generator/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI application
│   │   ├── routes/           # API routes
│   │   ├── models/           # Pydantic models
│   │   └── services/         # Business logic
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── types/            # TypeScript types
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## License

MIT
