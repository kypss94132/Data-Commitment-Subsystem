import React, { useState } from 'react';
import '../DataCommitment.css'; 

const ParserContent: React.FC = () => {
  const [inputFile, setInputFile] = useState<string | null>(null);
  const [outputFile, setOutputFile] = useState<string | null>(null);
  const [batScriptPath, setBatScriptPath] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [batResult, setbatResult] = useState<string | null>(null);
  const [saveResult, setsaveResult] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<string>('');

  const handleSelectInputFile = async () => {
    const result = await window.electronAPI.selectInput();
    if (!result.canceled && result.filePaths.length > 0) {
      setInputFile(result.filePaths[0]);
    }
  };

  const handleSelectOutputFile = async () => {
    const result = await window.electronAPI.selectOutput();
    if (!result.canceled && result.filePath) {
      setOutputFile(result.filePath);
    }
  };

  const handleSelectBatFile = async () => {
    const result = await window.electronAPI.selectBat();
    if (!result.canceled) {
      setBatScriptPath(result.filePath);
    }
  };

  const handleRunBat = async () => {
    setbatResult('Generated successfully!');
    if (!inputFile || !outputFile || !batScriptPath) {
      setOutput('Please select all required files');
      return;
    }
    const result = await window.electronAPI.runBat({
      batPath: batScriptPath,
      inputPath: inputFile,
      outputPath: outputFile,
    });
  };

  const handleSaveToken = async () => {
    setsaveResult('Saved successfully!');
    try {
      const response = await fetch('http://localhost:5000/save-token', { // Trigger save API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: outputFile, // send selected file path
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setTokenStatus('Saved successfully!');
    } catch (error: any) {
      //console.error('Error saving token:', error);
      setTokenStatus(`Error: ${error.message}`);
    }
  };
  
  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      <div><strong>Step 1: Input Ontology XML File</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button className="button-base button-outline-blue" onClick={handleSelectInputFile}>Select XML File</button>
        <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
          {'File Path:'+ inputFile || 'No file selected'}
        </div>
      </div>
      <hr style={{ margin: '20px 0' }} />
  
      <div><strong>Step 2: Set Output Token File Name and Path</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button className="button-base button-outline-blue" onClick={handleSelectOutputFile}>Set Output File</button>
        <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
          {'File Path:'+ outputFile || 'No file selected'}
        </div>
      </div>
      <hr style={{ margin: '20px 0' }} />
  
      <div><strong>Step 3: Select BAT File to Generate Parser</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button className="button-base button-outline-blue" onClick={handleSelectBatFile}>Select BAT File</button>
        <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
          {'File Path:'+ batScriptPath || 'No file selected'}
        </div>
      </div>
      <hr style={{ margin: '20px 0' }} />
  
      <div><strong>Step 4: Generate Parser and Output Token File</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button
          onClick={handleRunBat}
          disabled={!inputFile || !outputFile || !batScriptPath}
          className="button-base button-blue"
          style={{
            opacity: !inputFile || !outputFile || !batScriptPath ? 0.5 : 1,
            cursor: !inputFile || !outputFile || !batScriptPath ? 'not-allowed' : 'pointer',
          }}>
          Run BAT File
        </button>
        <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
          {batResult || 'Not executed yet'}
        </div>
      </div>
      <hr style={{ margin: '20px 0' }} />
  
      <div><strong>Step 5: Save Token File to Database</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button className="button-base button-green" onClick={handleSaveToken}>
          Save to Database
        </button>
        <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
          {saveResult || 'Not saved yet'}
        </div>
      </div>
    </div>
  )
};

export default ParserContent;
