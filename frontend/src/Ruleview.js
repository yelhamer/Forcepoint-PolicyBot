import React, { useState, useEffect } from 'react';
import './Ruleview.css';
import networkPorts from './networkPorts';
import defaultPorts from './defaultPorts';
import { copy } from './copy';
import ruleExport from './ruleExport';
import initializeUniqueServices from './uniqueGenerator';

const Ruleview = ({ initialTable }) => {
  const [exported, setExported] = useState(false);

  const EditableTable = ({ onExport }) => {
    const initialData = initialTable;
    const [uniqueServices, setUniqueServices] = useState([]);
    const [ActionOptions, setActionOptions] = useState([]);

    useEffect(() => {
      //useEffect will run only when initialData is updated, aka once in the beginning.
      setUniqueServices(initializeUniqueServices(initialData, networkPorts));

      // Creates a list for available actions, which are then filtered with uniqueActions and ActionOptions
      const availableActions = ['allow', 'continue', 'discard', 'refuse'];

      const uniqueActions = Array.from(
        new Set([...initialData.map((row) => row.Action), ...availableActions])
      );

      setActionOptions(uniqueActions.map((action) => ({ Action: action })));
    }, [initialData]);

    const [tableData, setTableData] = useState(initialData);

    // handles change in service and action
    const handleCellChange = (rowIndex, columnName, value) => {
      setTableData((prevData) => {
        const newData = copy(prevData);
        newData[rowIndex][columnName] = value;
        return newData;
      });
    };

    // Handles typing in source field
    const handleSourceChange = (rowIndex, sourceIndex, value) => {
      setTableData((prevData) => {
        const newData = copy(prevData);
        newData[rowIndex]['Source'][sourceIndex] = value;
        return newData;
      });
    };

    //Adds single source element
    const handleAddSource = (rowIndex) => {
      setTableData((prevData) => {
        const newData = copy(prevData);
        newData[rowIndex]['Source'] = [...newData[rowIndex]['Source'], ''];
        return newData;
      });
    };

    //Handles typing in the destination field
    const handleDestinationChange = (rowIndex, destinationIndex, value) => {
      setTableData((prevData) => {
        const newData = copy(prevData);
        newData[rowIndex]['Destination'][destinationIndex] = value;
        return newData;
      });
    };

    //Adds single destination element
    const handleAddDestination = (rowIndex) => {
      setTableData((prevData) => {
        const newData = copy(prevData);
        newData[rowIndex]['Destination'] = [...newData[rowIndex]['Destination'], '']; // Add an empty destination
        return newData;
      });
    };

    //Removes single service element
    const handleRemoveService = (rowIndex, pairIndex) => {
      setTableData((prevData) => {
        const newData = copy(prevData);
        const updatedServices = [...newData[rowIndex]['Service']];
        updatedServices.splice(pairIndex, 1); 
        newData[rowIndex]['Service'] = updatedServices;
        return newData;
      });
    };

    //Adds single service element
    const handleAddService = (rowIndex) => {
      setTableData((prevData) => {
        const newData = copy(prevData);
        newData[rowIndex]['Service'] = [...newData[rowIndex]['Service'], ['Any', 0]]; 
        return newData;
      });
    };

    // Deletes row from tableData
    const handleDeleteRow = (rowIndex) => {
      setTableData((prevData) => prevData.filter((_, index) => index !== rowIndex));
    };

    // Adds new rule/row to tableData
    const handleAddRow = () => {
      const newRow = {
        Source: [''],
        Destination: [''],
        Service: [
          ['Any', 0],
        ],
        Action: 'Allow',
      }; 
      setTableData((prevData) => [...prevData, newRow]);
    };

    // Makes an identical rule below/after it into tableData
    const handleDuplicateRow = (rowIndex) => {
      const duplicatedRow = { ...tableData[rowIndex] };

      setTableData((prevData) => {
        const newData = copy(prevData);
        newData.splice(rowIndex + 1, 0, duplicatedRow);
        return newData;
      });
    };

    //For the button to move the rule one step up
    const handleMoveUp = (rowIndex) => {
      if (rowIndex > 0) {
        const newData = copy(tableData);
        const temp = newData[rowIndex];
        newData[rowIndex] = newData[rowIndex - 1];
        newData[rowIndex - 1] = temp;

        setTableData(newData);
      }
    };

    //For the button to move the rule one step down
    const handleMoveDown = (rowIndex) => {
      if (rowIndex < tableData.length - 1) {
        const newData = copy(tableData);
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
          const newData = copy(prevTableData);
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
          const newData = copy(prevTableData);
          const movedRow = newData.splice(rowIndex, 1)[0];
          newData.push(movedRow);
          return newData;
        }
        return prevTableData;
      });
    };

    //Deletes single source or dest when pressing backspace when field is empty
    const handleKeyDown = (e, rowIndex, field, index) => {
      if (e.key === 'Backspace' && e.target.value === '') {
        setTableData((prevData) => {
          const newData = copy(prevData);
          if (field === 'Source' || field === 'Destination') {
            newData[rowIndex][field].splice(index, 1); // Remove empty value
          }
          return newData;
        });
      }
    };

   
      //Resets to initial values
    const handleReset = () => {
      setTableData(initialData);
    };

    //EditableTable return
    return (
      <div>
        <button className="resetButton" onClick={handleReset}>
          Reset
        </button>
        <button
          className="exportButton"
          onClick={() => {
            ruleExport(tableData);
            onExport();
          }}
        >
          Export XML
        </button>
        <div id="table-container">
          <table className="table">
            <thead className="table-header">
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
                    <div className="move-buttons">
                      <button className="square-button" onClick={() => handleMoveToTop(rowIndex)}>
                        <img
                          src="/svgs/chevrons-up.svg"
                          alt="↑↑"
                          className="svg-filter-white"
                          width={20}
                        />
                      </button>
                      <button
                        className="square-button"
                        onClick={() => handleMoveToBottom(rowIndex)}
                      >
                        <img
                          src="/svgs/chevrons-down.svg"
                          alt="↓↓"
                          className="svg-filter-white"
                          width={20}
                        />
                      </button>
                      <button className="square-button" onClick={() => handleMoveUp(rowIndex)}>
                        <img
                          src="/svgs/chevron-up.svg"
                          alt="↑"
                          className="svg-filter-white"
                          width={20}
                        />
                      </button>
                      <button className="square-button" onClick={() => handleMoveDown(rowIndex)}>
                        <img
                          src="/svgs/chevron-down.svg"
                          alt="↓"
                          className="svg-filter-white"
                          width={20}
                        />
                      </button>
                    </div>
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
                    {row['Service'].length === 0 && (
                      <button onClick={() => handleAddService(rowIndex)}>+</button>
                    )}
                    {row.Service.map((servicePair, pairIndex) => (
                      <div key={pairIndex}>
                        <select
                          value={`${servicePair[0]}-${servicePair[1]}`}
                          onChange={(e) => {
                            const [service, port] = e.target.value.split('-');
                            const updatedServices = [...row.Service];
                            updatedServices[pairIndex] = [service, parseInt(port)]; 
                            handleCellChange(rowIndex, 'Service', updatedServices); 
                          }}
                        >
                          {uniqueServices.map((option, index) => (
                            <option key={index} value={`${option[0]}-${option[1]}`}>
                              {`${option[0]} 
                              ${
                                option[1] &&
                                defaultPorts.some(
                                  (pair) => pair[0] === option[0] && pair[1] === option[1]
                                )
                                  ? ''
                                  : `(${option[1]})`
                              }`}
                            </option>
                          ))}
                        </select>
                        <button onClick={(e) => handleRemoveService(rowIndex, pairIndex)}>-</button>
                        {pairIndex === row['Service'].length - 1 && (
                          <button onClick={() => handleAddService(rowIndex)}>+</button>
                        )}
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
                    <div className="add-remove-btns">
                      <button
                        onClick={() => handleDuplicateRow(rowIndex)}
                        className="square-button"
                      >
                        <img
                          src="/svgs/copy.svg"
                          alt="Duplicate"
                          className="svg-filter-white"
                          width={15}
                        />
                      </button>
                      <button onClick={() => handleDeleteRow(rowIndex)} className="square-button">
                        <img
                          src="/svgs/trash.svg"
                          alt="X"
                          className="svg-filter-white"
                          width={15}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <button className="addRuleButton" onClick={handleAddRow}>
            Add Rule
          </button>
        </div>
      </div>
    );
  };

  //Ruleview return
  return (
    <div className="RuleviewCSS">
      <h2 className="header">
        {exported
          ? 'Your PolicyGen-generated firewall rules have been exported'
          : 'Your PolicyGen-generated firewall rules'}
      </h2>
      {exported ? (
        <p>Thank you for using PolicyGen!</p>
      ) : (
        <EditableTable onExport={() => setExported(true)} />
      )}
    </div>
  );
};

export default Ruleview;
