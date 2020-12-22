import {BrowserRouter as Router, Route} from "react-router-dom";

import HandWritten from "./components/HandWritten";


function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={HandWritten}></Route>
      </Router>
    </div>
  );
}

export default App;
