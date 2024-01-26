import React, { useState, useEffect } from 'react';
import './Ruleview.css';
import networkPorts from './networkPorts';
import initializeUniqueServices from './uniqueGenerator';

const Ruleview = ({initialTable}) => {
  const EditableTable = () => {
    const initialData = initialTable;
    const [uniqueServices, setUniqueServices] = useState([]);
    const [ActionOptions, setActionOptions] = useState([]);
    console.log("unique services: ", uniqueServices);

    useEffect(() => {
      //This code only needs to run once in the beginning, so i put it in an useEffect.
      //It will run only when initialData is updated.
      setUniqueServices(initializeUniqueServices(initialData, networkPorts));

      // Creates a list for available actions, which are then filtered with uniqueActions and ActionOptions
      const availableActions = ['Allow', 'Deny', 'Drop', 'Reject', 'CustomAction'];

      const uniqueActions = Array.from(
        new Set([...initialData.map((row) => row.Action), ...availableActions])
      );
      
      setActionOptions(uniqueActions.map((action) => ({ Action: action })));

    }, [initialData]);

    const [tableData, setTableData] = useState(initialData);
    console.log("tabledata: ", tableData);
    
    //Right now updates to the "Source" in the table only edits the first Source value in tableData
      const handleCellChange = (rowIndex, key, value) => {
        setTableData((prevData) => {
          const newData = [...prevData];
          const currentRow = { ...newData[rowIndex] };
          
          if (key === 'Service') {
            currentRow[key] = [value.service];
            currentRow['Port'] = value.port;
          } else {
            currentRow[key] = value === undefined ? '' : value;
          }
      
          newData[rowIndex] = currentRow;
          
          return newData;
        });
      };

    // Deletes row from tableData
    const handleDeleteRow = (rowIndex) => {
      setTableData((prevData) => prevData.filter((_, index) => index !== rowIndex));
    };

    // Adds new rule/row to tableData
    const handleAddRow = () => {
      const newRow = {'Source': '0.0.0.0', 'Destination': '0.0.0.0', 'Port': 'any', 'Service': ['any'], 'Action': 'Allow'}; // Initial values for the new row
      console.log("adding rule:  ", newRow);
      setTableData((prevData) => [...prevData, newRow]);
    };

    // Makes an identical rule below/after it into tableData
    const handleDuplicateRow = (rowIndex) => {
      const duplicatedRow = { ...tableData[rowIndex] };
    
      setTableData((prevData) => {
        const newData = [...prevData];
        newData.splice(rowIndex + 1, 0, duplicatedRow);
        return newData;
      });
    };

    //For the button to move the rule one step up
    const handleMoveUp = (rowIndex) => {
      if (rowIndex > 0) {
        const newData = [...tableData];
        const temp = newData[rowIndex];
        newData[rowIndex] = newData[rowIndex - 1];
        newData[rowIndex - 1] = temp;
  
        setTableData(newData);
      }
    };

    //For the button to move the rule one step down
    const handleMoveDown = (rowIndex) => {
      if (rowIndex < tableData.length - 1) {
        const newData = [...tableData];
        const temp = newData[rowIndex];
        newData[rowIndex] = newData[rowIndex + 1];
        newData[rowIndex + 1] = temp;
  
        setTableData(newData);
      }
    };

    //Moves the rule all the way to the top of the list
    const handleMoveToTop = (rowIndex) => {
      setTableData((prevTableData) => {
        if (rowIndex > 0) {
          const newData = [...prevTableData];
          const movedRow = newData.splice(rowIndex, 1)[0];
          newData.unshift(movedRow);
          return newData;
        }
        return prevTableData;
      });
    };
    
    //moves the rule all the way to the bottom of the list
    const handleMoveToBottom = (rowIndex) => {
      setTableData((prevTableData) => {
        if (rowIndex < prevTableData.length - 1) {
          const newData = [...prevTableData];
          const movedRow = newData.splice(rowIndex, 1)[0];
          newData.push(movedRow);
          return newData;
        }
        return prevTableData;
      });
    };

    // TO DO For exporting XML, this code does NOTHING really right now.
    const handleExport = () => {
      // TO DO tableData is the array to be exported
      window.alert('XML export function here...');
    };

    /*TO DO This can then be modified to choose another Json file etc.? 
      now it just resets to initial values*/
    const handleReset = () => {
      setTableData(initialData);
    };

    //EditableTable return
    return (
      <div>
        <button className='resetButton' onClick={handleReset}>Reset</button>
        <button className="exportButton" onClick={handleExport}>Export XML</button>
        <table className='table'>
          <thead>
            <tr>
              <th>Move rules</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Service (Port)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="rowActions">
                  <button onClick={() => handleMoveToTop(rowIndex)}>↑↑</button>
                  <button onClick={() => handleMoveToBottom(rowIndex)}>↓↓</button>
                  <button onClick={() => handleMoveUp(rowIndex)}>↑</button>
                  <button onClick={() => handleMoveDown(rowIndex)}>↓</button>
                </td>
                <td>
                  <input
                    className="editableFields"
                    type="text"
                    value={row['Source']}
                    onChange={(e) => handleCellChange(rowIndex, 'Source', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="editableFields"
                    type="text"
                    value={row['Destination']}
                    onChange={(e) => handleCellChange(rowIndex, 'Destination', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={`${row.Service[0]}-${row.Port}`}
                    onChange={(e) => {
                      const [service, port] = e.target.value.split('-');
                      handleCellChange(rowIndex, 'Service', { service, port });
                    }}
                  >
                    {uniqueServices.map((option, index) => (
                      <option
                        key={index}
                        value={`${option.service}-${option.port}`}
                      >
                        {`${option.service} (${option.port})`}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={row['Action']}
                    onChange={(e) => handleCellChange(rowIndex, 'Action', e.target.value)}
                  >
                    {ActionOptions.map((option, index) => (
                      <option key={`${option.Action}-${index}`} value={option.Action}>
                        {option.Action}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="rowActions">
                  <button onClick={() => handleDuplicateRow(rowIndex)}>
                    Duplicate
                  </button>
                  <button onClick={() => handleDeleteRow(rowIndex)}>
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button className='addRuleButton' onClick={handleAddRow}>Add Rule</button>
        </div>
        <div>
          <strong>Making sure the list updates correctly:</strong>
          <pre>{JSON.stringify(tableData, null, 2)}</pre>
        </div>
      </div>
    );
  };

  //Ruleview return
  return (
    <div className="RuleviewCSS">
      <h2 className="header">Edit rules</h2>
      <EditableTable />
    </div>
  );
};

export default Ruleview;