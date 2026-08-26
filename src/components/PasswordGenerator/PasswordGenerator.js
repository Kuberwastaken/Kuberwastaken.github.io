import React, { useState, useCallback } from 'react';
import './PasswordGenerator.css';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);

  const characterSets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
    ambiguous: '{}[]()/\\\'"`~,;.<>'
  };

  const calculateStrength = (pass) => {
    let score = 0;
    
    // Length scoring
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (pass.length >= 16) score += 1;
    
    // Character type scoring - check if password actually contains these
    if (/[a-z]/.test(pass)) score += 1; // Has lowercase
    if (/[A-Z]/.test(pass)) score += 1; // Has uppercase
    if (/\d/.test(pass)) score += 1; // Has numbers
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pass)) score += 1; // Has symbols
    
    // Bonus points for very long passwords
    if (pass.length >= 20) score += 1;
    
    // Character diversity bonus
    const uniqueChars = new Set(pass).size;
    if (uniqueChars >= pass.length * 0.7) score += 1; // High character diversity
    
    return Math.min(score, 5);
  };

  const generatePassword = useCallback(() => {
    let charset = '';
    if (options.lowercase) charset += characterSets.lowercase;
    if (options.uppercase) charset += characterSets.uppercase;
    if (options.numbers) charset += characterSets.numbers;
    if (options.symbols) charset += characterSets.symbols;

    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !characterSets.similar.includes(char)).join('');
    }
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !characterSets.ambiguous.includes(char)).join('');
    }

    if (charset === '') {
      setPassword('');
      setStrength(0);
      return;
    }

    let newPassword = '';
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length];
    }

    setPassword(newPassword);
    setStrength(calculateStrength(newPassword));
    setCopied(false);
  }, [length, options]);

  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = password;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOptionChange = (option) => {
    const newOptions = { ...options, [option]: !options[option] };
    setOptions(newOptions);
  };

  const getStrengthColor = () => {
    const colors = ['#d64545', '#d6a545', '#d6d645', '#a5d645', '#45d645'];
    return colors[Math.max(0, strength - 1)] || '#d64545';
  };

  const getStrengthText = () => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[Math.max(0, strength - 1)] || 'Very Weak';
  };

  const presetPasswords = [
    { name: 'Secure (16 chars)', length: 16, options: { lowercase: true, uppercase: true, numbers: true, symbols: true, excludeSimilar: true, excludeAmbiguous: false } },
    { name: 'PIN (4 digits)', length: 4, options: { lowercase: false, uppercase: false, numbers: true, symbols: false, excludeSimilar: false, excludeAmbiguous: false } },
    { name: 'Alphanumeric (12)', length: 12, options: { lowercase: true, uppercase: true, numbers: true, symbols: false, excludeSimilar: false, excludeAmbiguous: false } },
    { name: 'Max Security (20)', length: 20, options: { lowercase: true, uppercase: true, numbers: true, symbols: true, excludeSimilar: true, excludeAmbiguous: true } }
  ];

  const applyPreset = (preset) => {
    setLength(preset.length);
    setOptions(preset.options);
  };

  return (
    <div className="password-generator">
      <div className="password-header">
        <h3>🔐 Password Generator</h3>
        <p>Generate secure, cryptographically random passwords</p>
      </div>

      <div className="password-output">
        <div className="password-display">
          <input
            type="text"
            value={password}
            readOnly
            placeholder="Generated password will appear here..."
            className="password-field"
          />
          <button
            onClick={copyToClipboard}
            disabled={!password}
            className={`copy-btn ${copied ? 'copied' : ''}`}
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>
        
        {password && (
          <div className="password-strength">
            <div className="strength-bar">
              <div 
                className="strength-fill"
                style={{ 
                  width: `${(strength / 5) * 100}%`,
                  backgroundColor: getStrengthColor()
                }}
              />
            </div>
            <span style={{ color: getStrengthColor() }}>
              {getStrengthText()}
            </span>
          </div>
        )}
      </div>

      <div className="password-controls">
        <div className="length-control">
          <label>
            Length: <span className="length-value">{length}</span>
          </label>
          <input
            type="range"
            min="4"
            max="50"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="length-slider"
          />
          <div className="length-labels">
            <span>4</span>
            <span>50</span>
          </div>
        </div>

        <div className="options-grid">
          <label className="option-item">
            <input
              type="checkbox"
              checked={options.lowercase}
              onChange={() => handleOptionChange('lowercase')}
            />
            <span className="checkmark"></span>
            Lowercase (a-z)
          </label>
          
          <label className="option-item">
            <input
              type="checkbox"
              checked={options.uppercase}
              onChange={() => handleOptionChange('uppercase')}
            />
            <span className="checkmark"></span>
            Uppercase (A-Z)
          </label>
          
          <label className="option-item">
            <input
              type="checkbox"
              checked={options.numbers}
              onChange={() => handleOptionChange('numbers')}
            />
            <span className="checkmark"></span>
            Numbers (0-9)
          </label>
          
          <label className="option-item">
            <input
              type="checkbox"
              checked={options.symbols}
              onChange={() => handleOptionChange('symbols')}
            />
            <span className="checkmark"></span>
            Symbols (!@#$...)
          </label>
          
          <label className="option-item">
            <input
              type="checkbox"
              checked={options.excludeSimilar}
              onChange={() => handleOptionChange('excludeSimilar')}
            />
            <span className="checkmark"></span>
            Exclude Similar (il1Lo0O)
          </label>
          
          <label className="option-item">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={() => handleOptionChange('excludeAmbiguous')}
            />
            <span className="checkmark"></span>
            Exclude Ambiguous
          </label>
        </div>

        <div className="action-buttons">
          <button onClick={generatePassword} className="generate-btn">
            🎲 Generate Password
          </button>
          <button onClick={() => setPassword('')} className="clear-btn">
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="presets-section">
        <h4>Quick Presets:</h4>
        <div className="preset-buttons">
          {presetPasswords.map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(preset)}
              className="preset-btn"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator; 