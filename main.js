const canvas = document.getElementById("canvas");
canvas.width = 300;
canvas.height = 300;
const canvasContext = canvas.getContext("2d");

canvasContext.fillStyle = "green";
canvasContext.fillRect(10, 10, 150, 100);

let canvasXMin = canvas.width - canvas.width;
let canvasYMin = canvas.height - canvas.height;

const people = [
	{x: 10, y: 20, width:30, height: 40, color: 'blue'},
	{x: 50, y: 60, width:30, height: 40, color: 'blue'}
];

function drawPeople() {

	canvasContext.clearRect(0,0, canvas.width, canvas.height);

	for(let i = 0; i < people.length; i++) {
		const { x, y, width, height, color} = people[i];

		canvasContext.fillStyle = color;
		canvasContext.fillRect(x, y, width, height);
	}
}

function movePeople() {
	
	for(let i = 0; i < people.length; i++) {
		const {x, y, width, height, color} = people[i];

		const randomX = Math.random() * 2 - 1;
		const randomY = Math.random() * 2 - 1;

		people[i].x += randomX;
		people[i].y += randomY;

		if(people[i].x < canvasXMin) {
			people[i].x = canvas.width;

		} else if(people[i].x > canvas.width) {
			people[i].x = canvasXMin;
		}

		if(people[i].y < canvasYMin) {
			people[i].y = canvas.height;

		} else if(people[i].y > canvas.height) {
			people[i].y = 0;
		}
	}
}

//shoot infection
let bullets = [
	{x: 0, y: 0, directX:0, directY: -1}, // up
	{x: 0, y: 0, directX:1, directY: 0}, // right
	{x: 0, y: 0, directX:0, directY: 1}, // down
	{x: 0, y: 0, directX:-1, directY: 0}  // left
];

let canFire = true
let hasFired = false


function handleClick(event) {
	
	if(canFire) {
		for(let i = 0; i < bullets.length; i++) {
			bullets[i].x = event.clientX;
			bullets[i].y = event.clientY;
		}
		canFire = false;
		hasFired = true;
	}
}


function drawBullets() {

	for(let i = 0; i < bullets.length; i++) {
		const x = bullets[i].x;
		const y = bullets[i].y;

			canvasContext.fillStyle = 'black';
			canvasContext.fillRect(x, y, 5, 5);
	}
}

function moveBullets() {

	for(let i = 0; i < bullets.length; i++) {
		bullets[i].x += bullets[i].directX;
		bullets[i].y += bullets[i].directY;
	}
}


function gameLoop() {
	movePeople();
	drawPeople();

	//if we can fire and we click, we will fire and set has fired to true. We can only fire once.
	canvas.addEventListener('click', handleClick);
	if(hasFired) {
		drawBullets();
		moveBullets();
	}

	requestAnimationFrame(gameLoop);
}

window.onload = gameLoop();

