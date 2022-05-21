/*
 * This file is part of htmlMaze	.
 *
 * htmlMaze is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * htmlMaze is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with htmlMaze.  If not, see <https://www.gnu.org/licenses/>.
 */

var sec = 0;
    function pad ( val ) { return val > 9 ? val : "0" + val; }
    setInterval( function(){
        document.getElementById("seconds").innerHTML=pad(++sec%60);
        document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
    }, 1000);


let ctx;
let canvas;
let maze;
let mazeHeight;
let mazeWidth;
let player;

class Player {

  constructor() {
    this.col = 0;
    this.row = 0;
  }

}

class MazeCell {

  constructor(col, row) {
    this.col = col;
    this.row = row;

    this.eastWall = true;
    this.northWall = true;
    this.southWall = true;
    this.westWall = true;

    this.visited = false;
  }

}

class Maze {

  constructor(cols, rows, cellSize) {

    this.backgroundColor = "#ffffff";
    this.cols = cols;
    this.endColor = "#88FF88";
    this.mazeColor = "#000000";
    this.playerColor = "#880088";
    this.rows = rows;
    this.cellSize = cellSize;
	
    this.cells = [];

    this.score = 0;
    this.skip = 0;
    this.moves = 0;
    this.bpress = 0;
	this.bleft = 0;
	this.bright = 0;  
    this.scoreboard = document.querySelector('.scoreboard');

    this.generate()
    
  }

  generate() {
		
    mazeHeight = this.rows * this.cellSize;
    mazeWidth = this.cols * this.cellSize;

    canvas.height = mazeHeight+50;
    canvas.width = mazeWidth;
    canvas.style.height = mazeHeight+50;
    canvas.style.width = mazeWidth;
    
    player.col = 0
    player.row = 0

    for (let col = 0; col < this.cols; col++) {
      this.cells[col] = [];
      for (let row = 0; row < this.rows; row++) {
        this.cells[col][row] = new MazeCell(col, row);
      }
    }

    let rndCol = Math.floor(Math.random() * this.cols);
    let rndRow = Math.floor(Math.random() * this.rows);

    let stack = [];
    stack.push(this.cells[rndCol][rndRow]);

    let currCell;
    let dir;
    let foundNeighbor;
    let nextCell;
    
  	ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";    
    ctx.fillText('score: ' + this.score,  mazeHeight/2,  mazeHeight+20);

	this.updateScoreBoard();
    this.updateSkip();
	this.updateMoves();
	this.updateBpress();
	this.updateBleft();
	this.updateBright();
	  
    while (this.hasUnvisited(this.cells)) {
      currCell = stack[stack.length - 1];
      currCell.visited = true;
      if (this.hasUnvisitedNeighbor(currCell)) {
        nextCell = null;
        foundNeighbor = false;
        do {
          dir = Math.floor(Math.random() * 4);
          switch (dir) {
            case 0:
              if (currCell.col !== (this.cols - 1) && !this.cells[currCell.col + 1][currCell.row].visited) {
                currCell.eastWall = false;
                nextCell = this.cells[currCell.col + 1][currCell.row];
                nextCell.westWall = false;
                foundNeighbor = true;
              }
              break;
            case 1:
              if (currCell.row !== 0 && !this.cells[currCell.col][currCell.row - 1].visited) {
                currCell.northWall = false;
                nextCell = this.cells[currCell.col][currCell.row - 1];
                nextCell.southWall = false;
                foundNeighbor = true;
              }
              break;
            case 2:
              if (currCell.row !== (this.rows - 1) && !this.cells[currCell.col][currCell.row + 1].visited) {
                currCell.southWall = false;
                nextCell = this.cells[currCell.col][currCell.row + 1];
                nextCell.northWall = false;
                foundNeighbor = true;
              }
              break;
            case 3:
              if (currCell.col !== 0 && !this.cells[currCell.col - 1][currCell.row].visited) {
                currCell.westWall = false;
                nextCell = this.cells[currCell.col - 1][currCell.row];
                nextCell.eastWall = false;
                foundNeighbor = true;
              }
              break;
          }
          if (foundNeighbor) {
            stack.push(nextCell);
          }
        } while (!foundNeighbor)
      } else {
        currCell = stack.pop();
      }
    }
		
    this.redraw();

  }

