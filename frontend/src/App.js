import './App.css';
import React, { useState, useEffect } from 'react';
import FileSelector from './fileSelector';
import Ruleview from './Ruleview';
import Spinner from './Spinner';
import uploadJson from './uploadJson';

function App() {
  // for viewing or not viewing the different screens
  const [showRuleview, setShowRuleview] = useState(false);

  //for the loading spinner
  const [loading, setLoading] = useState(false);
  // for sending the data received from backend to Ruleview
  const [data, setData] = useState([]);
  const [response, setResponse] = useState(null);

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
    console.log('sending data:', file); // for debugging
    setLoading(true);
    const response = await uploadJson(file);
    setResponse(response);
    //setData(response);  //<- this one can be used when the response matches the format needed
    setData([      
      {'Source': '10.178.0.0/16', 'Destination': '10.150.103.106', 'Service': 'TCP', 'Port': '453',
        'Action': 'Allow'},
      {'Source': '10.178.0.0/16', 'Destination': '10.18.93.109', 'Service': 'TCP', 'Port': '456',
        'Action': 'Allow'},
      {'Source': '10.78.0.0/16', 'Destination': '10.18.93.110', 'Service': 'UDP', 'Port': '888', 
        'Action': 'Allow'},
      {'Source': '10.78.41.214', 'Destination': 'External', 'Service': 'TCP', 'Port': '456', 
        'Action': 'HAHA'}
    ]);
    setLoading(false);
    // Right now backend only responds with the same content back so the ruleview shows just the hardcoded data
  };
  
  useEffect(() => {
    // This will run after the state has been updated
    console.log("data in app:", data);

    // Logic that depends on the updated data state and response
    if (data.length > 0 && response) {
      handleChangeView();
    }
  }, [data, response]); // The dependency array includes both 'data' and 'response'


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
          <Ruleview initialTable={data}/>
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
