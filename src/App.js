import logo from './logo.svg';
import './App.css';
import reactDom from 'react-dom';
import React from 'react';

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alive: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    if(this.state.alive){
      this.setState({alive: false});
    }
    else{
      this.setState({alive: true});
    }
    console.log(`cell handleClick`)
    
  }

  render(){
    //if(this.state.alive){
    //  return <div className="alive cell" onClick={this.handleClick}>{this.props.cellID}</div>
    //}
    //else{
    //  return <div className="dead cell" onClick={this.handleClick}>{this.props.cellID}</div>
    //}

    if(this.state.alive){
      return <div className="alive cell" onClick={this.props.onClick}>{this.props.cellID}</div>
    }
    else{
      return <div className="dead cell" onClick={this.props.onClick}>{this.props.cellID}</div>
    }
  }
}

class Row extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      size: parseInt(props.size),
      rowNumber: parseInt(props.rowNumber),
    };
  }

  //handleClick(rowCol){
  //  console.log(`row handleClick() ${rowCol}`)
  //}

  //old cell prop for passing state to row, not board
  //onClick={() => this.handleClick(this.state.rowNumber + "-" + number.toString())}
  render(){
    const nNumbers = Array.from(Array(this.state.size).keys());
    const cellsList = nNumbers.map((number) =>
      <Cell 
        key={this.state.rowNumber.toString() + "-" + number.toString()} 
        cellID={this.state.rowNumber + "-" + number.toString()} 
        onClick={() => this.props.onClick(this.state.rowNumber + "-" + number.toString())}
      />
    );
    return (
          <div>
            {cellsList}
          </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    let n =  parseInt(props.size);
    let cells = new Object();
    for(let i = 0; i < n; i++){
      for(let j = 0; j < n; j++){
        cells[i.toString() + "-" + j.toString()] = false;
      }
    }
    console.log(cells)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      size: parseInt(props.size),
      aliveCells: cells,
    };
  }

  handleClick(rowCol) {
    console.log(rowCol)
    console.log(this.state.aliveCells);
    
    let cells = {...this.state.aliveCells}

    if(cells[rowCol]){
      cells[rowCol] = false;
    }
    else{
      cells[rowCol] = true;
    }
    this.setState({cellsAlive: cells});
  }

  render(){
    const nNumbers = Array.from(Array(this.state.size).keys());
    const rowList = nNumbers.map((number) =>
      <Row 
        boardHandleClick={this.handleClick} 
        rowNumber={number.toString()} 
        size={this.state.size} 
        key={number.toString()} 
        onClick={(rowCol) => this.handleClick(rowCol)}
      />
    );
    return (
          <tbody>
            {rowList}
          </tbody>
    );
  }
}


function App() {
  return (
    <Game size="10"/>
  );
}


export default App;
