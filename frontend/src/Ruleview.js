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
      const newRow = [null, null, MethodOptions[0], RuleOptions[0]]; // Initial values for the new row
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
              <th>Source</th>
              <th>Destination</th>
              <th>Protocol</th>
              <th>Rule</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
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
          <strong>Making sure the list updates: only for debug basically</strong>
          <pre>{JSON.stringify(tableData, null, 2)}</pre>
        </div>
      </div>
    );
  };

  //Ruleview display
  return (
    <div className="RuleviewCSS"> {/* Apply the CSS class */}
      <h2>Edit rules</h2>
      <EditableTable />
      {/* Add more content */}
    </div>
  );
};

export default Ruleview;