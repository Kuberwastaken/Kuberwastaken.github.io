import React, { useState, useEffect } from 'react';
import './Jarvis.css';

const Jarvis = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);  // Added loading state
  const [messages, setMessages] = useState([]);  // For keeping track of messages

  useEffect(() => {
    setMessages([
      { text: 'Hello, my name is JARVIS. I\'m an AI chatbot designed by Kuber Mehta to assist you!', isJarvis: true } // Add isJarvis to mark the message as from Jarvis
    ]);
  }, []);  

  const handleJarvisQuery = async (query) => {
    setLoading(true);
    try {
      const res = await fetch('https://jarvis-backend-r9vl.onrender.com/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: query }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Unknown error');
      }
  
      const data = await res.json();
      const responseText = 
        data.generated_text || 
        data.text || 
        data[0]?.generated_text || 
        'No response received';
  
      setMessages(prevMessages => [...prevMessages, { text: query, response: responseText }]);
      setResponse(responseText);
    } catch (error) {
      console.error('Query Error:', error);
      setMessages(prevMessages => [...prevMessages, { text: query, response: `Error: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.query.value;
    e.target.elements.query.value = '';  // Clear input field after submitting
    setResponse('');  // Clear previous response before making a new query
    handleJarvisQuery(query);
  };

  return (
    <div className="jarvis-container">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg.isJarvis ? (
              <div className="jarvis-response">
                <strong>Jarvis:</strong> {msg.text}
              </div>
            ) : (
              <div className="user-message">
                <strong>You:</strong> {msg.text}
              </div>
            )}
            {msg.response && (
              <div className="jarvis-response">
                <strong>Jarvis:</strong> {msg.response}
              </div>
            )}
          </div>
        ))}

        {/* Show loading indicator */}
        {loading && <div className="loading">Loading...</div>}
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input type="text" name="query" placeholder="Ask Jarvis something..." className="query-input" />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default Jarvis;
