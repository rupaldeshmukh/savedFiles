import React, { useState, useRef } from "react";
import { Dropdown, FormControl, Badge, CloseButton } from "react-bootstrap";
import axios from "axios";

const FilterDropdown = ({ label = "Select Options" }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  const fetchOptions = async (search) => {
    try {
      const response = await axios.get(`/api/search-options?q=${search}`); // replace with actual API
      setData(response.data);
      setShowDropdown(true);
    } catch (err) {
      console.error("Error fetching options:", err);
    }
  };

  const handleInputChange = (e) => {
    const search = e.target.value;
    setQuery(search);
    if (search.trim()) {
      fetchOptions(search);
    } else {
      setData([]);
      setShowDropdown(false);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.ID === item.ID);
      if (exists) return prev;
      return [...prev, item];
    });
    setQuery("");
    setData([]);
    setShowDropdown(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleRemoveItem = (id) => {
    setSelectedItems((prev) => prev.filter((item) => item.ID !== id));
  };

  const handleToggle = (isOpen) => {
    setShowDropdown(isOpen);
    if (!isOpen) {
      setQuery("");
      setData([]);
    }
  };

  return (
    <div className="m-2">
      <Dropdown show={showDropdown} onToggle={handleToggle} autoClose="outside">
        <Dropdown.Toggle
          variant="light"
          id="multi-select-dropdown"
          className="w-100 d-flex flex-column align-items-start"
        >
          <FormControl
            ref={inputRef}
            type="text"
            placeholder={label}
            value={query}
            onChange={handleInputChange}
            onClick={() => {
              if (query.trim()) setShowDropdown(true);
            }}
          />
        </Dropdown.Toggle>

        {data.length > 0 && (
          <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto", padding: "10px" }}>
            {data.map((item, idx) => (
              <Dropdown.Item key={idx} onClick={() => handleItemClick(item)}>
                {item.name} ({item.ID})
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        )}
      </Dropdown>

      {selectedItems.length > 0 && (
        <div className="mt-2 d-flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <Badge key={item.ID} bg="secondary" className="d-flex align-items-center">
              {item.name} &gt; {item.ID}
              <CloseButton
                onClick={() => handleRemoveItem(item.ID)}
                className="ms-2"
                variant="white"
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
