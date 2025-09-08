import React, { useState } from 'react';

const VerificationExecutor: React.FC = () => {
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleCalResult = async () => {
    try {
      const response = await fetch('http://localhost:5000/calculate-result', {
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

  const handleFinalize = async () => {
    try {
      const res = await fetch("http://localhost:5000/finalize-predicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Finalize result:", data);
      alert("Predicate results finalized successfully!");
    } catch (err) {
      console.error("Error finalizing predicates:", err);
      alert("Error finalizing predicates, check console.");
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
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div><strong>Step 1: Calculation the sub-predicate</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <button onClick={handleCalResult} style={blueButton}>
          Save Verification Result to Database
        </button>
      </div>

      <div><strong>Step 2: Summarize predicate</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <button onClick={handleFinalize} style={blueButton}>
          Save Final Result to Database
        </button>
      </div>

    </div>
  );
};

export default VerificationExecutor;
