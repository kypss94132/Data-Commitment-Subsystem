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

  const baseButtonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };
  const greenButton = {
    ...baseButtonStyle,
    backgroundColor: '#28a745',
    color: '#fff',
  };

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div><strong>Extract Verification Data To DataBase</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button onClick={handleExtractData} style={greenButton}>
          Save to Database
        </button>
      </div> 
    </div>
  );
};

export default DataExtractor;
