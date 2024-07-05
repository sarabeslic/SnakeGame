
let snake = [{x:3, y:7}];//starting position of the snake
let gridSizeAbove=19; //it needs to be above 19 cause 18 is still our last square
let direction='right'; //initial direction set
let gameActive = true; //to check if the game is active

let food=randomApple();
let speedDelay=200;
let userScore=0; //inital score set to 0
let gameInterval;

//the DOM elements
const field = document.getElementById("field");
const board = document.querySelector(".game");
const userScoreElement=document.getElementById("user-score");
const front = document.getElementById("intro");
const scoreBoard = document.querySelector(".board");
const h1=document.getElementById("h1");


//DRAWING ON THE BOARD------------------------------------------------------------------------------------------------------

function draw(){ //updating and rendering the game state
    board.innerHTML=""; //it will clear the playing field
    drawSnake();
    drawApple();
    }
draw();

//SNAKE DRAWING!--------------------------------------------------------------------------------------------
function drawSnake(){
    snake.forEach(segment=>{
      const snakeElement=createGameElement('div', 'snake');// Creating a new HTML element (div) for the snake segment
      setPosition(snakeElement, segment); // Setting the position of the snake segment using the setPosition function
      board.appendChild(snakeElement);// Appending the snake segment to the game board
    })      
}

//MOVING THE SNAKE-arrow keys commands---------------------------------------------------------------------------------------

document.addEventListener('keydown', playerKey); // Add event listener for key presses
let nextDirection = 'right'; // Initialize next direction

function playerKey(event) {
    // Update the next direction based on the pressed key and check if it's opposite to the current direction, so that the snake can't eats it's own head
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') {
                nextDirection = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up') {
                nextDirection = 'down';
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right') {
                nextDirection = 'left';
            }
            break;
        case 'ArrowRight':
            if (direction !== 'left') {
                nextDirection = 'right';
            }
            break;
    }
}

/*if we only move the head in the direction we want but do not update the head, it means that the values of the head goes to the end
of the snake and not a the position 0, so we need to use unshift to move the new head values to the front of the array!
UNSHIFT used to add an element to the begining of an array*/

//MOVING THE SNAKE AFFTER THE KEY IS PRESSED--------------------------------------------------------------------------------

const sound=document.getElementById("sound"); //sound for eating the apple
sound.src="eatingSound.mp3";

//Using { ...snake[0] } ensures that any changes made to the copied object won't affect the original object in the snake array
function moveSnake() {
    const head = { ...snake[0] }; 
    direction = nextDirection; // Update the direction
    if (!gameActive) {
        return; // Stop moving if the game is not active
    }

    switch (direction) {
        case "up":
            head.y -= 1;
            break;
        case "left":
            head.x -= 1;
            break;
        case "down":
            head.y += 1;
            break;
        case "right":
            head.x += 1;
            break;
        }
        
        snake.unshift(head);// Add the new head to the front of the snake
        
    //checking if the head is outside the grid and where to place it
        if (head.x < 0) {
            head.x = gridSizeAbove; // set to 19 because we have 18 squares and we need to start from the last grid
        } else if (head.x >= gridSizeAbove) {
            head.x = 0; //set to 0 because it needs to start from the begining
        }
        if (head.y < 0) {
            head.y = gridSizeAbove; 
        } else if (head.y >= gridSizeAbove) {
            head.y = 0;
        }
        
//checking if the snake ate the apple
        if (head.x === food.x && head.y === food.y) { //is the cordiantes of the head the same as the food
            userScore++;
            sound.play();
            userScoreElement.innerHTML = userScore; // Update the score
            food = randomApple();
            
        }else{
            snake.pop(); //pop the tail if it didnt eat the apple
        }
        //checking for self collision and execution of game over
        if (selfCollision()) { 
            gameOver();
            return; 
        } 
        
    }

//if we had only ove we could have written it like setInterval(moveSnake,200), but since we have two functions we neeed to write it as
//wrapped function.

function selfCollision() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {// Loop through the snake starting from the 2nd element (index 1)
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true; // Collision detected
        }
    }
    return false; // No collision
}

//STARTING THE GAME---------------------------------------------------------------------------------
function startSnakeGame(){
    h1.style.display="block";
    front.style.display = "none";
    scoreBoard.style.visibility= "visible";
    board.style.visibility = "visible"; // Set visibility to visible

}
    
//A GAME OVER PAUSING THE GAME SCREEN-------------------------------------------------------------------------------
function gameOver() {  
    buttonRestart=document.getElementById("restart-button");
    buttonRestart.style.display="block";
    buttonRestart.addEventListener("click", resetGame);
    gameActive = false;
}

//RESTARTING THE GAME-------------------------------------------------------------------------------------------------
function resetGame() {
    buttonRestart.style.display = "none";
    userScore=0;
    userScoreElement.innerHTML = userScore;
    snake = [{ x: 3, y: 7 }]; // Initial snake position
    direction = 'right'; // Initial direction
    food = randomApple(); // Place a new food
    
    gameActive = true;
    clearInterval(gameInterval); // Clear the previous interval
    gameInterval = setInterval(() => {
        moveSnake();
        draw();
            
    }, speedDelay);
}

//CREATING THE GAME ELEMENTS------------------------------------------------------------------------------------------------
function createGameElement(tag, className){
    const element=document.createElement(tag); // we are creating with this method a new element in html, tag is a div here, in our case
    element.className=className; //class name is snake
    return element; 
    
}
function setPosition(element, position){ //position is basically a segment with x and y cordinates
  element.style.gridColumn=position.x;
  element.style.gridRow=position.y;
}


//FOR FOOD--------------------------------------------------------------------------------------------
function randomApple(){
    const x=Math.floor((Math.random()*18) + 1);//bacause we have 18 squares and +1 is to avoid 0
    const y=Math.floor((Math.random()*18) + 1);
    return ({x, y})   //returning an object with x and y cordinates
}

//DRAWING THE APPLE ON THE BOARD--------------------------------------------------------------------------------------------
function drawApple() {
    const appleElement = createGameElement('img', 'apple');// Creating a new HTML element (img) for the apple
    appleElement.src ='applesmall.png'; // Image source
    setPosition(appleElement, food);
    board.appendChild(appleElement); // Add the apple to the game field
}


//FOR THE SLIDER ON THE SIDE------------------------------------------------------------------------------------------------
function toggleSlider() {
    let sliderCard = document.getElementById('sliderCard');
    let currentRight = parseInt(window.getComputedStyle(sliderCard).right); //parseInt converts string to number, and getComputedStyle
    //gets the style of the element, in this case the right position of the element

    // Toggle the card position when the button is clicked
    if (currentRight === 0) {
        sliderCard.style.right = '-300px';
    } else {
        sliderCard.style.right = '0';
    }
}

//FOR THE BACKGROUND BUTTONS------------------------------------------------------------------------------------------------
function handleButtonClick(buttonNumber) {
    let backgroundUrl; // Declare a variable to store the background image URL

    switch (buttonNumber) {
        case 1:
            backgroundUrl = 'board1.png';
            break;
        case 2:
            backgroundUrl = 'board2.png';
            break;
        case 3:
            backgroundUrl = 'board3.png';
    }

    // Set the background image dynamically, based on the button that was clicked
    board.style.backgroundImage = 'url("' + backgroundUrl + '")';

}

//GAME LOOP------------------------------------------------------------------------------------------------
function gameLoop() {
    moveSnake();
    draw();
    if (gameActive) {
        setTimeout(gameLoop, speedDelay);
    }
}

gameLoop();



