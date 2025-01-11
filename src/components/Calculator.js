import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        setResult(eval(input)); // Note: eval can be dangerous, consider using a safer alternative
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
    } else {
      setInput(input + value);
    }
  };

  return (
    <div className="calculator">
      <div className="calculator-display">
        <div className="calculator-input">{input}</div>
        <div className="calculator-result">{result}</div>
      </div>
      <div className="calculator-buttons">
        {['7', '8', '9', 'C', '4', '5', '6', '/', '1', '2', '3', '*', '0', '.', '=', '-', '(', ')', '+'].map((button) => (
          <button key={button} onClick={() => handleButtonClick(button)}>
            {button}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;