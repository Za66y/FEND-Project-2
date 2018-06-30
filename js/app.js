/*
 * Create a list that holds all of your cards
 */

var cards = ['fa-diamond', 'fa-diamond', 'fa-bomb', 'fa-bomb', 'fa-bolt', 'fa-bolt', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-cube', 'fa-cube', 'fa-bicycle', 'fa-bicycle', 'fa-anchor', 'fa-anchor', 'fa-leaf', 'fa-leaf'];

// dynamically creates HTML cards and adds to page
function generateCard(card) {            
    return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Function that goes through each card, adds event listener, adds open/show classes when clicked, and adds match class when they match
function activateCards() {
    allCards.forEach(function(card) {
        card.addEventListener('click', function(e) {
        console.log("A card was clicked!");   
            if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
                openCards.push(card);
                if (openCards.length < 3) {
                    card.classList.add('open', 'show');
                    // If cards match, show!
                    if (openCards.length == 2) {
                        if (openCards[0].dataset.card == openCards[1].dataset.card) {
                            openCards[0].classList.add('match');
                            openCards[0].classList.add('open');
                            openCards[0].classList.add('show');

                            openCards[1].classList.add('match');
                            openCards[1].classList.add('open');
                            openCards[1].classList.add('show');

                            openCards = [];
                            matched++;
                        } else { 
                            // If they do not match, hide
                            setTimeout(function(){
                                openCards.forEach(function(card) {
                                    card.classList.remove('open', 'show');
                                });

                                openCards = [];
                            }, 800);
                        }
                        addMove();
                        checkScore();
                        checkForGameOver();
                    }
                }
            }
        });
    });   
};

// checks for first click, starts timer
function startGame() {
    allCards.forEach(function(card){
        card.addEventListener('click', function(){
            if(initialClick === false) {
                initialClick = true;
                clockOff = false;
                startTimer();
            }
        })
    });
};

// adds a move to move counter
function addMove () {
    moves++;
    var movesCounter = document.querySelector('.moves');
    movesCounter.innerHTML = moves;
}

// removes a star grade in gradients
function checkScore() {
    if (moves === 10 || moves === 20) {
        removeStar();
    }
}

// visually removes star
function removeStar() {
    var starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}


let hour = 0;
let minutes = 0;
let seconds = 0;
let timer;
let initialClick = false;

// formats time
function formatTime() {
    let sec = seconds > 9 ? String(seconds) : '0' + String(seconds);
    let min = minutes > 9 ? String(minutes) : '0' + String(minutes);
    return min + ':' + sec;
}

// converts time after 60 seconds to minutes
function startTimer() {
    timer = setInterval(function(){
        seconds++;
        if(seconds == 60) {
            minutes++;
            seconds = 0;
        }
        console.log(formatTime());
        displayTime();
        
    }, 1000);
}

// stops timer
function stopTimer() {
    clearInterval(timer);
}

// used to display the time in modal
function displayTime() {
    const clock = document.querySelector('.clock');
    console.log(clock);
    clock.innerHTML = formatTime();
}

// displays modal
function toggleModal() {
    const modal = document.querySelector('.modal__background');
    modal.classList.toggle('hide');
}

// adds stats to modal window
function writeModalStats() {
    const timeStat = document.querySelector('.modal__time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal__moves');
    const starsStat = document.querySelector('.modal__stars');
    const stars = getStars();

    timeStat.innerHTML = `Time = ${clockTime}`;
    movesStat.innerHTML = `Moves = ${moves}`;
    starsStat.innerHTML = `Stars = ${stars}`;
}

// retrieves stars to add to modal stats
function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++
        }
    }
    console.log(starCount);
    return starCount;
}


// resets game completely, resets game, resets clock, resets stars, restarts game/activates the click event listener
function resetGame() {
    resetClockAndTime();
    resetMoves();
    resetStars();
    initGame();
    activateCards();
    startGame();
}

// resets clock to 0
function resetClockAndTime() {
    stopTimer();
    clockOff = true;
    hour = 0;
    minutes = 0;
    seconds = 0;
    displayTime();
}

// resets move counter
function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

// resets stars grade
function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

// pops modal, stops timer, gathers game stats
function gameOver() {
    stopTimer();
    toggleModal();
    writeModalStats();
}

// checks for game over when 8 matches are made
function checkForGameOver() {
    if (matched === totalPairs) {
        gameOver();
    }
}

// resets game, toggles modal (hides)
function replayGame() {
    resetGame();
    toggleModal();
}

// completely reloads page
function reloadPage() {
    location.reload();
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 // calls generateCard function to dynamically add cards to page
function initGame() {
    var deck = document.querySelector('.deck')  
    var cardHTML = shuffle(cards).map(function(card) {
        return generateCard(card);
    });

    deck.innerHTML = cardHTML.join('');
}

initGame();


var allCards = document.querySelectorAll('.card');
var openCards = [];
var moves = 0;
var clockOff = true;
var deck = document.querySelector('.deck');
var matched = 0;   
const totalPairs = 8;



activateCards();
startGame();

document.querySelector('.modal__cancel').addEventListener('click', () => {
    toggleModal();
});

document.querySelector('.restart').addEventListener('click', resetGame);

document.querySelector('.modal__replay').addEventListener('click', reloadPage);

