import FileSelector from '../fileSelector';
import Ruleview from '../Ruleview';
import Spinner from '../Spinner';
import uploadJson from '../uploadJson';
import React, { useState, useEffect } from 'react';
import './Home.css';

function Home() {
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
    setData(response); //<- TO DO this one can be used when the response matches the format needed
    setLoading(false);
  };

  useEffect(() => {
    /* !!! this causes a dependency warning for the handleChangeView, but it does not seem to break the program. 
    This is here because I did not find another good way to get the setData in hadleFile to update before changing views
    If you find a better way, go ahead and remove this */
    // This will run after the state has been updated
    console.log('data in app:', data);

    // Logic that depends on the updated data state and response
    if (data.length > 0 && response) {
      handleChangeView();
    }
  }, [data, response]);

  return (
    <div className="Home">
      <button className="changeView" onClick={handleChangeView}>
        {buttonText}
      </button>
      <div className="Home-body">
        {showRuleview ? (
          <Ruleview initialTable={data} />
        ) : loading ? (
          <div className="Loading-indicator">
            <Spinner />
          </div>
        ) : (
          <FileSelector setLoading={setLoading} onFileSelected={handleFile} />
        )}
      </div>
    </div>
  );
}

export default Home;
