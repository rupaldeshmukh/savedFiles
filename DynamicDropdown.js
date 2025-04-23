import React, { useState } from "react";
import { Dropdown, ButtonGroup, Badge, CloseButton } from "react-bootstrap";

const SingleDropdownSelector = ({ options = [], label = "Select Option" }) => {
  const [selected, setSelected] = useState([]);

  const handleSelect = (value) => {
    if (!selected.includes(value)) {
      setSelected((prev) => [...prev, value]);
    }
  };

  const handleRemove = (index) => {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  };

  const selectedCommaSeparated = selected.join(",");

  return (
    <div className="m-3">
      <Dropdown as={ButtonGroup}>
        <Dropdown.Toggle variant="primary">
          {label}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {options.map((val, idx) => (
            <Dropdown.Item key={idx} onClick={() => handleSelect(val)}>
              {val}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <div className="mt-3 d-flex flex-wrap gap-2">
        {selected.map((val, idx) => (
          <Badge key={idx} bg="secondary">
            {val}
            <CloseButton
              onClick={() => handleRemove(idx)}
              className="ms-1"
            />
          </Badge>
        ))}
      </div>

      {/* Hidden input or preview */}
      <div className="mt-3">
        <strong>Final value:</strong> {selectedCommaSeparated || "None"}
      </div>
    </div>
  );
};

export default SingleDropdownSelector;
