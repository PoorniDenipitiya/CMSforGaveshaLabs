import React, { useState, useEffect } from 'react';
import './search.css'; // Ensure this path is correct
import searchIcon from '../Assets/search.png'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

export const Search = ({ defaultValue = "" }) => {
  const [prompt, setPrompt] = useState(defaultValue);
  const navigate = useNavigate();

  useEffect(() => {
    setPrompt(defaultValue);
  }, [defaultValue]);

  const handleSearch = () => {
    if (prompt) {
      navigate(`/search?query=${prompt}`);
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="search"> {/* Container div for the search component */}
      <input
        type="text"
        className="searchBar" // CSS class for the search bar input
        placeholder="Search for more.." // Placeholder text for the search bar
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)} // Function to update the search query state on input change
      />
      <img
        src={searchIcon} // Source of the search icon image
        className="searchIcon" // CSS class for the search icon
        onClick={handleSearch} // Function to navigate based on the search query
        alt="Search Icon" // Alt text for the search icon image
        
      />
    </div>
  );
};
