const playerHand = document.getElementById("player-hand");
const computerHand = document.getElementById("computer-hand");
const drawPlayerButton = document.getElementById("draw-player");
const playerHpDisplay = document.getElementById("player-hp");
const computerHpDisplay = document.getElementById("computer-hp");
const battleLog = document.getElementById("battle-log");
const battlefield = document.getElementById("battlefield");

let deck = [];
let playerHandCards = [];
let computerHandCards = [];
let playerHp = 20;
let computerHp = 20;
let turn = "player"; // Pemain memulai duluan
let usedCardsContainer = document.createElement("div");
usedCardsContainer.id = "used-cards";
document.body.appendChild(usedCardsContainer);

const suits = ["♥", "♦", "♠", "♣"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let i = 0; i < values.length; i++) {
            deck.push({ suit, value: values[i], strength: i + 2 });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCard() {
    return deck.length > 0 ? deck.pop() : null;
}

function renderCard(card, hand, isClickable = false) {
    hand.innerHTML = ""; // Hanya tampilkan kartu terbaru (agar bertumpuk)
    
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.textContent = `${card.value} ${card.suit}`;
    cardElement.cardData = card; // Simpan data kartu dalam elemen
    hand.appendChild(cardElement);

    if (isClickable) {
        cardElement.addEventListener("click", () => {
            if (turn === "player") {
                playCard(card, cardElement);
            }
        });
    }

    return cardElement;
}

function playCard(playerCard, playerCardElement) {
    if (turn !== "player") return;

    // Pastikan komputer memiliki kartu untuk dimainkan
    let computerCard = drawCardIfNeeded(computerHandCards, computerHand);
    if (!computerCard) return;

    let computerCardElement = renderCard(computerCard, computerHand, false);

    battlefield.innerHTML = "";
    moveCardToCenter(playerCardElement, true);

    setTimeout(() => {
        moveCardToCenter(computerCardElement, false);

        setTimeout(() => {
            determineWinner(playerCard, computerCard, playerCardElement, computerCardElement);
        }, 1000);
    }, 1000);
}

function moveCardToCenter(cardElement, isPlayer) {
    battlefield.appendChild(cardElement);
    cardElement.style.position = "absolute";
    cardElement.style.transition = "transform 0.5s ease-in-out";
    cardElement.style.transform = `scale(1.5) translateY(${isPlayer ? "-30px" : "30px"})`;
}

function determineWinner(playerCard, computerCard, playerCardElement, computerCardElement) {
    let winner = "";
    let damage = Math.abs(playerCard.strength - computerCard.strength);

    if (playerCard.strength > computerCard.strength) {
        winner = "Pemain menang!";
        computerHp -= damage;
        computerHpDisplay.textContent = computerHp;
        turn = "player"; // Pemain tetap mulai duluan
    } else if (playerCard.strength < computerCard.strength) {
        winner = "Komputer menang!";
        playerHp -= damage;
        playerHpDisplay.textContent = playerHp;
        turn = "computer"; // Komputer mulai duluan
    } else {
        winner = "Seri!";
    }

    battleLog.innerHTML += `<p>${playerCard.value} ${playerCard.suit} vs ${computerCard.value} ${computerCard.suit} → ${winner} (${damage} damage)</p>`;

    setTimeout(() => {
        archiveCards(playerCardElement, computerCardElement);
        checkEndGame();
    }, 1000);
}

function archiveCards(playerCardElement, computerCardElement) {
    playerCardElement.style.transition = "transform 0.5s ease-in-out, opacity 0.5s";
    computerCardElement.style.transition = "transform 0.5s ease-in-out, opacity 0.5s";

    playerCardElement.style.transform = "translateY(100px) scale(1)";
    computerCardElement.style.transform = "translateY(100px) scale(1)";

    setTimeout(() => {
        playerCardElement.style.opacity = "0.5";
        computerCardElement.style.opacity = "0.5";

        usedCardsContainer.appendChild(playerCardElement);
        usedCardsContainer.appendChild(computerCardElement);

        nextTurn();
    }, 500);
}

function nextTurn() {
    if (turn === "computer") {
        setTimeout(computerTurn, 1000);
    }
}

function computerTurn() {
    let card = drawCardIfNeeded(computerHandCards, computerHand);
    if (!card) return;

    let cardElement = renderCard(card, computerHand, false);
    battlefield.innerHTML = "";
    moveCardToCenter(cardElement, false);

    turn = "player"; // Beri giliran ke pemain
}

function drawCardIfNeeded(handCards, hand) {
    if (handCards.length === 0) {
        let newCard = drawCard();
        if (newCard) {
            handCards.push(newCard);
            renderCard(newCard, hand, hand === playerHand);
        }
        return newCard;
    }
    return handCards.shift();
}

function checkEndGame() {
    if (playerHp <= 0 || computerHp <= 0) {
        setTimeout(() => {
            alert(playerHp <= 0 ? "Komputer Menang!" : "Pemain Menang!");
            resetGame();
        }, 1000);
    }
}

function resetGame() {
    playerHp = 20;
    computerHp = 20;
    playerHpDisplay.textContent = playerHp;
    computerHpDisplay.textContent = computerHp;
    battleLog.innerHTML = "";
    playerHand.innerHTML = "";
    computerHand.innerHTML = "";
    battlefield.innerHTML = "";
    usedCardsContainer.innerHTML = "";
    playerHandCards = [];
    computerHandCards = [];
    turn = "player"; // Reset giliran
    createDeck();
    shuffleDeck();
}

drawPlayerButton.addEventListener("click", () => {
    if (turn !== "player") return;

    const card = drawCard();
    if (card) {
        playerHandCards.push(card);
        renderCard(card, playerHand, true);
    }
});

createDeck();
shuffleDeck();