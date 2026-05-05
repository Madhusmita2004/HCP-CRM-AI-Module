# AI-First CRM - HCP Interaction Module

An intelligent CRM module designed for Healthcare Professionals (HCPs). This application allows medical representatives to log interactions using a natural language AI assistant that automatically populates structured CRM forms.

## 🚀 Overview
The core of this project is a **Conversational AI Agent** that handles the heavy lifting of data entry. By simply describing a meeting in plain English, the agent extracts clinical details, summarizes the conversation, and saves it directly to a database.

## 🛠️ Tech Stack
- **Frontend:** React.js, Redux (State Management), Inter Font (UI/UX).
- **Backend:** Python FastAPI.
- **AI Orchestration:** LangGraph (Stateful Multi-step Agent).
- **LLM:** Groq (Llama-3.3-70b-versatile).
- **Database:** SQL (SQLite via SQLAlchemy).

## 📂 Project Structure
```text
HCP-CRM-AI-Module/
├── backend/
│   ├── main.py          # FastAPI Server
│   ├── agent.py         # LangGraph & AI Tools logic
│   ├── requirements.txt # Python Dependencies
│   └── hcp_crm.db       # SQLite Database
├── frontend/
│   ├── src/             # React Components (App.js, etc.)
│   ├── public/          # HTML & Assets
│   └── package.json     # Node Dependencies
└── README.md            # Project Documentation


🤖AI Capabilities
The agent is equipped with 5 specialized tools built in LangGraph:

Log Interaction: Parses chat to extract HCP name, topics, and outcomes.
Edit Interaction: Updates existing records based on user corrections.
Summarize: Generates professional clinical summaries.
Suggest Action: Provides next-best-action recommendations.
Fetch History: Retrieves past interactions for context.


⚙️ How to Run

1. Backend
Bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
2. Frontend
Bash
cd frontend
npm install
npm start
