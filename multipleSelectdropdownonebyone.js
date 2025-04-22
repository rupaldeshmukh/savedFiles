import React, { useState } from "react";
import { Dropdown, FormControl, Badge, CloseButton } from "react-bootstrap";
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
      const exists = prev.find((i) => i.ID === item.ID);
      if (exists) return prev;
      return [...prev, item];
    });
    setQuery("");
    setData([]);
  };

  const handleRemoveItem = (id) => {
    setSelectedItems((prev) => prev.filter((item) => item.ID !== id));
  };

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
              {item.name} ({item.ID})
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
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
