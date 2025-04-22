import React, { useEffect, useState } from "react";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import axios from "axios";

const DynamicDropdowns = () => {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    // Replace with your actual API endpoint
    axios.get("/api/get-filters").then((res) => {
      setFilters(res.data);
    });
  }, []);

  const renderDropdown = (filterKey, items) => {
    const label = filterKey.charAt(0).toUpperCase() + filterKey.slice(1);

    return (
      <Dropdown as={ButtonGroup} key={filterKey} className="m-2">
        <Dropdown.Toggle variant="primary" id={`dropdown-${filterKey}`}>
          {label}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {items.map((item, index) => {
            const [key, value] = Object.entries(item)[0];
            return (
              <Dropdown.Item key={index} eventKey={value}>
                {`${key}: ${value}`}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
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
