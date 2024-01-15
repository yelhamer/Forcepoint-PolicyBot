import './App.css';
import React, { useState } from 'react';
import FileSelector from './fileSelector';
import Ruleview from './Ruleview';
import Spinner from './Spinner';
import uploadJson from './uploadJson';

function App() {
  // for viewing or not viewing the different screens
  const [showRuleview, setShowRuleview] = useState(false);

  //for the loading spinner
  const [loading, setLoading] = useState(false);

  // Can be used to change between front page and rule page
  const handleChangeView = () => {
    setShowRuleview((prevShowRuleview) => !prevShowRuleview);
    if (!showRuleview) {
      //also makes sure loading dissapears when changing back
      setLoading(false);
    }
  };

  const buttonText = showRuleview ? 'Back to front page' : 'To rule edit';

  const handleFile = async (file) => {
    console.log('sending data:', file);
    setLoading(true);
    const response = await uploadJson(file);
    console.log(response);
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>PolicyBot</p>
      </header>
      <button className="changeView" onClick={handleChangeView}>
        {buttonText}
      </button>
      <main className="App-body">
        {showRuleview ? (
          <Ruleview />
        ) : loading ? (
          <div className="Loading-indicator">
            <Spinner />
          </div>
        ) : (
          <FileSelector setLoading={setLoading} onFileSelected={handleFile} />
        )}
      </main>
    </div>
  );
}

export default App;
