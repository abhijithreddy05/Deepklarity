# DeepKlarity Recipe Extractor & Meal Planner 🍲

This project fulfills the DeepKlarity Technologies assignment using a **React Frontend** and a **Python FastAPI Backend**, strictly avoiding Node.js for backend processing. It uses **PostgreSQL**, **BeautifulSoup** for HTML scraping, and **LangChain + Gemini API** for LLM generation of structured JSON data.

## ⚙️ Tech Stack
- **Frontend**: React.js (Vite), Pure CSS with Premium Aesthetics.
- **Backend**: Python 3, FastAPI, Uvicorn.
- **Database**: PostgreSQL (via SQLAlchemy).
- **Scraping**: BeautifulSoup (bs4).
- **LLM Integration**: LangChain & Gemini (langchain-google-genai).

## 🚀 Setup Instructions

### 1. Backend (Python/FastAPI) setup:
1. Navigate to the backend directory:
   ```bash
   cd ./backend
   ```
2. Create your virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Set your environment variables (create a `.env` file inside `backend/`!):
   ```bash
   # backend/.env
   GEMINI_API_KEY="AIzaSy...your-gemini-key"
   DATABASE_URL="postgresql://user:password@host/db" # Fallbacks to SQLite recipes.db if empty
   ```
4. Start the server (runs on `http://localhost:8000`):
   ```bash
   uvicorn main:app --reload
   ```

### 2. Frontend (React/Vite) setup:
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ./frontend
   ```
2. Install dependencies (we still use npm to build the React vite app!):
   ```bash
   npm install
   ```
3. Run the development server (runs on `http://localhost:5173`):
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### `POST /api/extract`
Accepts a generic recipe blog URL, scrapes the content, uses LangChain to generate structured JSON data, saves it to PostgreSQL, and returns the response.
- **Body**: `{"url": "https://url.com"}`

### `GET /api/history`
Returns a list of all extracted recipes saved in the PostgreSQL database, ordered by creation date.

## 📝 Testing Steps
1. Make sure both your Gemini API Key and your Database URL are configured.
2. Run backend and frontend side-by-side.
3. Open the UI at `http://localhost:5173`.
4. Enter `https://www.allrecipes.com/recipe/23891/grilled-cheese-sandwich/` into Tab 1.
5. Click Extract and wait for the LLM inference step. The resulting rich UI will appear shortly after.
6. Switch to Tab 2 to see the History Table populated with your recent extractions.

## 📂 Deliverables Included
- **`prompts/`**: Contains the precise LangChain extraction markdown templates.
- **`sample_data/`**: Contains generated JSON examples.
- **`backend/`**: Strict FastAPI Python project per the assignment guidelines.
