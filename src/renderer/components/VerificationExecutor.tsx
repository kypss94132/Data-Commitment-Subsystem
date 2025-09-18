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

  const handleSetSourceData = async () => {
    const res = await fetch('http://localhost:5000/set-source-player', {
      method: 'POST'
    });
  
    const result = await res.json();
    console.log(result.message);
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

  const handlePruneAndRebuild = async () => {
    const res = await fetch('http://localhost:5000/prune-invalid-predicates', {
      method: 'POST'
    });
  
    const data = await res.json();
    console.log('Output XML path:', data.outputFile);
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

  const greenButton = {
    ...baseButtonStyle,
    backgroundColor: '#28a745',
    color: '#fff',
  };
  const outlineBlueButton = {
    ...baseButtonStyle,
    border: '1px solid #007BFF',
    backgroundColor: 'transparent',
    color: '#007BFF',
    marginTop: '10px',
  };

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div><strong>Step 1: Calculate Verification Data</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button onClick={handleCalResult} style={greenButton}>
        Save Calculation Result to Database
        </button>
      </div>
      <hr style={{ margin: '20px 0' }} />

      <div><strong>Step 2: Fill in Source Data</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button onClick={handleSetSourceData} style={greenButton}>
        Save Source Data to Database
        </button>
      </div>
      <hr style={{ margin: '20px 0' }} />
      
      <div><strong>Step 3: Finalize and Calculate Overall Predicate Result</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button onClick={handleFinalize} style={greenButton}>
          Save Final Result to Database
        </button>
      </div>
      <hr style={{ margin: '20px 0' }} />

      <div><strong>Step 4: Get Final Ontology File</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button onClick={handlePruneAndRebuild} style={blueButton}>
          Download XML File
        </button>
      </div>

    </div>
  );
};

export default VerificationExecutor;
