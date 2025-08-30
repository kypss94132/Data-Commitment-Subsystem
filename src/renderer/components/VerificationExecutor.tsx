import React, { useState } from 'react';

const DataExtractor: React.FC = () => {
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleExtractData = async () => {
    try {
      const response = await fetch('http://localhost:5000/split-predicate', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setResponseMessage(`Success: ${result.message}`);
    } catch (error) {
      console.error('Error extracting predicates:', error);
      setResponseMessage(`Error: ${error.message}`);
    }
  };
  const handleVerify = async () => {
    try {
      const response = await fetch('http://localhost:5000/calculate-verification', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setResponseMessage(`Success: ${result.message}`);
    } catch (error) {
      console.error('Error Verify:', error);
      setResponseMessage(`Error: ${error.message}`);
    }
  };
  const baseButtonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const blueButton = {
    ...baseButtonStyle,
    backgroundColor: '#007BFF',
    color: '#fff',
  };

  return (
    <div>
      <div><strong>Start verification</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <button onClick={handleVerify} style={blueButton}>
          Save Data to Database
        </button>
      </div>
    </div>
  );
};

export default DataExtractor;
