import React, { useState, useRef, useEffect } from 'react';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // Detect click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Dropdown</button>
      {isOpen && (
        <div ref={dropdownRef} className="dropdown">
          <p>This is a dropdown</p>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
