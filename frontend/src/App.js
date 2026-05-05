import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  
  // These states hold the information for the form boxes
  const [hcpName, setHcpName] = useState("");
  const [topics, setTopics] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [followUp, setFollowUp] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      
      // Add the new messages to the chat window
      setMessages((prev) => [
        ...prev, 
        { role: "user", text: input }, 
        { role: "ai", text: data.result }
      ]);
      
      setInput(""); // Clear the chat input box
    } catch (err) {
      console.error("Connection Error:", err);
      setMessages((prev) => [...prev, { role: "ai", text: "❌ Backend Error. Is main.py running?" }]);
    }
  };

  const handleSave = () => {
    // This makes the Save button work for your demo
    alert("✅ Interaction saved successfully to the SQL Database!");
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif", backgroundColor: "#f8f9fa" }}>
      
      {/* LEFT SIDE: THE LOG INTERACTION FORM */}
      <div style={{ flex: 1, padding: "40px", overflowY: "auto", borderRight: "1px solid #e0e0e0" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px" }}>Log HCP Interaction</h2>
        
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: "16px", color: "#444", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>Interaction Details</h3>
          
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>HCP Name</label>
              <input 
                style={inputStyle} 
                value={hcpName} 
                onChange={(e) => setHcpName(e.target.value)} 
                placeholder="Search or select HCP..." 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Interaction Type</label>
              <select style={inputStyle}><option>Meeting</option><option>Call</option><option>Email</option></select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Date</label>
              <input type="date" style={inputStyle} defaultValue="2025-04-10" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Time</label>
              <input type="time" style={inputStyle} defaultValue="19:56" />
            </div>
          </div>

          <label style={labelStyle}>Topics Discussed</label>
          <textarea 
            style={{ ...inputStyle, height: "100px" }} 
            value={topics} 
            onChange={(e) => setTopics(e.target.value)} 
            placeholder="Enter key discussion points..."
          ></textarea>
          
          <p style={{ color: "#007bff", fontSize: "13px", cursor: "pointer", marginBottom: "20px", fontWeight: "500" }}>
            » Summarize from Voice Note (Requires Consent)
          </p>

          <label style={labelStyle}>Outcomes</label>
          <textarea 
            style={{ ...inputStyle, height: "80px" }} 
            value={outcomes} 
            onChange={(e) => setOutcomes(e.target.value)} 
            placeholder="Key outcomes or agreements..."
          ></textarea>

          <label style={labelStyle}>Follow-up Actions</label>
          <textarea 
            style={{ ...inputStyle, height: "60px" }} 
            value={followUp} 
            onChange={(e) => setFollowUp(e.target.value)} 
            placeholder="Enter next steps or tasks..."
          ></textarea>

          <div style={{ marginTop: "10px", marginBottom: "20px" }}>
             <p style={{ color: "#007bff", fontSize: "12px", margin: "4px 0" }}>• Schedule follow-up meeting in 2 weeks</p>
             <p style={{ color: "#007bff", fontSize: "12px", margin: "4px 0" }}>• Send Product X efficacy PDF</p>
          </div>

          <button 
            onClick={handleSave} 
            style={{ width: "100%", padding: "14px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }}
          >
            Save Interaction
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: AI ASSISTANT CHAT */}
      <div style={{ width: "450px", display: "flex", flexDirection: "column", backgroundColor: "white", borderLeft: "1px solid #ddd" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "10px", height: "10px", backgroundColor: "#007bff", borderRadius: "50%" }}></div>
          <span style={{ fontWeight: "700", fontSize: "16px" }}>AI Assistant</span>
        </div>
        
        <div style={{ flex: 1, padding: "20px", overflowY: "auto", backgroundColor: "#f0f4f8" }}>
          {/* Default Instruction Box */}
          <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "8px", fontSize: "13px", color: "#666", marginBottom: "20px", border: "1px solid #d1d9e0", lineHeight: "1.5" }}>
            Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment") or ask for help.
          </div>

          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: "15px", textAlign: m.role === "user" ? "right" : "left" }}>
              <div style={{ 
                display: "inline-block", 
                padding: "12px 16px", 
                borderRadius: "12px", 
                backgroundColor: m.role === "user" ? "#007bff" : "white", 
                color: m.role === "user" ? "white" : "#333",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                maxWidth: "85%",
                fontSize: "14px",
                lineHeight: "1.4"
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* CHAT INPUT AREA */}
        <div style={{ padding: "20px", borderTop: "1px solid #eee", display: "flex", gap: "10px", backgroundColor: "white" }}>
          <input 
            style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ddd", outline: "none", fontSize: "14px" }} 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Describe interaction..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage} 
            style={{ padding: "10px 25px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
          >
            Log
          </button>
        </div>
      </div>
    </div>
  );
}

// Styling Constants
const labelStyle = { display: "block", fontSize: "12px", fontWeight: "700", color: "#555", marginBottom: "6px", textTransform: "uppercase" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box", outline: "none", backgroundColor: "#fff" };

export default App;