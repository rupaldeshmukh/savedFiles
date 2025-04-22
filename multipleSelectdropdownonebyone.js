import React, { useState } from "react";
import { Dropdown, FormControl } from "react-bootstrap";
import axios from "axios";

const FilterDropdown = ({ label = "Select Options" }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");

  const fetchOptions = async (search) => {
    try {
      const response = await axios.get(`/api/search-options?q=${search}`); // replace with actual API
      setData(response.data);
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
    }
  };

  const handleItemClick = (item) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
    setQuery("");
    setData([]);
  };

  const formattedSelection = selectedItems
    .map((item) => `${item.name}>${item.id}`)
    .join(", ");

  return (
    <div className="m-2">
      <Dropdown autoClose="outside">
        <Dropdown.Toggle variant="primary" id="multi-select-dropdown">
          {selectedItems.length > 0 ? `${selectedItems.length} selected` : label}
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto", padding: "10px" }}>
          <FormControl
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleInputChange}
            className="mb-2"
          />
          {data.map((item, idx) => (
            <Dropdown.Item key={idx} onClick={() => handleItemClick(item)}>
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {selectedItems.length > 0 && (
        <div className="mt-2">
          <strong>Selected:</strong> {formattedSelection}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
