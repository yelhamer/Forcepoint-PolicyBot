import './App.css';
import React, { useState } from 'react';
import FileSelector from './fileSelector';
import Ruleview from './Ruleview';
import Spinner from './Spinner';

function App() {

  // for viewing or not viewing the different screens
  const [showRuleview, setShowRuleview] = useState(false);

  //for the loading spinner
  const [loading, setLoading] = useState(false);


  // Can be used to change between front page and rule page
  const handleChangeView = () => {
    setShowRuleview((prevShowRuleview) => !prevShowRuleview);
    if (!showRuleview){ //also makes sure loading dissapears when changing back
      setLoading(false);
    };
  };

  const buttonText = showRuleview ? 'Back to front page' : 'To rule edit';


  const handleFile = (data) => {
    console.log('sending data:', data);
    setLoading(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>PolicyBot</p>
      </header>
      <button className="changeView" onClick={handleChangeView}>{buttonText}</button>
      <main className="App-body">
        {showRuleview ? <Ruleview /> : <FileSelector onFileSelected={handleFile} />}
        <div className="Loading-indicator">
          {showRuleview ? null : ( loading? <Spinner /> : <button onClick={handleFile}>GO!</button>)}
        </div>
      </main>
    </div>
  );
}

export default App;
