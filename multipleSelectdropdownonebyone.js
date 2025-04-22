import React, { useState, useRef } from "react";
import { Dropdown, FormControl, Badge, CloseButton } from "react-bootstrap";
import axios from "axios";

const FilterDropdown = ({ label = "Select Options" }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

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
    setTimeout(() => inputRef.current?.focus(), 0); // keep focus for next input
  };

  const handleRemoveItem = (id) => {
    setSelectedItems((prev) => prev.filter((item) => item.ID !== id));
  };

  return (
    <div className="m-2">
      <div className="mb-2">
        <FormControl
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
        />
      </div>
      <div className="border rounded p-2 mb-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
        {data.map((item, idx) => (
          <div
            key={idx}
            className="dropdown-item cursor-pointer"
            onClick={() => handleItemClick(item)}
            style={{ cursor: "pointer" }}
          >
            {item.name} ({item.ID})
          </div>
        ))}
      </div>
      {selectedItems.length > 0 && (
        <div className="d-flex flex-wrap gap-2">
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
