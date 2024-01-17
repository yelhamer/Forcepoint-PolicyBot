import React, { useState } from 'react';
import './Ruleview.css';

const Ruleview = () => {
  const EditableTable = () => {
    const initialData = [
      ['192.68.1.0', 'External', 'HTTP', 'Allow'],
      ['192.68.11.12', '192.68.1.0', 'TCP', 'Deny'],
      // this will then be replaced by the list from backend
    ];

    const MethodOptions = ['HTTP', 'TCP', 'UDP', 'SSH']; // Options for protocol
    const RuleOptions = ['Allow', 'Deny']; // Options for rules

    const [tableData, setTableData] = useState(initialData);

    // Changes the table data to correspond to user input
    const handleCellChange = (rowIndex, columnIndex, value) => {
      const newData = [...tableData];
      newData[rowIndex][columnIndex] = value;
      setTableData(newData);
    };

    // Handles deleting row
    const handleDeleteRow = (rowIndex) => {
      setTableData((prevData) => prevData.filter((_, index) => index !== rowIndex));
    };

    // Handles adding new rule/row to table
    const handleAddRow = () => {
      const newRow = ['0.0.0.0', '0.0.0.0', MethodOptions[0], RuleOptions[0]]; // Initial values for the new row
      setTableData((prevData) => [...prevData, newRow]);
    };

    // Makes an identical rule below it
    const handleDuplicateRow = (rowIndex) => {
      const duplicatedRow = [...tableData[rowIndex]];
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

    //For exporting XML, this code does NOTHING really right now.
    const handleExport = () => {
      // Perform any saving logic here
      // For now, just display a success message
      window.alert('XML export function here...');
    };

    //This can then be modified to choose another Json file etc.
    const handleReset = () => {
      setTableData(initialData);
    };

    //The table display
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
              <th>Service</th>
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
                {row.map((cell, columnIndex) => (
                  <td key={columnIndex}>
                  {columnIndex === 2 || columnIndex === 3 ? (
                    <select 
                      value={cell}
                      onChange={(e) =>
                        handleCellChange(
                          rowIndex,
                          columnIndex,
                          e.target.value
                        )
                      }
                    >
                      {columnIndex === 2
                        ? MethodOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))
                        : RuleOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                    </select>
                  ) : (
                    <input
                      className="editableFields"
                      type="text"
                      value={cell}
                      onChange={(e) =>
                        handleCellChange(
                          rowIndex,
                          columnIndex,
                          e.target.value
                        )
                      }
                    />
                  )}
                </td>
                ))}
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

  //Ruleview display
  return (
    <div className="RuleviewCSS"> {/* Apply the CSS class */}
      <h2 className="header">Edit rules</h2>
      <EditableTable />
      {/* Add more content */}
    </div>
  );
};

export default Ruleview;