import React, { useState } from "react"; //Impoert useState
import PropTypes from "prop-types"; //Import PropTypes

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState(""); //Initializing State

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); //Prevents page from reloading
    if (searchTerm.trim()) {
      //Basic validation: don't search empty strings
      onSearch(searchTerm.trim()); //Calling the prop function
      setSearchTerm(""); //Clear input after search
    } else {
      console.log("Please enter a city name");
    }
  };
  return (
    <>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name..."
          className="search-input"
          value={searchTerm}
          onChange={handleChange} //Add on change handler
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </>
  );
}

//Define prop types for the component
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired, //onSearch must be a function that is required
};

export default SearchBar;