  hasUnvisited() {
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        if (!this.cells[col][row].visited) {
          return true;
        }
      }
    }
    return false;
  }

  hasUnvisitedNeighbor(mazeCell) {
    return ((mazeCell.col !== 0               && !this.cells[mazeCell.col - 1][mazeCell.row].visited) ||
            (mazeCell.col !== (this.cols - 1) && !this.cells[mazeCell.col + 1][mazeCell.row].visited) ||
            (mazeCell.row !== 0               && !this.cells[mazeCell.col][mazeCell.row - 1].visited) ||
            (mazeCell.row !== (this.rows - 1) && !this.cells[mazeCell.col][mazeCell.row + 1].visited));
  }

  updateScoreBoard() {
	/*Qualtrics.SurveyEngine.setEmbeddedData("score1", this.score);*/
  }
  
  updateSkip() {
	/*Qualtrics.SurveyEngine.setEmbeddedData("skip1", this.skip);*/
	document.getElementById("dskip").innerHTML = `times skipped: ${this.skip}`;
  }
  
  updateMoves() {
   	/*Qualtrics.SurveyEngine.setEmbeddedData("moves1", this.moves);*/
	document.getElementById("dmoves").innerHTML = `moves: ${this.moves}`;
  }
  
  updateBpress() {
 	/*Qualtrics.SurveyEngine.setEmbeddedData("bpress1", this.bpress);*/
	document.getElementById("dbpress").innerHTML = `button presses: ${this.bpress}`;
  }  

  updateBleft() {
 	/*Qualtrics.SurveyEngine.setEmbeddedData("bleft1", this.bleft);*/
	document.getElementById("dbleft").innerHTML = `WASD: ${this.bleft}`;
  }  

  updateBright() {
 	/*Qualtrics.SurveyEngine.setEmbeddedData("bright1", this.bright);*/
	document.getElementById("dbright").innerHTML = `IJKL: ${this.bright}`;
  }  	  
	  
  redraw() {

    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, mazeHeight, mazeWidth);

    ctx.fillStyle = this.endColor;
    ctx.fillRect((this.cols - 1) * this.cellSize, (this.rows - 1) * this.cellSize, this.cellSize, this.cellSize);

    ctx.strokeStyle = this.mazeColor;
    ctx.strokeRect(0, 0, mazeHeight, mazeWidth);
    	
      
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        if (this.cells[col][row].eastWall) {
          ctx.beginPath();
          ctx.moveTo((col + 1) * this.cellSize, row * this.cellSize);
          ctx.lineTo((col + 1) * this.cellSize, (row + 1) * this.cellSize);
          ctx.stroke();
        }
        if (this.cells[col][row].northWall) {
          ctx.beginPath();
          ctx.moveTo(col * this.cellSize, row * this.cellSize);
          ctx.lineTo((col + 1) * this.cellSize, row * this.cellSize);
          ctx.stroke();
        }
        if (this.cells[col][row].southWall) {
          ctx.beginPath();
          ctx.moveTo(col * this.cellSize, (row + 1) * this.cellSize);
          ctx.lineTo((col + 1) * this.cellSize, (row + 1) * this.cellSize);
          ctx.stroke();
        }
        if (this.cells[col][row].westWall) {
          ctx.beginPath();
          ctx.moveTo(col * this.cellSize, row * this.cellSize);
          ctx.lineTo(col * this.cellSize, (row + 1) * this.cellSize);
          ctx.stroke();
        }
      }
    }
    ctx.beginPath();
    ctx.arc((player.col * this.cellSize) + 12.5, (player.row * this.cellSize) + 12.5, this.cellSize/2-2, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = this.playerColor;
    ctx.fill();
    if (player.col == this.cols -1 && player.row == this.rows -1) {
      this.score++;
      this.generate();
			this.updateScoreBoard();
    }

  }

}

function onClick(event) {
  maze.generate();
  maze.skip++;
  maze.updateSkip();
}

function onKeyDown(event) {
  switch (event.keyCode) {
 /*   case 116 : //F5 button
      event.returnValue = false;
      event.keyCode = 0;
      return false;
    case 82 : //R button
      if (event.ctrlKey)
      { 
        event.returnValue = false;
        event.keyCode = 0;
        return false;
      }
      break; */
	case 32: 	
      maze.generate();
      maze.skip++;
      maze.updateSkip();      
      break;
    //case 37:
    case 65:
      maze.bpress++;
      maze.updateBpress();
      maze.bleft++;
	  maze.updateBleft(); 		  
      if (!maze.cells[player.col][player.row].westWall) {
        player.col -= 1;
        maze.moves++;
        maze.updateMoves();
      }
      break;
    case 74:
      maze.bpress++;
      maze.updateBpress();
      maze.bright++;		  
	  maze.updateBright(); 		  
      if (!maze.cells[player.col][player.row].westWall) {
        player.col -= 1;
        maze.moves++;
        maze.updateMoves();
      }
      break;		  
    //case 39:
    case 68:
	  maze.bpress++;
      maze.updateBpress();		  
      maze.bleft++;
	  maze.updateBleft(); 
      if (!maze.cells[player.col][player.row].eastWall) {
        player.col += 1;
        maze.moves++;
        maze.updateMoves();		
      }
      break;  
    case 76:
	  maze.bpress++;
      maze.updateBpress();		  
      maze.bright++;		  
	  maze.updateBright(); 
      if (!maze.cells[player.col][player.row].eastWall) {
        player.col += 1;
        maze.moves++;
        maze.updateMoves();
      }
      break;
    //case 40:
    case 83:
      maze.bpress++;
      maze.updateBpress();
      maze.bleft++;
	  maze.updateBleft();		  
      if (!maze.cells[player.col][player.row].southWall) {
        player.row += 1;
        maze.moves++;
        maze.updateMoves();
      }
      break;
    case 75:
      maze.bpress++;
      maze.updateBpress();
      maze.bright++;		  
	  maze.updateBright(); 		  
      if (!maze.cells[player.col][player.row].southWall) {
        player.row += 1;
        maze.moves++;
        maze.updateMoves();
      }
      break;		  
    //case 38:
    case 87:
      maze.bpress++;
      maze.updateBpress();
      maze.bleft++;
	  maze.updateBleft();		  
      if (!maze.cells[player.col][player.row].northWall) {
        player.row -= 1;
        maze.moves++;
        maze.updateMoves();
      }
      break;
    case 73:
      maze.bpress++;
      maze.updateBpress();
      maze.bright++;		  
	  maze.updateBright(); 		  
      if (!maze.cells[player.col][player.row].northWall) {
        player.row -= 1;
        maze.moves++;
        maze.updateMoves();
      }
      break;		  
    default:
      break;
  }
  maze.redraw();
}


function onLoad() {

  canvas = document.getElementById("mainForm");
  ctx = canvas.getContext("2d");

  player = new Player();
  maze = new Maze(12, 12, 25);

  document.addEventListener("keydown", onKeyDown);
  document.getElementById("generate").addEventListener("click", onClick);

}
