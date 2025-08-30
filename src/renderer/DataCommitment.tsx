import React, { useState } from 'react';
import ParserContent from './components/ParserGenerator';
import PredicatExtractor from './components/PredicateExtractor';
import DataExtractor from './components/DataExtractor';
import './DataCommitment.css'; // Optional: CSS file for styling

const Layout: React.FC = () => {
  const [content, setContent] = useState<string>(''); // State to track right pane content

  const handleButtonClick = (text: string) => {
      setContent(text); // Update content based on button click
  };

  return (
      <div className="container">
          <div className="left-pane">
              <button className="left-button" onClick={() => handleButtonClick('test1')}>Parser Generator</button>
              <button className="left-button" onClick={() => handleButtonClick('test2')}>Predicate Extractor</button>
              <button className="left-button" onClick={() => handleButtonClick('test3')}>Data Extractor</button>
              <button className="left-button" onClick={() => handleButtonClick('test4')}>Verification Extractor</button>
          </div>
          <div className="right-pane">
              <h2></h2>
              
              {/* Display content text */}
              <p>{content || 'Select a button to see content here'}</p>

              {/* Conditionally render ParserContent for "test1" */}
              {content === 'test1' && <ParserContent/>}

              {/* Conditionally render PredicatExtractor for "test2" */}
              {content === 'test2' && <PredicatExtractor/>}

              {/* Conditionally render DataExtractor for "test3" */}
              {content === 'test3' && <DataExtractor/>}
          </div>
      </div>
  );
};

export default Layout;