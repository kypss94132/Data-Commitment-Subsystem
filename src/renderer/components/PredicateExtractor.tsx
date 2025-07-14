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

  return (
    <div>
      <button onClick={handleExtractTokens}>Extract Tokens</button>
      <p>{responseMessage}</p>
    </div>
  );
};

export default PredicateExtractor;
