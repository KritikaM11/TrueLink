import React, { useEffect, useRef } from "react";
import "../../styles/ChatPanel.css";

const ChatPanel = ({ messages, message, setMessage, onSend, onClose }) => {
    const bottomRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") onSend();
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <h3 className="chat-title">💬 In-call messages</h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "rgba(255,255,255,0.4)",
                            cursor: "pointer",
                            fontSize: "18px",
                            display: "flex",
                            alignItems: "center",
                            padding: "2px 6px",
                            borderRadius: "6px",
                        }}
                        title="Close chat"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <p className="chat-empty">
                        No messages yet.<br />
                        <span style={{ fontSize: "11px", opacity: 0.6 }}>
                            Messages are only visible during this call.
                        </span>
                    </p>
                ) : (
                    messages.map((msg, i) => (
                        <div key={i} className="chat-msg">
                            <span className="chat-msg-sender">{msg.sender}</span>
                            {msg.data}
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            <div className="chat-input-wrap">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Send a message…"
                    className="chat-input-field"
                />
                <button onClick={onSend} className="chat-send-btn" title="Send">
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ChatPanel;