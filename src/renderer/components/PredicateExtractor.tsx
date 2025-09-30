import React, { useState } from 'react';
import '../DataCommitment.css'; 

const PredicateExtractor: React.FC = () => {
  const [extractResult, setextractResult] = useState<string>('');

  const handleExtractTokens = async () => {
    try {
      const response = await fetch('http://localhost:5000/extract-predicate', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setextractResult('Saved successfully!');
    } catch (error) {
      setextractResult(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div><strong>Extract Predicates to Database</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
      <button className="button-base button-green" onClick={handleExtractTokens}>
        Save to Database
      </button>
      <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
        {extractResult || 'Not saved yet'}
      </div>
      </div>
    </div>
  );
};

export default PredicateExtractor;
