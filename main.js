const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;
const canvasContext = canvas.getContext("2d");

let canvasXMin = canvas.width - canvas.width;
let canvasYMin = canvas.height - canvas.height;

const numberOfPeople = 20;
const people = [];

for(let i = 0; i < numberOfPeople; i++) {
	const person = {
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height,
		width: 30,
		height: 40,
		color: "blue",
		infected: false,
		dead: false
	};

	people.push(person);
}

function drawPeople() {

	canvasContext.clearRect(0,0, canvas.width, canvas.height);

	for(let i = 0; i < people.length; i++) {
		const { x, y, width, height, infected, dead} = people[i];

		//change color if infected
		if(infected && !dead) {
			canvasContext.fillStyle = "green"
			canvasContext.fillRect(x, y, width, height);
		} else if (infected && dead) {
			canvasContext.fillStyle = "red"
			canvasContext.fillRect(x, y, width, height);
		} else {
			canvasContext.fillStyle = "blue"
			canvasContext.fillRect(x, y, width, height);

		}
	}
}

function movePeople() {
	
	for(let i = 0; i < people.length; i++) {

		if(people[i].infected === false) {
			const randomX = Math.random() * 2 - 1;
			const randomY = Math.random() * 2 - 1;

			//set random position on canvas
			people[i].x += randomX;
			people[i].y += randomY;

			borderCollision(people[i]);

		} else if(people[i].infected && !people[i].dead) { 

			//first we do the logic to get the closest person to curret infected,
			//then we implement chase logic
			
			//set to middle of canvas to initialize
			let closestPerson = { x: canvas.width / 2, y: canvas.height / 2 };
			let closestDistance = Infinity;

			//get list of people
			for (let j = 0; j < people.length; j++) {
				//if not infected, we will get their distance
				if(people[j].infected === false) {

					//find distance, we use the distance formula  √((x2 - x1)² + (y2 - y1)²)
					const distance = Math.sqrt(
						Math.pow(people[j].x - people[i].x, 2) +
						Math.pow(people[j].y - people[i].y, 2)
					);

					//here we check if this person is closest based on distance,
					//if so we make them the new closest person
					if(distance < closestDistance) {
						closestDistance = distance;
						closestPerson = people[j];
					}
				}
			}

			//find angle, using atan2 function. Returns angle in radians
			const angle = Math.atan2(closestPerson.y - people[i].y, closestPerson.x - people[i].x);

			//update infected location to move toward people at correct angle.
			// our speed is how fast we move in that angle
			// we set infected location to these two things
			const speed = 0.4;
			people[i].x += Math.cos(angle) * speed;
			people[i].y += Math.sin(angle) * speed;

			//infect logic
			infectWithPeople(people[i].x, people[i].y);
				

		} else if (people[i].infected && people[i].dead) {
			people[i].x = people[i].x
			people[i].y += people[i].y;
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
			setTimeout(() => {
				people[i].dead = true;
				
			}, 5000);
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

let gameWon = false;
let gameLost = false;

function winGame() {

	let numberOfInfected = 0;
	let numberOfDead = 0;

	for (let i = 0; i < people.length; i++) {
		const person = people[i];

		if (person.infected === true) {
			numberOfInfected++
		}
		if (person.dead === true) {
			numberOfDead++
		}
	}

	if(numberOfInfected === numberOfPeople) {
		gameWon = true;
	}

	if(numberOfDead > 0 && numberOfDead === numberOfInfected) {
		gameLost = true;
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

	winGame();

	if (gameLost) {
		canvasContext.fillStyle = "red";
		canvasContext.font = "30px Arial";
		canvasContext.fillText("You Lost!", canvas.width / 2, canvas.height / 2);
	}
	if (gameWon) {
		canvasContext.fillStyle = "green";
		canvasContext.font = "30px Arial";
		canvasContext.fillText("You Won!", canvas.width / 2, canvas.height / 2);
	}
	

	requestAnimationFrame(gameLoop);
}

window.onload = gameLoop();

