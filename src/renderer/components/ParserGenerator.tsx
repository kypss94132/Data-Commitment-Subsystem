import React, { useState } from 'react';

const Test1Content: React.FC = () => {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [output, setOutput] = useState<string>('');
  const [tokenStatus, setTokenStatus] = useState<string>('');

  const handleSelectFile = async () => {
    const result = await window.electronAPI.selectBatFile();

    if (result.canceled) {
      console.log('File selection canceled');
      return;
    }

    console.log('File selected:', result.filePath);
    setFilePath(result.filePath);
  };

  const handleRunBatFile = () => {
    if (!filePath) {
      setOutput('No file selected. Please select a batch file first.');
      return;
    }

    window.electronAPI.runBatFile(filePath);

    window.electronAPI.onBatFileResponse((message) => {
      setOutput(message); // Display the response in the UI
    });
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
    } catch (error) {
      console.error('Error saving token:', error);
      setTokenStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={handleSelectFile}>Select BAT File</button>
      <p>Selected File: {filePath || 'None'}</p>

      <button onClick={handleRunBatFile} disabled={!filePath}>
        Run Selected BAT File
      </button>
      <p>{output}</p>

      <hr />

      <button onClick={handleSaveToken}>Save Token to Database</button>
      <p>{tokenStatus}</p>
    </div>
  );
};

export default Test1Content;
