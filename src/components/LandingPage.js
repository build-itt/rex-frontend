import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import "./LandingPage.css";

const LandingPage = () => {
  const [languageIndex, setLanguageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [letterIndex, setLetterIndex] = useState(0);
  const navigate = useNavigate();
  
  // Use refs to hold interval IDs to prevent memory leaks
  const languageIntervalRef = useRef(null);
  const typeIntervalRef = useRef(null);
  
  // Use useMemo to memoize the languages array
  const languages = useMemo(
    () => ["Welcome", "Bienvenido", "Bienvenue", "Willkommen", "欢迎", "أهلاً وسهلاً"],
    []
  );

  // Clear any existing intervals when component unmounts
  useEffect(() => {
    return () => {
      if (languageIntervalRef.current) clearInterval(languageIntervalRef.current);
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    };
  }, []);

  // Handle language rotation
  useEffect(() => {
    // Clear any existing interval first to prevent memory leaks
    if (languageIntervalRef.current) clearInterval(languageIntervalRef.current);
    
    languageIntervalRef.current = setInterval(() => {
      setLanguageIndex((prevIndex) => (prevIndex + 1) % languages.length);
      setLetterIndex(0); // Reset letter index on language change
    }, 5000); // Change language every 5 seconds

    return () => {
      if (languageIntervalRef.current) clearInterval(languageIntervalRef.current);
    };
  }, [languages.length]);

  // Handle typing effect
  useEffect(() => {
    // Clear any existing interval first
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    
    if (letterIndex < languages[languageIndex].length) {
      typeIntervalRef.current = setInterval(() => {
        setDisplayedText(languages[languageIndex].substring(0, letterIndex + 1));
        setLetterIndex((prevIndex) => prevIndex + 1);
      }, 100); // Type letter by letter every 100ms
    }

    return () => {
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    };
  }, [languageIndex, letterIndex, languages]);

  // Handle navigation
  const handleNavigation = (path) => {
    // Clear intervals before navigating
    if (languageIntervalRef.current) clearInterval(languageIntervalRef.current);
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    navigate(path);
  };

  return (
    <div className="landing-container">
      <div className="text-container">
        <h1 className="animated-text">{displayedText}</h1>
      </div>
      <div className="button-container">
        <button className="btn btn-signin" onClick={() => handleNavigation('/signin')}>Sign In</button>
        <button className="btn btn-signup" onClick={() => handleNavigation('/signup')}>Sign Up</button>
      </div>
    </div>
  );
};

export default LandingPage;
