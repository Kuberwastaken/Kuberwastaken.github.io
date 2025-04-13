import React, { useState, useEffect, useRef } from 'react';
import './Jarvis.css';

// Utility function to parse markdown-style formatting
const parseMarkdown = (text) => {
  if (!text) return '';
  
  // Replace bold text: **text** -> <strong>text</strong>
  let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace italic text: *text* -> <em>text</em>
  parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Replace code blocks: ```code``` -> <pre><code>code</code></pre>
  parsed = parsed.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
  
  // Replace inline code: `code` -> <code>code</code>
  parsed = parsed.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Replace links: [text](url) -> <a href="url">text</a>
  parsed = parsed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  return parsed;
};

const Jarvis = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  
  const chatWindowRef = useRef(null);
  const API_URL = 'https://jarvis-backend-r9vl.onrender.com';

  useEffect(() => {
    // Initialize session when component mounts
    const initSession = async () => {
      try {
        const res = await fetch(`${API_URL}/start-session`);
        const data = await res.json();
        setSessionId(data.session_id);
        
        // Save session ID to localStorage for persistence
        localStorage.setItem('jarvis_session_id', data.session_id);
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };
    
    // Check if we have a session ID in localStorage
    const savedSessionId = localStorage.getItem('jarvis_session_id');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      initSession();
    }
    
    setMessages([
      {
        text: 'Hello, my name is **JARVIS**. I\'m an AI assistant designed by *Kuber Mehta* to assist you with information about his portfolio and projects. How may I help you today?',
        isJarvis: true
      }
    ]);
  }, []);

  // Scroll to bottom of chat window when messages update
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleJarvisQuery = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    
    // Add user message to chat immediately
    setMessages(prevMessages => [
      ...prevMessages, 
      { text: query, isUser: true }
    ]);
    
    try {
      const res = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          inputs: query,
          session_id: sessionId
        }),
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      const data = await res.json();
      const responseText = data.generated_text || 'No response received';

      // Add Jarvis response to chat
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: responseText, isJarvis: true }
      ]);
      
      setResponse(responseText);
    } catch (error) {
      console.error('Query Error:', error);
      
      // Add error message to chat
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          text: `I apologize, but I'm experiencing a technical issue: ${error.message}. Please try again later.`, 
          isJarvis: true, 
          isError: true 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = inputValue;
    setInputValue('');
    handleJarvisQuery(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const renderTextWithLineBreaks = (text) => {
    const parsedLines = text.split('\n').map((line, index) => {
      return (
        <div
          key={index}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(line) }}
          className="markdown-line"
        />
      );
    });
    
    return <div className="markdown-content">{parsedLines}</div>;
  };

  return (
    <div className="jarvis-container">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg.isUser ? (
              <div className="user-message">
                <strong>You:</strong> {renderTextWithLineBreaks(msg.text)}
              </div>
            ) : (
              <div className={`jarvis-response ${msg.isError ? 'error-message' : ''}`}>
                <strong>Jarvis:</strong> {renderTextWithLineBreaks(msg.text)}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="loading">Loading...</div>}
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Jarvis something..."
          className="query-input"
        />
        <button type="submit" className="send-button" disabled={loading || !inputValue.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Jarvis;