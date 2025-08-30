import React, { useState } from 'react';

const PredicateExtractor: React.FC = () => {
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleExtractTokens = async () => {
    try {
      const response = await fetch('http://localhost:5000/extract-predicate', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setResponseMessage(`Success: ${result.message}`);
    } catch (error) {
      console.error('Error extracting tokens:', error);
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
      <div><strong>Extract Predicates from Token File and Save to Database</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <button onClick={handleExtractTokens} style={blueButton}>
          Save Predicates to Database
        </button>
      </div>
    </div>
  );
};

export default PredicateExtractor;
