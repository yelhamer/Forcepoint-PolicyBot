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
    //setData(response);  //<- TO DO this one can be used when the response matches the format needed
    setData([      // This data is just for testing purposes.
      {'Source': '10.178.0.0/16', 'Destination': '10.150.103.106', 'Service': ['TCP','Do','Re','Mi'], 'Port': '453',
        'Action': 'Allow'},
      {'Source': '10.178.0.0/16', 'Destination': '10.18.93.109', 'Service': ['HTTP'], 'Port': '2',
        'Action': 'Allow'},
      {'Source': '10.78.0.0/16', 'Destination': '10.18.93.110', 'Service': ['UDP'], 'Port': '888', 
        'Action': 'Allow'},
      {'Source': '10.78.41.214', 'Destination': 'External', 'Service': ['TCP', 'GGG'], 'Port': '453', 
        'Action': 'HAHA'}
    ]);
    setLoading(false);
  };
  
  useEffect(() => {
    /* !!! this causes a dependency warning for the handleChangeView, but it does not seem to break the program. 
    This is here because I did not find another good way to get the setData in hadleFile to update before changing views
    If you find a better way, go ahead and remove this */
    // This will run after the state has been updated
    console.log("data in app:", data);

    // Logic that depends on the updated data state and response
    if (data.length > 0 && response) {
      handleChangeView();
      
    }
  }, [data, response]);


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
