import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import FileForm from '../pages/Home/FileForm';

function App() {
  return (
    <Router>
      <Route path="/" exact component={FileForm} />
    </Router>
  );
}

export default App;
