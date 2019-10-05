import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import VisualEQNavBar from './components/VisualEQNavBar'
import VisualEQNPCViewer from './components/VisualEQNPCViewer'
import VisualEQItemViewer from './components/VisualEQItemViewer'
import './App.css';

function App() {
  let store = 'http://eqtools.eqemu.io/graphics'
  return (
    <div className="App">
      <Router>
        <VisualEQNavBar />
        <Switch>
          <Route path="/item">
            <VisualEQItemViewer store={`${store}/items`}/>
          </Route>
          <Route path="/">
            <VisualEQNPCViewer store={`${store}/characters`}/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
