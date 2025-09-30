import React, { useState } from 'react';
import './DataCommitment.css'; 
import ParserContent from './components/ParserGenerator';
import PredicateContent from './components/PredicateExtractor';
import DataContent from './components/DataExtractor';
import VerificationContent from './components/VerificationExecutor';

const Layout: React.FC = () => {
  const [content, setContent] = useState<string>(''); // Track right pane content

  const handleButtonClick = (text: string) => {
      setContent(text); // Update content based on what button is clicked
  };

  return (
      <div className="container">
          {/* Left side menu*/}
          <div className="left-pane">
          <button
            className={`left-button ${content === 'parser' && 'active'}`}
            onClick={() => handleButtonClick('parser')}>
            Parser Generator
          </button>
          <button
            className={`left-button ${content === 'predicate' && 'active'}`}
            onClick={() => handleButtonClick('predicate')}>
            Predicate Extractor
          </button>
          <button
            className={`left-button ${content === 'data' && 'active'}`}
            onClick={() => handleButtonClick('data')}>
            Data Extractor
          </button>
          <button
            className={`left-button ${content === 'verification' && 'active'}`}
            onClick={() => handleButtonClick('verification')}>
            Verification Extractor
          </button>
      </div>     
          {/* Right side content*/} 
          <div className="right-pane"> 
              {content === 'parser' && <ParserContent/>}
              {content === 'predicate' && <PredicateContent/>}
              {content === 'data' && <DataContent/>}
              {content === 'verification' && <VerificationContent/>}
          </div>
      </div>
  );
};

export default Layout;