import React, { useState } from 'react';
// CSS import removed for CSS Naked Day

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
    <div>
      <h3>Calculator</h3>
      <div>
        <div><strong>Input:</strong> {input}</div>
        <div><strong>Result:</strong> {result}</div>
      </div>
      <table border="1" cellpadding="5">
        <tbody>
          <tr>
            <td><button onClick={() => handleButtonClick('7')}>7</button></td>
            <td><button onClick={() => handleButtonClick('8')}>8</button></td>
            <td><button onClick={() => handleButtonClick('9')}>9</button></td>
            <td><button onClick={() => handleButtonClick('C')}>C</button></td>
          </tr>
          <tr>
            <td><button onClick={() => handleButtonClick('4')}>4</button></td>
            <td><button onClick={() => handleButtonClick('5')}>5</button></td>
            <td><button onClick={() => handleButtonClick('6')}>6</button></td>
            <td><button onClick={() => handleButtonClick('/')}>/</button></td>
          </tr>
          <tr>
            <td><button onClick={() => handleButtonClick('1')}>1</button></td>
            <td><button onClick={() => handleButtonClick('2')}>2</button></td>
            <td><button onClick={() => handleButtonClick('3')}>3</button></td>
            <td><button onClick={() => handleButtonClick('*')}>*</button></td>
          </tr>
          <tr>
            <td><button onClick={() => handleButtonClick('0')}>0</button></td>
            <td><button onClick={() => handleButtonClick('.')}>.</button></td>
            <td><button onClick={() => handleButtonClick('=')}>=</button></td>
            <td><button onClick={() => handleButtonClick('-')}>-</button></td>
          </tr>
          <tr>
            <td><button onClick={() => handleButtonClick('(')}>(</button></td>
            <td><button onClick={() => handleButtonClick(')')}>)</button></td>
            <td colSpan="2"><button onClick={() => handleButtonClick('+')}>+</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Calculator;