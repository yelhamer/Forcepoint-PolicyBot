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
    console.log('sending data:', file);
    setLoading(true);
    const response = await uploadJson(file);
    setResponse(response);
    setData(response);
    setLoading(false);
  };

    //to avoid the dependency warning for the handleChangeView, Instead of calling the handleChangeView() function,
    //directly set the setShowRuleView(true)
    useEffect(() => {
      console.log('data from backend:', data);
      if (data.length > 0 && response) {
        setShowRuleview(true);  // Instead of calling handleChangeView()
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
