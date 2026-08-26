import React, { useState } from 'react';

const tokenize = (expression) => {
  const compact = expression.replace(/\s/g, '');
  const tokens = compact.match(/\d*\.?\d+|[()+\-*/]/g) || [];
  if (tokens.join('') !== compact) throw new Error('Invalid expression');
  return tokens;
};

const evaluateExpression = (expression) => {
  const tokens = tokenize(expression);
  let position = 0;

  const parseFactor = () => {
    const token = tokens[position];
    if (token === '+' || token === '-') {
      position += 1;
      const value = parseFactor();
      return token === '-' ? -value : value;
    }
    if (token === '(') {
      position += 1;
      const value = parseExpression();
      if (tokens[position] !== ')') throw new Error('Unclosed group');
      position += 1;
      return value;
    }
    const value = Number(token);
    if (!Number.isFinite(value)) throw new Error('Invalid number');
    position += 1;
    return value;
  };

  const parseTerm = () => {
    let value = parseFactor();
    while (tokens[position] === '*' || tokens[position] === '/') {
      const operator = tokens[position];
      position += 1;
      const right = parseFactor();
      value = operator === '*' ? value * right : value / right;
    }
    return value;
  };

  const parseExpression = () => {
    let value = parseTerm();
    while (tokens[position] === '+' || tokens[position] === '-') {
      const operator = tokens[position];
      position += 1;
      const right = parseTerm();
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  };

  if (!tokens.length) throw new Error('Empty expression');
  const result = parseExpression();
  if (position !== tokens.length || !Number.isFinite(result)) throw new Error('Invalid result');
  return result;
};

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        setResult(String(evaluateExpression(input)));
      } catch {
        setResult('error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '⌫') {
      setInput(current => current.slice(0, -1));
    } else {
      setInput(current => current + value);
    }
  };

  const keys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '(', ')', 'C', '⌫', '+', '='];

  return (
    <section className="tui-tool calculator">
      <div className="tui-tool-titlebar">
        <strong>/calculator</strong>
        <span>recursive-descent · local</span>
      </div>
      <div className="calculator-display" aria-live="polite">
        <div className="calculator-input">{input || '0'}</div>
        <div className="calculator-result">{result && `= ${result}`}</div>
      </div>
      <div className="calculator-buttons">
        {keys.map(key => (
          <button
            key={key}
            type="button"
            className={`${['/', '*', '-', '+'].includes(key) ? 'is-operator' : ''} ${key === '=' ? 'is-primary' : ''} ${key === 'C' ? 'is-danger' : ''}`.trim()}
            onClick={() => handleButtonClick(key)}
          >
            {key}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Calculator;
