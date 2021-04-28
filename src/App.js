import logo from './logo.svg';
import './App.css';
import reactDom from 'react-dom';
import React from 'react';

function mod(a, b){return ((a % b) + b) % b;}

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alive: false,
    };
  }

  render(){
    if(this.props.aliveCells[this.props.cellID]){
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
      //TO DO should size and row number be props?
      size: parseInt(props.size),
      rowNumber: parseInt(props.rowNumber),
    };
  }

  render(){
    const nNumbers = Array.from(Array(this.state.size).keys());
    const cellsList = nNumbers.map((number) =>
      <Cell 
        key={this.state.rowNumber.toString() + "-" + number.toString()} 
        cellID={this.state.rowNumber + "-" + number.toString()} 
        onClick={() => this.props.onClick(this.state.rowNumber + "-" + number.toString())}
        aliveCells ={this.props.aliveCells}
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
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      turn: 1,
      size: parseInt(props.size),
      aliveCells: cells,
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      5000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    let turn = this.state.turn + 1
    this.setState({
      turn: turn
    });

    let cells = new Object();
    let n = this.state.size 
    for(let i = 0; i < n; i++){
      for(let j = 0; j < n; j++){
        let currentCell = i.toString() + "-" + j.toString()  
        let neighborCount = this.numberOfNeighbors(i, j)
        //console.log(neighborCount)

        if(this.state.aliveCells[currentCell]){
          if(neighborCount > 1 && neighborCount < 4){
            cells[currentCell] = true;
          }
          else{
            cells[currentCell] = false;
          }
        }
        else{
          if(neighborCount == 3){
            cells[currentCell] = true;
          }
          else{
            cells[currentCell] = false;
          }
        }
      }
    }
    //console.log(cells)
    this.setState({
      aliveCells: cells
    });
  }

  numberOfNeighbors(row, col){
    let neighborsCount = 0
    let n = this.state.size 

    let above = mod(row-1, n).toString() + "-" + col.toString();
    let below = mod(row+1, n).toString() + "-" + col.toString();
    let right = row.toString()+ "-" + mod(col+1, n).toString();
    let left = row.toString() + "-" + mod(col-1, n).toString();
    if(this.state.aliveCells[above]){
      neighborsCount++;
    }
    if(this.state.aliveCells[below]){
      neighborsCount++;
    }
    if(this.state.aliveCells[right]){
      neighborsCount++;
    }
    if(this.state.aliveCells[left]){
      neighborsCount++;
    }
    return neighborsCount

  }

  handleClick(rowCol) {
    let cells = {...this.state.aliveCells}

    if(cells[rowCol]){
      cells[rowCol] = false;
    }
    else{
      cells[rowCol] = true;
    }
    this.setState({aliveCells: cells});
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
        aliveCells={this.state.aliveCells}
      />
    );
    return (
          <div>
          <tbody>
            {rowList}
          </tbody>
          <text>{this.state.turn}</text>
          </div>
    );
  }
}


function App() {
  return (
    <Game size="10"/>
  );
}


export default App;
