import React, { useState, useEffect } from 'react';
import './Jarvis.css';

const Jarvis = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      { text: 'Hello, my name is JARVIS. I\'m an AI chatbot designed by Kuber Mehta to assist you!', isJarvis: true }
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
    e.target.elements.query.value = '';
    setResponse('');
    handleJarvisQuery(query);
  };

  // Function to render text with line breaks
  const renderTextWithLineBreaks = (text) => {
    return text.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="jarvis-container">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg.isJarvis ? (
              <div className="jarvis-response">
                <strong>Jarvis:</strong> {renderTextWithLineBreaks(msg.text)}
              </div>
            ) : (
              <>
                <div className="user-message">
                  <strong>You:</strong> {renderTextWithLineBreaks(msg.text)}
                </div>
                {msg.response && (
                  <div className="jarvis-response">
                    <strong>Jarvis:</strong> {renderTextWithLineBreaks(msg.response)}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        {loading && <div className="loading">Loading...</div>}
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input 
          type="text" 
          name="query" 
          placeholder="Ask Jarvis something..." 
          className="query-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default Jarvis;