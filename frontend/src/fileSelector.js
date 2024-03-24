import React from 'react';
import { fileContent } from './schemas';
import { Outlet, Link } from 'react-router-dom';
import './fileSelector.css';

function FileSelector({ setLoading, onFileSelected }) {
  const handleFileSelect = (e) => {
    if (!e.target.files) {
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);

    // Once the file is read, parse to JSON, validate contents and pass it to the onFileSelected prop
    reader.onload = async function (evt) {
      try {
        const data = JSON.parse(evt.target.result);
        await fileContent.validate(data);
        await onFileSelected(e.target.files[0]);
      } catch (error) {
        alert(error);
      }

      setLoading(false);
    };

    reader.onerror = function () {
      alert(`Error reading file ${e.target.files[0].name}`);
    };
  };

  return (
    <div>
      <label className="fileSelect-label">
        Upload your traffic file
        <input
          className="input-field"
          accept="application/json"
          type="file"
          onChange={handleFileSelect}
        ></input>
        <Link to={'help'} title="Visit our help page to get started" className="help-circle">
          <img src="/svgs/help-circle.svg" alt="?" className="help-circle-icon" width={20} />
        </Link>
      </label>
    </div>
  );
}

export default FileSelector;
