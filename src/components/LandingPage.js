import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import "./LandingPage.css";

const LandingPage = () => {
  const [languageIndex, setLanguageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [letterIndex, setLetterIndex] = useState(0);

  const navigate = useNavigate();
  // Use useMemo to memoize the languages array
  const languages = useMemo(
    () => ["Welcome", "Bienvenido", "Bienvenue", "Willkommen", "欢迎", "أهلاً وسهلاً"],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLanguageIndex((prevIndex) => (prevIndex + 1) % languages.length);
      setLetterIndex(0); // Reset letter index on language change
    }, 5000); // Change language every 5 seconds

    return () => clearInterval(interval);
  }, [languages.length]);

  useEffect(() => {
    const typeInterval = setInterval(() => {
      setDisplayedText((prevText) => {
        const fullText = languages[languageIndex];
        return fullText.substring(0, letterIndex + 1);
      });

      setLetterIndex((prevIndex) => prevIndex + 1);
    }, 100); // Type letter by letter every 100ms

    if (letterIndex === languages[languageIndex].length) {
      clearInterval(typeInterval);
    }

    return () => clearInterval(typeInterval);
  }, [languageIndex, letterIndex, languages]);

  return (
    <div className="landing-container">
      <div className="text-container">
        <h1 className="animated-text">{displayedText}</h1>
      </div>
      <div className="button-container">
        <button className="btn btn-signin" onClick={() => navigate('/signin')}>Sign In</button>
        <button className="btn btn-signup" onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </div>
  );
};

export default LandingPage;
