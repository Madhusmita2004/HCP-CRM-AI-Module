from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
import os
from langchain_groq import ChatGroq

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY not found in environment")

llm = ChatGroq(
    api_key=api_key,
    model="llama-3.3-70b-versatile" 
)
# ======================
# TOOLS
# ======================

def log_tool(state):
    try:
        res = llm.invoke(
            f"Summarize this HCP interaction clinically:\n{state['input']}"
        )
        return {"result": res.content}
    except Exception as e:
        return {"result": f"LLM Error: {str(e)}"}


def edit_tool(state):
    try:
        res = llm.invoke(
            f"Rewrite this medical note professionally and clearly:\n{state['input']}"
        )
        return {"result": res.content}
    except Exception as e:
        return {"result": f"LLM Error in edit_tool: {str(e)}"}


def get_tool(state):
    try:
        return {"result": "Fetched interactions (demo mode)"}
    except Exception as e:
        return {"result": f"Error in get_tool: {str(e)}"}


def summarize_tool(state):
    try:
        res = llm.invoke(
            f"Give a short medical summary:\n{state['input']}"
        )
        return {"result": res.content}
    except Exception as e:
        return {"result": f"LLM Error in summarize_tool: {str(e)}"}


def suggest_tool(state):
    try:
        res = llm.invoke(
            f"Suggest follow-up actions for this patient case in a clinical way:\n{state['input']}"
        )
        return {"result": res.content}
    except Exception as e:
        return {"result": f"LLM Error in suggest_tool: {str(e)}"}
    
def schedule_tool(state):
    try:
        # In a real app, this would talk to a Calendar API
        return {"result": "Successfully scheduled a follow-up meeting for next week."}
    except Exception as e:
        return {"result": f"Error: {str(e)}"}

# ======================
# ROUTER
# ======================

def agent(state):
    text = state["input"].lower()

    if "edit" in text:
        return {"next": "edit", "input": state["input"]}
    elif "get" in text:
        return {"next": "get", "input": state["input"]}
    elif "summary" in text:
        return {"next": "summarize", "input": state["input"]}
    elif "suggest" in text:
        return {"next": "suggest", "input": state["input"]}
    else:
        return {"next": "log", "input": state["input"]}

# ======================
# GRAPH
# ======================

graph = StateGraph(dict)

graph.add_node("agent", agent)
graph.add_node("log", log_tool)
graph.add_node("edit", edit_tool)
graph.add_node("get", get_tool)
graph.add_node("summarize", summarize_tool)
graph.add_node("suggest", suggest_tool)

graph.set_entry_point("agent")

graph.add_conditional_edges(
    "agent",
    lambda x: x["next"],
    {
        "log": "log",
        "edit": "edit",
        "get": "get",
        "summarize": "summarize",
        "suggest": "suggest",
    },
)

graph.add_edge("log", END)
graph.add_edge("edit", END)
graph.add_edge("get", END)
graph.add_edge("summarize", END)
graph.add_edge("suggest", END)

app_graph = graph.compile()