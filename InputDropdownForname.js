import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";

const NameDropdown = () => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const apiResponse = [
        { id: 1, name: "test1", status: "p", buisid: "ML1" },
        { id: 2, name: "test2", status: "d", buisid: "ML2" },
        { id: 3, name: "test3", status: "d", buisid: "ML3" },
        { id: 4, name: "test4", status: "d", buisid: "ML4" },
      ];

      const filtered = apiResponse
        .filter(item => item.status === "d")
        .map(item => item.name);

      setOptions(filtered);
    }, 500);
  }, []);

  const handleSelect = (value) => {
    setInputValue(value);
    setIsDisabled(true);
    setShowDropdown(false);
  };

  const handleInputClick = () => {
    if (!isDisabled) {
      setShowDropdown(!showDropdown);
    }
  };

  return (
    <div className="d-inline-block" style={{ width: "250px" }}>
      <Dropdown show={showDropdown} onToggle={() => {}}>
        <Dropdown.Toggle
          as="div"
          className="w-100"
          style={{ cursor: isDisabled ? "default" : "pointer" }}
          onClick={handleInputClick}
        >
          <input
            type="text"
            className="form-control"
            value={inputValue}
            readOnly
            disabled={isDisabled}
            placeholder="Click to select"
          />
        </Dropdown.Toggle>

        {!isDisabled && (
          <Dropdown.Menu className="w-100">
            {options
              .filter((opt) =>
                opt.toLowerCase().includes(inputValue.toLowerCase())
              )
              .map((option, idx) => (
                <Dropdown.Item key={idx} onClick={() => handleSelect(option)}>
                  {option}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        )}
      </Dropdown>
    </div>
  );
};

export default NameDropdown;
