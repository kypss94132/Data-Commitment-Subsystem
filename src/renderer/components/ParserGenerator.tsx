import React, { useState } from 'react';

const Test1Content: React.FC = () => {
  const [inputFile, setInputFile] = useState<string | null>(null);
  const [outputFile, setOutputFile] = useState<string | null>(null);
  const [batScriptPath, setBatScriptPath] = useState<string | null>(null);
  const [output, setOutput] = useState<string>('');
  const [tokenStatus, setTokenStatus] = useState<string>('');

  const handleSelectInputFile = async () => {
    const result = await window.electronAPI.selectInputFile();
    if (!result.canceled && result.filePaths.length > 0) {
      setInputFile(result.filePaths[0]);
    }
  };

  const handleSelectOutputFile = async () => {
    const result = await window.electronAPI.selectOutputFile();
    if (!result.canceled && result.filePath) {
      setOutputFile(result.filePath);
    }
  };

  const handleSelectBatFile = async () => {
    const result = await window.electronAPI.selectBatFile();
    if (!result.canceled) {
      setBatScriptPath(result.filePath);
    }
  };

  const handleRunBat = async () => {
    if (!inputFile || !outputFile || !batScriptPath) {
      setOutput('Please select all required files before running.');
      return;
    }

    const result = await window.electronAPI.runBatWithArgs({
      batPath: batScriptPath,
      inputPath: inputFile,
      outputPath: outputFile,
    });

    setOutput(result.message || 'Done running batch file.');
  };

  const handleSaveToken = async () => {
    try {
      const response = await fetch('http://localhost:5000/read-token', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setTokenStatus(`Success: ${result.message}`);
    } catch (error: any) {
      console.error('Error saving token:', error);
      setTokenStatus(`Error: ${error.message}`);
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
      
      <div><strong>Step 1: Select XML Input File</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button style={outlineBlueButton} onClick={handleSelectInputFile}>Browse XML File</button>
        <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
          {inputFile || 'No file selected'}
        </div>
      </div>
      <hr style={{ margin: '20px 0' }} />
  
      <div><strong>Step 2: Choose Output File Path</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button style={outlineBlueButton} onClick={handleSelectOutputFile}>Set Output File</button>
        <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
          {outputFile || 'No file selected'}
        </div>
      </div>
      <hr style={{ margin: '20px 0' }} />
  
      <div><strong>Step 3: Select Batch Script (.bat)</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button style={outlineBlueButton} onClick={handleSelectBatFile}>Browse .BAT File</button>
        <div style={{ marginLeft:'150px', marginTop: '20px', fontSize: '0.85em', color: '#666' }}>
          {batScriptPath || 'No file selected'}
        </div>
      </div>
      <hr style={{ margin: '20px 0' }} />
  
      <div><strong>Step 4: Run Batch File to Generate Parser & Tokens</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button
          onClick={handleRunBat}
          disabled={!inputFile || !outputFile || !batScriptPath}
          style={{
            ...blueButton,
            opacity: !inputFile || !outputFile || !batScriptPath ? 0.5 : 1,
            cursor: !inputFile || !outputFile || !batScriptPath ? 'not-allowed' : 'pointer',
          }}
        >
          Run Batch File
        </button>
      </div>
      <hr style={{ margin: '20px 0' }} />
  
      <div><strong>Step 5: Save Token File to Database</strong></div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <button onClick={handleSaveToken} style={greenButton}>
          Upload to Database
        </button>
      </div>
    </div>
  )
};

export default Test1Content;
