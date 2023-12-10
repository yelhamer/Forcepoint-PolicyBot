import './App.css';
import FileSelector from './FileSelector';

function App() {
  const handleFile = (data) => {
    console.log('sending data:', data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>PolicyBot</p>
      </header>
      <main className="App-body">
        <FileSelector onFileSelected={handleFile} />
      </main>
    </div>
  );
}

export default App;
