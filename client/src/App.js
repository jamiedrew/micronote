import Sidebar from "./Components/Sidebar";
import NoteList from "./Components/NoteList";

import './App.css';

function App() {

  return (
      <div className="App">

        {/* sidebar */}
        <div id="sidebar">
          <Sidebar />
        </div>

        {/* main content */}
        <div id="main">
          <NoteList />
        </div>

      </div>
  );
}

export default App;
