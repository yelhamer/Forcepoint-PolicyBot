import React from 'react';
import { fileContent } from './schemas';

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
    <label>
      Upload your traffic file{' '}
      <input accept="application/json" type="file" onChange={handleFileSelect}></input>
    </label>
  );
}

export default FileSelector;
