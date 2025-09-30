import React, { useState } from 'react';

const VerificationExecutor: React.FC = () => {
  const [calResult, setcalResult] = useState<string>('');
  const [sourceResult, setsourceResult] = useState<string>('');
  const [finalizeResult, setfinalizeResult] = useState<string>('');
  const [rebuildResult, setrebuildResult] = useState<string>('');

  const handleCalResult = async () => {
    try {
      const response = await fetch('http://localhost:5000/calculate-result', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setcalResult('Saved successfully!');
    } catch (error) {
      setcalResult(`Error: ${error.message}`);
    }
  };

  const handleSourceData = async () => {
    try {
      const res = await fetch('http://localhost:5000/save-source', {
        method: 'POST'
      });
  
      const result = await res.json();
      setsourceResult('Saved successfully!');
    } catch (error) {
      setsourceResult(`Error: ${error.message}`);
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
      setfinalizeResult('Saved successfully!');
    } catch (err: any) {
      setfinalizeResult(`Error: ${err.message}`);
    }
  };
  
  const handleRebuildOntology = async () => {
    try {
      const res = await fetch('http://localhost:5000/update-ontology', {
        method: 'POST'
      });
  
      const data = await res.json();
      setrebuildResult('Output File successfully!');
    } catch (err: any) {
      setrebuildResult(`Error: ${err.message}`);
    }
  };
  
  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div><strong>Step 1: Calculate Verification Data</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button className="button-base button-green" onClick={handleCalResult}>
        Save Calculation Result to Database
        </button>
        <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
        {calResult || 'Not saved yet'}
        </div>
      </div>
      <hr style={{ margin: '20px 0' }} />

      <div><strong>Step 2: Fill in Source Data</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button className="button-base button-green" onClick={handleSourceData}>
        Save Source Data to Database
        </button>
        <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
        {sourceResult || 'Not saved yet'}
        </div>
      </div>
      <hr style={{ margin: '20px 0' }} />
      
      <div><strong>Step 3: Finalize and Calculate Overall Predicate Result</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button className="button-base button-green" onClick={handleFinalize}>
          Save Final Result to Database
        </button>
        <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
        {finalizeResult || 'Not saved yet'}
        </div>
      </div>
      <hr style={{ margin: '20px 0' }} />

      <div><strong>Step 4: Get Final Ontology File</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button className="button-base button-blue" onClick={handleRebuildOntology}>
          Download XML File
        </button>
        <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
        {rebuildResult || 'No Output yet'}
        </div>
      </div>

    </div>
  );
};

export default VerificationExecutor;
