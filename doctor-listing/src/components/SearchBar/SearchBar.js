import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, doctors, ...props }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    // Add click outside listener to close suggestions
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    onSearch(value);

    // Generate suggestions
    if (value.trim()) {
      const matches = doctors
        .filter(doctor => 
          doctor?.name?.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 3); // Get top 3 matches
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (doctorName) => {
    setInput(doctorName);
    onSearch(doctorName);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(input);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search Symptoms, Doctors, Specialists, Clinics"
        className="search-input"
        data-testid="autocomplete-input"
        {...props}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-container" ref={suggestionsRef}>
          {suggestions.map((doctor, index) => (
            <div
              key={doctor?.id || index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(doctor?.name || '')}
              data-testid="suggestion-item"
            >
              <div className="doctor-info">
                <span className="doctor-name">{doctor?.name || 'Unknown Doctor'}</span>
                <span className="doctor-specialty">
                  {doctor?.specialties?.[0] || 'No Specialty'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar; 