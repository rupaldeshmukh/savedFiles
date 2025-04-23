import React, { useEffect, useState } from "react";
import { Dropdown, ButtonGroup, Badge, CloseButton } from "react-bootstrap";
import axios from "axios";

const DynamicDropdowns = () => {
  const [filters, setFilters] = useState({});
  const [selectedValues, setSelectedValues] = useState({});

  useEffect(() => {
    axios.get("/api/get-filters").then((res) => {
      setFilters(res.data);
    });
  }, []);

  const handleSelect = (filterKey, item) => {
    setSelectedValues((prev) => {
      const current = prev[filterKey] || [];
      const exists = current.find((i) => JSON.stringify(i) === JSON.stringify(item));
      if (exists) return prev; // avoid duplicate
      return {
        ...prev,
        [filterKey]: [...current, item],
      };
    });
  };

  const removeSelected = (filterKey, index) => {
    setSelectedValues((prev) => {
      const updated = [...(prev[filterKey] || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        [filterKey]: updated,
      };
    });
  };

  const renderDropdown = (filterKey, items) => {
    const label = filterKey.charAt(0).toUpperCase() + filterKey.slice(1);

    return (
      <div key={filterKey} className="m-2">
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="primary" id={`dropdown-${filterKey}`}>
            {label}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {items.map((item, index) => {
              const [key, value] = Object.entries(item)[0];
              return (
                <Dropdown.Item key={index} onClick={() => handleSelect(filterKey, item)}>
                  {`${key}: ${value}`}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>

        {/* Show selected values as tags */}
        <div className="mt-2 d-flex flex-wrap">
          {(selectedValues[filterKey] || []).map((item, idx) => {
            const [key, value] = Object.entries(item)[0];
            return (
              <Badge key={idx} pill bg="secondary" className="me-2 mb-2">
                {`${key}: ${value}`}{" "}
                <CloseButton
                  onClick={() => removeSelected(filterKey, idx)}
                  className="ms-1"
                  variant="white"
                />
              </Badge>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 d-flex flex-wrap">
      {Object.entries(filters).map(([filterKey, items]) =>
        renderDropdown(filterKey, items)
      )}
    </div>
  );
};

export default DynamicDropdowns;
