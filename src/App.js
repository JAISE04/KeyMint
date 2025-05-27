import React, { useState, useEffect } from 'react';
import './App.css';
import { Moon, Sun } from 'lucide-react';

const App = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  const getStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    const levels = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
    const colors = ['#888', 'red', 'orange', 'green', 'darkgreen'];
    return {
      label: levels[strength] || 'Very Weak',
      color: colors[strength] || 'gray',
    };
  };

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}<>?';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let charSet = '';
    const guarantees = [];

    if (includeLowercase) {
      charSet += lowercase;
      guarantees.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
    }
    if (includeNumbers) {
      charSet += numbers;
      guarantees.push(numbers[Math.floor(Math.random() * numbers.length)]);
    }
    if (includeSymbols) {
      charSet += symbols;
      guarantees.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    if (includeUppercase) {
      charSet += uppercase;
      guarantees.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
    }

    if (charSet === '') {
      setError('Please select at least one character type.');
      return;
    }

    let newPassword = guarantees;
    for (let i = guarantees.length; i < length; i++) {
      newPassword.push(charSet[Math.floor(Math.random() * charSet.length)]);
    }

    newPassword = newPassword.sort(() => 0.5 - Math.random()).join('');
    setPassword(newPassword);
    setCopied(false);
    setError('');
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <div className="toggle-switch">
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => {
                const newTheme = !darkMode;
                setDarkMode(newTheme);
                localStorage.setItem('theme', newTheme ? 'dark' : 'light');
              }}
            />
            <span className="slider round"></span>
          </label>
          {darkMode ? <Moon size={18} /> : <Sun size={18} />}
        </div>
      </div>
<div className="brand">
  <img src="/keymint-logo.png" alt="KeyMint Logo" className="logo" />
  <span className="brand-name">KeyMint</span>
</div>


      <h1>🔐 Random Password Generator</h1>

      <div className="settings">
        <label>
          Password Length:
          <input
            type="number"
            min="4"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={() => setIncludeLowercase(!includeLowercase)}
          />
          Include Lowercase
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={() => setIncludeUppercase(!includeUppercase)}
          />
          Include Uppercase
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={() => setIncludeNumbers(!includeNumbers)}
          />
          Include Numbers
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={() => setIncludeSymbols(!includeSymbols)}
          />
          Include Symbols
        </label>
        {error && <p className="error">{error}</p>}
      </div>

      <button className="generate-btn" onClick={generatePassword}>
        Generate Password
      </button>

      {password && (
        <div className="result">
          <h2>Your Password:</h2>
          <div className="password-box">
            <span>{showPassword ? password : '*'.repeat(password.length)}</span>
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
            <button onClick={() => {
              navigator.clipboard.writeText(password);
              setCopied(true);
            }}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{ marginTop: 10, color: getStrength(password).color }}>
            Strength: {getStrength(password).label}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
