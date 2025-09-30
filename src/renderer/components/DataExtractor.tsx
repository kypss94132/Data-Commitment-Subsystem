import React, { useState } from 'react';
import '../DataCommitment.css'; 

const DataExtractor: React.FC = () => {
  const [splitResult, setsplitResult] = useState<string>('');

  const handleExtractData = async () => {
    try {
      const response = await fetch('http://localhost:5000/split-predicate', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setsplitResult('Saved successfully!');
    } catch (error) {
      setsplitResult(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div><strong>Extract Verification Data To DataBase</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button className="button-base button-green" onClick={handleExtractData}>
          Save to Database
        </button>
        <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
        {splitResult || 'Not saved yet'}
        </div>
      </div> 
    </div>
  );
};

export default DataExtractor;
