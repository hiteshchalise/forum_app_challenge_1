import React from 'react';
import Nav from './components/nav';
import Body from './components/body';


import './App.css';

class App extends React.Component{
  render(){
    return (
    <div className="App">
      <Nav />    
      <Body />
    </div>
  );
  }
}

export default App;
