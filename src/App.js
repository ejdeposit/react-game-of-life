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
    this.pauseResume = this.pauseResume.bind(this)
    this.state = {
      turn: 1,
      size: parseInt(props.size),
      aliveCells: cells,
      pause: true,
    };
  }
  componentDidMount() {
    if(!this.state.pause){
        this.timerID = setInterval(
          () => this.tick(),
          1000
        );
    }
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

  renderRow(row, size){
    const nNumbers = Array.from(Array(size).keys());
    const rowList = nNumbers.map((number) =>
     <Cell 
         key={row.toString() + "-" + number.toString()} 
         cellID={row.toString() + "-" + number.toString()}
         aliveCells ={this.state.aliveCells}
         onClick={() => this.handleClick(row.toString() + "-" + number.toString())}
     />
    );

    return rowList;
  }
  pauseResume(){
    //console.log(this.state.pause)
    if(this.state.pause){
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
      //set state
      this.setState({
        pause: false,
      });
    }
    else{
      clearInterval(this.timerID);
      this.setState({
        pause: true,
      });
    }
  }

  render(){
    const nNumbers = Array.from(Array(this.state.size).keys());
    const rowList = nNumbers.map((number) =>
    <div key={number}>{this.renderRow(number, this.state.size)}</div>
    );
    return (
        <div>
          <div className="row">
            {rowList}
          </div>
          <div>Turn: {this.state.turn}</div>
          <button onClick={this.pauseResume}>play/resume</button>
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
