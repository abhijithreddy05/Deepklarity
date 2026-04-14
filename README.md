# Markdown Notes Application 📝

A full-stack, responsive, and beautifully designed Markdown Notes Application. Built with **React** (via Vite), **Node.js** (Express), and **SQLite** to meet the requirements of the SDE assignment.

## ✨ Features

- **Live Split-Screen Preview**: See rendered Markdown in real-time.
- **Auto-save (Debounced)**: Avoids API spam by automatically saving exactly 1 second after typing stops.
- **Full CRUD operations**: Create, read, update, delete notes effortlessly.
- **Search Notes**: Find notes using the search bar instantly.
- **Dark Mode**: Switch between Dark and Light modes on the fly.
- **Responsive Design**: Auto-adjusting UI that works beautifully across mobile and desktop.
- **No external DB required**: Utilizing SQLite which sets up automatically and requires no separate server.

## ⚙️ Tech Stack
- **Frontend**: React.js 18, Vite, `react-markdown`, `lucide-react`, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: SQLite3 (`sqlite3`)

---

## 🚀 Setup Instructions

### 1. Prerequisites
- **Node.js**: `v16.14.0` or higher
- **npm** (comes with Node)

### 2. Setting Up the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd ./backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables (Optional, defaults to 5005):
   ```bash
   touch .env
   echo "PORT=5005" >> .env
   ```
4. Start the backend server:
   ```bash
   # In development
   node server.js
   ```
*(Note: A `database.sqlite` file is automatically generated in the `backend/` directory upon first launch and the `notes` table is created. Do not worry about running separate sync or migration commands.)*

### 3. Setting Up the Frontend
1. Open a *new* terminal and navigate to the frontend directory:
   ```bash
   cd ./frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```

### 4. Running the App
- The application will be running locally at `http://localhost:5173`.
- Make sure both the **backend** and **frontend** terminal instances are simultaneously running.

---

## 🎨 Design Decisions

- **Vite over CRA**: `create-react-app` is outdated, sluggish, and generally discouraged by the core React community in modern stacks. I chose Vite for blazing-fast HMR and significantly faster build times.
- **Custom Theming**: Rather than relying on a heavy UI library like Tailwind, the whole interface leverages elegant, pure vanilla CSS variables, demonstrating firm mastery over visual implementation and design fundamentals.
- **SQLite Database**: Keeping the database local eliminates the need for reviewers to create a `.env` postgres uri and ensures quick testability. 
- **Debounced Save hook**: Instead of building convoluted context, a clean `useDebounce` hook listens to UI changes, maintaining synchronization organically.
