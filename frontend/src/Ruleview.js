import React, { useState, useEffect } from 'react';
import './Ruleview.css';
import networkPorts from './networkPorts';
import defaultPorts from './defaultPorts';

import initializeUniqueServices from './uniqueGenerator';

const Ruleview = ({initialTable}) => {
  const EditableTable = () => {
    const initialData = initialTable;
    const [uniqueServices, setUniqueServices] = useState([]);
    const [ActionOptions, setActionOptions] = useState([]);
    //console.log("unique services: ", uniqueServices);

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
    const handleCellChange = (rowIndex, columnName, value) => {
      console.log("Editing Cells...");
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex][columnName] = value;
        return newData;
      });
    };
    
    const handleSourceChange = (rowIndex, sourceIndex, value) => {
      console.log("Editing Source..");
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex]['Source'][sourceIndex] = value;
        return newData;
      });
    };

    const handleDestinationChange = (rowIndex, destinationIndex, value) => {
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex]['Destination'][destinationIndex] = value;
        return newData;
      });
    };

    const handleAddDestination = (rowIndex) => {
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex]['Destination'] = [...newData[rowIndex]['Destination'], '']; // Add an empty destination
        return newData;
      });
    };

    // Deletes row from tableData
    const handleDeleteRow = (rowIndex) => {
      setTableData((prevData) => prevData.filter((_, index) => index !== rowIndex));
    };

    // Adds new rule/row to tableData
    const handleAddRow = () => {
      const newRow = {'Source': ['10.178.0.0/16'], 'Destination': ['10.150.103.106'], 'Service': [['HTTP', 1],['SSH', 2]], 'Action': 'Allow'}; // Initial values for the new row
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

    const handleAddSource = (rowIndex) => {
      console.log("Adding Source..");
      setTableData((prevData) => {
        const newData = [...prevData];
        console.log("Thedata: ", newData[rowIndex]['Source']);
        newData[rowIndex]['Source'] = [...newData[rowIndex]['Source'], ''];
        console.log("Thenewdata: ", newData[rowIndex]['Source']);
        return newData;
      });
    };
    
    const handleKeyDown = (e, rowIndex, field, index) => {
      if (e.key === 'Backspace' && e.target.value === '') {
        setTableData((prevData) => {
          const newData = [...prevData];
          if (field === 'Source' || field === 'Destination') {
            newData[rowIndex][field].splice(index, 1); // Remove empty value
          }
          return newData;
        });
      }
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
        <div id='table-container'><table className='table'>
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
                  {row['Source'].map((source, index) => (
                    <div key={index}>
                      <input
                        className="editableFields"
                        type="text"
                        value={source}
                        onChange={(e) => handleSourceChange(rowIndex, index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, 'Source', index)} 
                      />
                      {index === row['Source'].length - 1 && (
                        <button onClick={() => handleAddSource(rowIndex)}>+</button>
                      )}
                    </div>
                  ))}
                </td>
                <td>
                  {row['Destination'].map((destination, index) => (
                    <div key={index}>
                      <input
                        className="editableFields"
                        type="text"
                        value={destination}
                        onChange={(e) => handleDestinationChange(rowIndex, index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, 'Destination', index)} 
                      />
                      {index === row['Destination'].length - 1 && (
                        <button onClick={() => handleAddDestination(rowIndex)}>+</button>
                      )}
                    </div>
                  ))}
                </td>
                <td>
                  {row.Service.map((servicePair, pairIndex) => (
                    <div key={pairIndex}>
                      <select
                        value={`${servicePair[0]}-${servicePair[1]}`}
                        onChange={(e) => {
                          const [service, port] = e.target.value.split('-');
                          const updatedServices = [...row.Service]; // Create a copy of the service array
                          updatedServices[pairIndex] = [service, parseInt(port)]; // Update the selected pair
                          handleCellChange(rowIndex, 'Service', updatedServices); // Pass the updated array to the handler
                        }}
                      >
                        {uniqueServices.map((option, index) => (
                          <option
                            key={index}
                            value={`${option[0]}-${option[1]}`}
                          >
                            {`${option[0]} 
                              ${option[1] && 
                              defaultPorts.some(
                                pair => 
                                pair[0] === option[0] && 
                                pair[1] === option[1]) 
                                ? '' 
                                : `(${option[1]})`
                            }`}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
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
        </table></div>
        
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