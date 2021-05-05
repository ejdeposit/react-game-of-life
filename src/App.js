import logo from './logo.svg';
import reactDom from 'react-dom';
import React from 'react';

import Terminal from 'react-animated-term'
import 'react-animated-term/dist/react-animated-term.css'

import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';

import { BsFillPlayFill } from "react-icons/bs";
import { BsFillPauseFill } from "react-icons/bs";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const  timePeriod = 300;

const colors = ["#7fb170", "#fbdb63", "#faa16e", "#ed413c"]
const colorCount = colors.size;


const termLines = [
  {
    'text': 'GameOfLife --help',
    'cmd': true
  },
  {
    'text': '1. Any live cell with fewer than two live neighbours dies, as if by underpopulation. ',
    'cmd': false
  },
  {
    'text': '2. Any live cell with two or three live neighbours lives on to the next generation.',
    'cmd': false
  },
  {
    'text': '3. Any live cell with more than three live neighbours dies, as if by overpopulation.',
    'cmd': false
  },
  {
    'text': '4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.',
    'cmd': false
  },
  {
    'text': '',
    'cmd': true
  }
]

function mod(a, b){return ((a % b) + b) % b;}

function App() {
  return (
    <div>
      <div className="title">
        <h1>Conway's Game of Life</h1>
      </div>
      <div id="content">
        <Terminal
            className="term"
            lines={termLines}
            interval={100}
            height={200}
          />
        <Game size="18"/>
      </div>
    </div>
  );
}

class Game extends React.Component {
  constructor(props){
    super(props);
    let n =  parseInt(props.size);

    let cells = {};
    for(let i = 0; i < n; i++){
      for(let j = 0; j < n; j++){
        cells[i.toString() + "-" + j.toString()] = false;
      }
    }


    //let color = cellColors[this.state.turn%cellColors.length]
    let initCellColors = {};
    for(let i = 0; i < n; i++){
      for(let j = 0; j < n; j++){
        initCellColors[i.toString() + "-" + j.toString()] = colors[0%colors.length];
      }
    }

    this.handleClick = this.handleClick.bind(this)
    this.pauseResume = this.pauseResume.bind(this)
    this.state = {
      turn: 1,
      size: parseInt(props.size),
      aliveCells: cells,
      pause: true,
      cellColors: initCellColors
    };
    return;
  }
  componentDidMount() {
    if(!this.state.pause){
        this.timerID = setInterval(
          () => this.tick(),
          timePeriod
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

        if(this.state.aliveCells[currentCell]){ // was alive
          if(neighborCount > 1 && neighborCount < 4){
            cells[currentCell] = true;
            this.state.cellColors[currentCell] = colors[this.state.turn%colors.length]
          }
          else{
            cells[currentCell] = false;
          }
        }
        else{ //was dead
          if(neighborCount == 3){
            cells[currentCell] = true;
          }
          else{
            cells[currentCell] = false;
          }
        }
      }
    }
    this.setState({
      aliveCells: cells
    });
  }

  numberOfNeighbors(row, col){
    let neighborsCount = 0
    let n = this.state.size 

    let north = mod(row-1, n).toString() + "-" + col.toString();
    let south = mod(row+1, n).toString() + "-" + col.toString();
    let east = row.toString()+ "-" + mod(col+1, n).toString();
    let west = row.toString() + "-" + mod(col-1, n).toString();
    let northWest = mod(row-1, n).toString() + "-" + mod(col-1, n).toString();
    let northEast = mod(row-1, n).toString() + "-" + mod(col+1, n).toString();
    let southWest = mod(row+1, n).toString() + "-" + mod(col+1, n).toString();
    let southEast = mod(row+1, n).toString() + "-" + mod(col-1, n).toString();
    let locations = [north, south, east, west, northWest, northEast, southWest, southEast]
    locations.forEach(location => {
      if(this.state.aliveCells[location]){
        neighborsCount++;
      }
    })
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

  //TO DO - don't pass state of other cells to each cells
  renderRow(row, size){
    const nNumbers = Array.from(Array(size).keys());
    const rowList = nNumbers.map((number) =>
         //color = {this.state.cellColors[row.toString() + "-" + number.toString()]}
     <Cell 
         key = {row.toString() + "-" + number.toString()} 
         cellID = {row.toString() + "-" + number.toString()}
         aliveCells = {this.state.aliveCells}
         cellColors = {this.state.cellColors}
         onClick={() => this.handleClick(row.toString() + "-" + number.toString())}
     />
    );
    return rowList;
  }
  pauseResume(){
    if(this.state.pause){
      this.timerID = setInterval(
        () => this.tick(),
        timePeriod
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

  renderPlayIcon(){
    if(this.state.pause){
      return <BsFillPlayFill />
    }
    else{
      return <BsFillPauseFill /> 
    }
  }

  render(){
    const nNumbers = Array.from(Array(this.state.size).keys());
    const rowList = nNumbers.map((number) =>
    <div key={number}>{this.renderRow(number, this.state.size)}</div>
    );
    return (
        <div id="game">
          <div id="board">
              {rowList}
          </div>
          <div id="controls">
            <Button onClick={()=>{this.pauseResume()}} variant="danger">
              {this.renderPlayIcon()}
            </Button>{' '}
            <div>Turn: {this.state.turn}</div>
          </div>
        </div>
    );
  }
}
// TO DO - change cell to element it has no state any more
class Cell extends React.Component {
  constructor(props) {
  
    super(props);
  }

  render(){
    let myColor = this.props.cellColors[this.props.cellID]

    if(this.props.aliveCells[this.props.cellID]){
      return <div style={{background: myColor}} className="alive cell" onClick={this.props.onClick}></div>
    }
    else{
      return <div className="dead cell" onClick={this.props.onClick}></div>
    }
  }
}

export default App;
