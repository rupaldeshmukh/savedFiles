import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Spinner } from "react-bootstrap";
import axios from "axios";

function SearchableDropdown({ isDisabled = false }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Debounced API call after 300ms of no typing
    debounceRef.current = setTimeout(() => {
      if (value.trim() !== "") {
        fetchSuggestions(value);
      } else {
        setOptions([]);
      }
    }, 300);
  };

  const fetchSuggestions = async (keyword) => {
    setLoading(true);
    try {
      // Example API endpoint — replace with your actual one
      const res = await axios.get(`/api/suggest?keyword=${keyword}`);
      setOptions(res.data); // Expects: [{ Name, desc }]
    } catch (err) {
      console.error("API error:", err);
      setOptions([]);
    }
    setLoading(false);
  };

  const handleSelect = (option) => {
    setInputValue(option.Name);
    setShowDropdown(false);
  };

  const handleInputClick = () => {
    if (!isDisabled) setShowDropdown(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  return (
    <div className="d-inline-block" style={{ width: "300px" }}>
      <Dropdown show={showDropdown} onToggle={() => {}}>
        <Dropdown.Toggle
          as="div"
          className="w-100"
          style={{ cursor: isDisabled ? "default" : "pointer" }}
        >
          <input
            type="text"
            className="form-control"
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onBlur={handleBlur}
            disabled={isDisabled}
            placeholder="Type to search..."
          />
        </Dropdown.Toggle>

        {!isDisabled && showDropdown && (
          <Dropdown.Menu className="w-100" style={{ maxHeight: "200px", overflowY: "auto" }}>
            {loading && (
              <Dropdown.Item disabled>
                <Spinner animation="border" size="sm" /> Loading...
              </Dropdown.Item>
            )}
            {!loading && options.length === 0 && (
              <Dropdown.Item disabled>No results found</Dropdown.Item>
            )}
            {options.map((option, idx) => (
              <Dropdown.Item key={idx} onClick={() => handleSelect(option)}>
                <div>
                  <strong>{option.Name}</strong>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>{option.desc}</div>
                </div>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        )}
      </Dropdown>
    </div>
  );
}

export default SearchableDropdown;
