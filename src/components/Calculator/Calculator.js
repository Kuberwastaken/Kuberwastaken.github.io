import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  // Handle button click events
  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        // Evaluate the expression
        setResult(eval(input));
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      // Clear the input and result
      setInput('');
      setResult('');
    } else {
      // Append the clicked button value to the input
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