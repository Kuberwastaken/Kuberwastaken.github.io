import React, { useCallback, useEffect, useState } from 'react';

const QRGenerator = () => {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateQR = useCallback(async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      // Using QR Server API for generating QR codes
      const encodedText = encodeURIComponent(text);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}`;
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsLoading(false);
    }
  }, [text]);

  const downloadQR = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    setText('');
    setQrCodeUrl('');
  };

  useEffect(() => {
    if (text.trim()) {
      const timer = setTimeout(() => {
        generateQR();
      }, 500); // Debounce for auto-generation
      
      return () => clearTimeout(timer);
    } else {
      setQrCodeUrl('');
    }
  }, [generateQR, text]);

  return (
    <section className="tui-tool qr-generator">
      <div className="tui-tool-titlebar">
        <strong>/qr-generator</strong>
        <span>api.qrserver.com · 200×200</span>
      </div>
      <div className="qr-header">
        <h3>QR code generator</h3>
        <p>Encode text, URLs, or arbitrary data.</p>
      </div>
      
      <div className="qr-input-section">
        <div className="input-group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="data> enter text or a URL"
            rows="3"
            maxLength="2000"
          />
          <div className="char-counter">
            {text.length}/2000
          </div>
        </div>
        
        <div className="button-group">
          <button onClick={generateQR} disabled={!text.trim() || isLoading}>
            {isLoading ? 'Generating...' : 'Generate QR'}
          </button>
          <button onClick={clearAll} className="clear-btn">
            Clear
          </button>
        </div>
      </div>

      {qrCodeUrl && (
        <div className="qr-result">
          <div className="qr-code-container">
            <img src={qrCodeUrl} alt="Generated QR Code" />
          </div>
          <div className="qr-actions">
            <button onClick={downloadQR} className="download-btn">
              Download PNG
            </button>
            <div className="qr-info">
              <small>Right-click to save image or use download button</small>
            </div>
          </div>
        </div>
      )}

      <div className="qr-examples">
        <h4>Presets</h4>
        <div className="example-buttons">
          <button onClick={() => setText('https://kuber.studio/')}>
            portfolio
          </button>
          <button onClick={() => setText('https://github.com/Kuberwastaken')}>
            github
          </button>
          <button onClick={() => setText('Hello from Kuber\'s Terminal!')}>
            sample text
          </button>
        </div>
      </div>
    </section>
  );
};

export default QRGenerator;
