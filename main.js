const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;
const canvasContext = canvas.getContext("2d");

let canvasXMin = canvas.width - canvas.width;
let canvasYMin = canvas.height - canvas.height;

const people = [
	{x: 10, y: 20, width:30, height: 40, color: 'blue', infected: false},
	{x: 50, y: 60, width:30, height: 40, color: 'blue', infected: false},
	{x: 90, y: 100, width:30, height: 40, color: 'blue', infected: false}
];

function drawPeople() {

	canvasContext.clearRect(0,0, canvas.width, canvas.height);

	for(let i = 0; i < people.length; i++) {
		const { x, y, width, height, color, infected} = people[i];

		//change color if infected
		canvasContext.fillStyle = infected ? 'green' : color;
		canvasContext.fillRect(x, y, width, height);
	}
}

function movePeople() {
	
	for(let i = 0; i < people.length; i++) {
		const {x, y, infected} = people[i];

		if(!infected) {
		const randomX = Math.random() * 2 - 1;
		const randomY = Math.random() * 2 - 1;

		people[i].x += randomX;
		people[i].y += randomY;

		borderCollision(people[i]);
		} else { 
			//chase logic
			for (let j = 0; j < people.length; j++) {
				//if infected, chase the people
				if(!people[j].infected) {
					const angle = Math.atan2(people[j].y - y, people[j].x - x);
					const speed = 0.1;
					people[i].x += Math.cos(angle) * speed;
					people[i].y += Math.sin(angle) * speed;

					//infect logic
					infectWithPeople(people[i].x, people[i].y);
				}

				
			}

		}
	}
}

function infectWithPeople(x, y) {

	for(let i = 0; i < people.length; i++) {
		//each person in people
		const { x: personX, y: personY, width, height } = people[i];

		//if the infected touches a person, they become infected
		if(x >= personX && x <= personX + width && y >= personY && y <= personY + height) {
			people[i].infected = true;
		}
	}


}

function borderCollision(person) {


	//if person hits canvas border they re enter at the opposite end
	if(person.x < canvasXMin) {
		person.x = canvas.width;

	} else if(person.x > canvas.width) {
		person.x = canvasXMin;
	}

	if(person.y < canvasYMin) {
		person.y = canvas.height;

	} else if(person.y > canvas.height) {
		person.y = 0;
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
			// we need to use offsetX instead of clientX because event uses the view port coordinates instead of the canvas coordinates
			// we centered the canvas, so the view port and canvas coordinates no longer match
			bullets[i].x = event.offsetX;
			bullets[i].y = event.offsetY;
		}
		canFire = false;
		hasFired = true;
		console.log('has fired');
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

		//if bullet hits person, we infect them
		infectWithBullets(bullets[i].x, bullets[i].y);

	}
}

function infectWithBullets(x, y) {

	for(let i = 0; i < people.length; i++) {
		//each person in people
		const { x: personX, y: personY, width, height } = people[i];

		//if the bullet hits a person, they become infected
		if(x >= personX && x <= personX + width && y >= personY && y <= personY + height) {
			people[i].infected = true;
		}
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

