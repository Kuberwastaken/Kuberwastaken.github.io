import React, { useState, useEffect } from 'react';
// CSS import removed for CSS Naked Day: https://css-naked-day.github.io/

// Utility function to parse markdown-style formatting
const parseMarkdown = (text) => {
  if (!text) return '';
  
  // Replace bold text: **text** -> <strong>text</strong>
  let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace italic text: *text* -> <em>text</em>
  parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  return parsed;
};

const Jarvis = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        text: 'Hello, my name is **JARVIS**. I\'m an AI chatbot designed by *Kuber Mehta* to assist you!',
        isJarvis: true
      }
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
      const responseText = data.generated_text || data.text || data[0]?.generated_text || 'No response received';

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

  const renderTextWithLineBreaks = (text) => {
    const parsedLines = text.split('\n').map((line, index) => {
      return (
        <div
          key={index}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(line) }}
        />
      );
    });
    
    return <div>{parsedLines}</div>;
  };

  return (
    <div>
      <table border="1" cellpadding="10">
        <tbody>
          <tr>
            <td>
              {messages.map((msg, index) => (
                <div key={index}>
                  {msg.isJarvis ? (
                    <div>
                      <strong>Jarvis:</strong> {renderTextWithLineBreaks(msg.text)}
                    </div>
                  ) : (
                    <>
                      <div>
                        <strong>You:</strong> {renderTextWithLineBreaks(msg.text)}
                      </div>
                      {msg.response && (
                        <div>
                          <strong>Jarvis:</strong> {renderTextWithLineBreaks(msg.response)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              {loading && <div><em>Loading...</em></div>}

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="query"
                  placeholder="Ask Jarvis something..."
                  size="40"
                />
                <button type="submit">
                  Send
                </button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Jarvis;