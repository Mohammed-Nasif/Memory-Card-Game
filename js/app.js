// Images Sources Object
var cards = {
	'cards/imgxqq.jpg': 0,
	'cards/imgxww.jpg': 0,
	'cards/imgxee.jpg': 1,
	'cards/imgxrr.jpg': 1,
	'cards/imgxtt.jpg': 2,
	'cards/imgxyy.jpg': 2,
	'cards/imgxuu.jpg': 3,
	'cards/imgxii.jpg': 3,
	'cards/imgxoo.jpg': 4,
	'cards/imgxpp.jpg': 4,
	'cards/imgxaa.jpg': 5,
	'cards/imgxss.jpg': 5,
};

// -- Start Game Audios
// var gamemusic = new Audio('audio/game-music.mp3');
// var clickAudio = new Audio('audio/clickAudio.mp3');
// var right = new Audio('audio/rigth.mp3');
// var wrong = new Audio('audio/wrong.mp3');
// var winAudio = new Audio('audio/win.mp3');
// wrong.volume = 0.6;
// -- End Game Audios

// -- Start Global Variables
var flippedCards = [];
var srcID = [];
var moves = 0;
var gameStartFlag = false;
var onOfMusic = true;
var timerStart;
var totalMatch = 0;
var cardsHolder = document.getElementById('cardsHolder');
var movesText = document.getElementById('moves');
var musicBtn = document.getElementById('musicIcon');
// -- End Global Variables

// Stop Some Functionalties on Start
window.onload = function () {
	document.body.style.userSelect = 'none'; // Prevent User to Select Anything From Screen
	musicBtn.style.pointerEvents = 'none'; // Prevent The Click Button Of Music Till Start The Game
};

// Render Cards Divs In The DOM Function
function renderCards() {
	var cardList = shuffle(Object.keys(cards));
	cardList.forEach(function (card) {
		cardsHolder.insertAdjacentHTML(
			'afterbegin',
			`<div class="wrapper">
			<div class="front"></div>
			<div class="back"><img alt="Card" src="${card}"></div>
			</div>`,
		);
	});
}
renderCards();

// Function Handel Cases Of Selection of The Cards
function chooseCards() {
	cardsHolder.addEventListener('click', function (e) {
		var currentCard = e.target.closest('.wrapper'); // Get Only The Target Element With Class Wrapper [Card]
		if (currentCard && flippedCards.length < 2) {
			// Turn The Game Music On When The
// 			gameMusicControl(onOfMusic);
			if (!gameStartFlag) {
				gameStartFlag = true; // Start The Game
				timer(gameStartFlag); // Start The Game Timer
			}
			musicBtn.style.pointerEvents = 'auto';
			flipCard(currentCard); // Flip The Current Card To ViewPort
// 			clickAudio.play();
		}
		if (flippedCards.length === 2) {
			clickSwitch(false); // Turn Of The Click Ability On All Other Cards Till Check
			// If Two Card Are The Same
			if (srcID[0] === srcID[1]) {
				setTimeout(function () {
					matched(flippedCards[0], flippedCards[1]);
					isFinished(totalMatch); // Check Every Time After Match The Avaliable UnMatched Cards
					resetGuesses(); // Reset FlippedCards Array
					setTimeout(function () {
						clickSwitch(true); // Turn On The Ability To Click Again
					}, 500);
				}, 1000);
			} else {
				// If Two Card Are Not The Same
				setTimeout(function () {
					notMatched();
					resetGuesses(); // Reset FlippedCards Array
					setTimeout(function () {
						clickSwitch(true); // Turn On The Ability To Click Again
					}, 500);
				}, 1000);
			}
		}
	});
}
chooseCards();

// Funciton Handel If Two Cards Are Matched
function matched(card1, card2) {
	if (card1 && card2) {
		card1.style.cssText = 'visibility:hidden; pointerEvents: none';
		card2.style.cssText = 'visibility:hidden; pointerEvents: none';
		moves++;
// 		gamemusic.volume = 0.1;
// 		right.play();
		totalMatch++;
	}
}

// Funciton Handel If Two Cards Are Not Matched
function notMatched() {
	Array.from(cardsHolder.children).forEach((child) => {
		child.style.pointerEvents = 'auto';
		child.classList.remove('flipY');
	});
// 	gamemusic.volume = 0.1;
// 	wrong.play();
	moves++;
}

// Function To Reset The Flipped Array After Each Trial
function resetGuesses() {
	movesText.innerText = moves;
	srcID = [];
	flippedCards = [];
}

// Function To Flip The Clicked Card To The ViewPort
function flipCard(currCard) {
	flippedCards.push(currCard);
	currCard.classList.add('flipY');
	currCard.style.pointerEvents = 'none';
	var imgSrc = currCard.children[1].firstChild.getAttribute('src');
	srcID.push(cards[imgSrc]);
}

// Function To Control The Click Ability with Each Trial
function clickSwitch(switchFlag) {
	document.querySelectorAll('.wrapper').forEach((card) => {
		card.style.pointerEvents = switchFlag ? 'auto' : 'none';
	});
// 	gamemusic.volume = 1;
}

// Start Timer Function
function timer(gameStartFlag) {
	if (gameStartFlag) {
		var secsHolder = document.getElementById('seconds');
		var minssHolder = document.getElementById('minutes');
		var seconds = 0;
		timerStart = setInterval(function () {
			seconds++;
			secsHolder.innerText =
				seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60;
			minssHolder.innerText =
				Math.round((seconds % 3600) / 60) < 10
					? '0' + Math.floor((seconds % 3600) / 60)
					: Math.floor((seconds % 3600) / 60);
		}, 1000);
	}
}

// Function To Control The Game Audio
function gameMusicControl(onOfMusic) {
	if (onOfMusic) {
// 		gamemusic.play();
	} else {
// 		gamemusic.pause();
	}
}

// Function To Control The Game Music
function turnMusic() {
	musicBtn.pointerEvents = 'none';
	musicBtn.addEventListener('click', function () {
		if (onOfMusic) {
			onOfMusic = false;
			musicBtn.className = 'fa fa-volume-off';
		} else {
			onOfMusic = true;
			musicBtn.className = 'fa fa-volume-up';
		}
// 		gameMusicControl(onOfMusic);
	});
}
turnMusic();

// Function To Check If The Game Is Finished Or Not
function isFinished(totalMatch) {
	// If Total Matched Trials Is 6 So The Game Is Finished
	if (totalMatch === 6) {
		clearInterval(timerStart);
// 		winAudio.play();
// 		gamemusic.pause();
		// Handling All Winning PopUp Screen
		document.getElementById('win-popup').style.display = 'block';
		document.getElementById('min').innerText =
			document.getElementById('minutes').innerText;
		document.getElementById('sec').innerText =
			document.getElementById('seconds').innerText;
		document.getElementById('total-moves').innerText = moves;
		//IF Close Btn Clicked On The Popup Screen
		document.getElementById('close').addEventListener('click', function () {
			document.getElementById('win-popup').style.display = 'none';
		});
		// If Play Again Btn Clicked On The Popup Screen
		document
			.getElementById('play-again-btn')
			.addEventListener('click', function () {
				location.reload();
			});
	}
}

// Helper Function To Suffle The Cards Every Restart [Source Code From StackoverFlow]
function shuffle(array) {
	var currentIndex = array.length;
	var temporaryValue;
	var randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

// Function To Handle The Restart Event Of The Game
function restartGame() {
	document.getElementById('restart').addEventListener('click', function () {
		location.reload();
	});
}
restartGame();
