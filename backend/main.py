# 1. Import everything we need
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from agent import app_graph  # This imports your LangGraph logic

# 2. Setup the Database (SQLite is the easiest SQL database)
# This will create a file named "hcp_crm.db" automatically
DATABASE_URL = "sqlite:///./hcp_crm.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 3. Define the Database Table (The "Notebook" structure)
class InteractionLog(Base):
    __tablename__ = "interactions"
    id = Column(Integer, primary_key=True, index=True)
    user_input = Column(Text)
    ai_summary = Column(Text)

# Create the table in the database file
Base.metadata.create_all(bind=engine)

# 4. Setup FastAPI
app = FastAPI()

# Enable CORS so your React frontend can talk to this Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Define what the incoming Chat request looks like
class ChatRequest(BaseModel):
    input: str

# 6. The Home Route
@app.get("/")
def home():
    return {"message": "HCP CRM Backend is Running 🚀"}

# 7. The Main Chat Route (The "Brain" of the operation)
@app.post("/chat")
def chat(req: ChatRequest):
    db = SessionLocal()
    try:
        # Step A: Send the input to your LangGraph Agent
        result = app_graph.invoke({"input": req.input})
        
        # Step B: Get the text result from the Agent
        final_answer = result.get("result", str(result))

        # Step C: SAVE the interaction to your SQL Database
        new_log = InteractionLog(
            user_input=req.input,
            ai_summary=final_answer
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)

        # Step D: Send the answer back to the React Frontend
        return {"result": final_answer}

    except Exception as e:
        print(f"ERROR: {str(e)}")
        return {"result": f"Error: {str(e)}"}
    finally:
        db.close()