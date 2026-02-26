/*
Author Names: Marc Keanne Principe & Emre 
Date Created: 12/02/26
Deadline: 27/02/26
Description: A global script.js used on the browser.
*/

let score = 0;
let clickPower = 1; // how many chips you get per click

// Upgrade costs
let leverCost = 50;
let fasterClickCost = 100;
let cardCost = 500;
let rouletteWheelCost = 2000;
let casinoChipCost = 10000;

// How many of each upgrade the player owns
let leverCount = 0;
let fasterClickCount = 0;
let cardCount = 0;
let rouletteWheelCount = 0;
let casinoChipCount = 0;

// Milestone thresholds and their messages
let milestones = [1000, 5000, 10000, 1000000, 20000000];
let milestoneNames = ["First Jackpot", "Lucky Roll", "High Roller", "Millionaire", "Casino Royale"];
let milestoneReached = [false, false, false, false, false];

// Get elements from the HTML
let slotMachine = document.getElementById("cookie-click");
let scoreDisplay = document.getElementById("score");
let upgradeBoxes = document.querySelectorAll(".upgrade");
let storeItems = document.querySelectorAll(".item");

// Create a shared error message element and add it to the page
let errorMessage = document.createElement("p");
errorMessage.id = "error-message";
errorMessage.style.color = "red";
errorMessage.style.fontWeight = "bold";
errorMessage.style.minHeight = "1.5em"; // reserve space so layout doesn't jump
document.getElementById("col3").prepend(errorMessage); // place it at the top of the store

let errorTimeout = null;

// Show an error message for 2 seconds, then clear it
function showError(message) {
    errorMessage.textContent = message;
    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(function() {
        errorMessage.textContent = "";
    }, 2000);
}

// Update the score display
function updateScore() {
    scoreDisplay.textContent = Math.floor(score);
}

// --- STORE ITEM CLICK HANDLERS ---

// Lever - auto clicks 0.5 chips per second, costs more each time you buy
storeItems[0].addEventListener("click", function() {
    if (score >= leverCost) {
        score = score - leverCost;
        leverCount = leverCount + 1;
        leverCost = Math.floor(leverCost * 1.5); // price goes up each purchase
        storeItems[0].textContent = "Lever (" + leverCount + " owned) - Cost: " + leverCost;
        updateScore();
    } else {
        showError("Not enough chips! You need " + leverCost + " chips.");
    }
});

// Faster Click - increases your click power by 1
storeItems[1].addEventListener("click", function() {
    if (score >= fasterClickCost) {
        score = score - fasterClickCost;
        fasterClickCount = fasterClickCount + 1;
        clickPower = clickPower + 1;
        fasterClickCost = Math.floor(fasterClickCost * 1.5);
        storeItems[1].textContent = "Faster Click (" + fasterClickCount + " owned) - Cost: " + fasterClickCost;
        updateScore();
    } else {
        showError("Not enough chips! You need " + fasterClickCost + " chips.");
    }
});

// Card - auto clicks 3 chips per second
storeItems[2].addEventListener("click", function() {
    if (score >= cardCost) {
        score = score - cardCost;
        cardCount = cardCount + 1;
        cardCost = Math.floor(cardCost * 1.5);
        storeItems[2].textContent = "Card (" + cardCount + " owned) - Cost: " + cardCost;
        updateScore();
    } else {
        showError("Not enough chips! You need " + cardCost + " chips.");
    }
});

// Roulette Wheel - auto clicks 10 chips per second
storeItems[3].addEventListener("click", function() {
    if (score >= rouletteWheelCost) {
        score = score - rouletteWheelCost;
        rouletteWheelCount = rouletteWheelCount + 1;
        rouletteWheelCost = Math.floor(rouletteWheelCost * 1.5);
        storeItems[3].textContent = "Roulette Wheel (" + rouletteWheelCount + " owned) - Cost: " + rouletteWheelCost;
        updateScore();
    } else {
        showError("Not enough chips! You need " + rouletteWheelCost + " chips.");
    }
});

// Casino Chip - auto clicks 50 chips per second
storeItems[4].addEventListener("click", function() {
    if (score >= casinoChipCost) {
        score = score - casinoChipCost;
        casinoChipCount = casinoChipCount + 1;
        casinoChipCost = Math.floor(casinoChipCost * 1.5);
        storeItems[4].textContent = "Casino Chip (" + casinoChipCount + " owned) - Cost: " + casinoChipCost;
        updateScore();
    } else {
        showError("Not enough chips! You need " + casinoChipCost + " chips.");
    }
});

// --- MANUAL CLICK ---
slotMachine.style.transition = "transform 0.1s ease";

slotMachine.addEventListener("click", function(event) {
    score = score + clickPower;
    updateScore();
    checkMilestones();

    // Click animation - shrink then bounce back
    slotMachine.style.transform = "scale(0.85)";
    setTimeout(function() {
        slotMachine.style.transform = "scale(1.1)";
        setTimeout(function() {
            slotMachine.style.transform = "scale(1)";
        }, 100);
    }, 100);

    // Floating coin + +N text at click position
    let popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.left = event.clientX + "px";
    popup.style.top = event.clientY + "px";
    popup.style.display = "flex";
    popup.style.alignItems = "center";
    popup.style.gap = "5px";
    popup.style.pointerEvents = "none";
    popup.style.transition = "transform 0.8s ease, opacity 0.8s ease";
    popup.style.opacity = "1";
    popup.style.zIndex = "999";

    let coinImg = document.createElement("img");
    coinImg.src = "images/coin.png";
    coinImg.style.width = "30px";
    coinImg.style.height = "30px";

    let label = document.createElement("span");
    label.textContent = "+" + clickPower;
    label.style.fontSize = "1.6em";
    label.style.fontWeight = "bold";
    label.style.color = "gold";
    label.style.textShadow = "1px 1px 3px black";

    popup.appendChild(coinImg);
    popup.appendChild(label);
    document.body.appendChild(popup);

    // Trigger the float-up animation
    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            popup.style.transform = "translateY(-80px)";
            popup.style.opacity = "0";
        });
    });

    // Remove from DOM after animation
    setTimeout(function() {
        popup.remove();
    }, 900);
});

// --- AUTO CLICKER ---
// Runs every second and adds chips based on what upgrades you own
setInterval(function() {
    let chipsThisSecond = 0;
    chipsThisSecond = chipsThisSecond + (leverCount * 0.5);
    chipsThisSecond = chipsThisSecond + (cardCount * 3);
    chipsThisSecond = chipsThisSecond + (rouletteWheelCount * 10);
    chipsThisSecond = chipsThisSecond + (casinoChipCount * 50);

    score = score + chipsThisSecond;
    updateScore();
    checkMilestones();
}, 1000);

// --- MILESTONES ---
function checkMilestones() {
    for (let i = 0; i < milestones.length; i++) {
        if (score >= milestones[i] && milestoneReached[i] == false) {
            milestoneReached[i] = true;
            showMilestone(i);
        }
    }
}

function showMilestone(index) {
    let box = upgradeBoxes[index];
    box.textContent = "🏆 " + milestoneNames[index] + " - Reached " + milestones[index].toLocaleString() + " chips!";
    box.style.backgroundColor = "gold";
    box.style.fontWeight = "bold";
    box.style.color = "darkred";

    // Flash the box a few times
    let flashCount = 0;
    let flashInterval = setInterval(function() {
        if (flashCount % 2 == 0) {
            box.style.backgroundColor = "gold";
        } else {
            box.style.backgroundColor = "orange";
        }
        flashCount = flashCount + 1;

        if (flashCount >= 6) {
            clearInterval(flashInterval);
            box.style.backgroundColor = "gold";
        }
    }, 500);

    // --- CONGRATULATIONS POPUP ---
    // Inject bounce keyframe once
    if (!document.getElementById("congrats-style")) {
        let style = document.createElement("style");
        style.id = "congrats-style";
        style.textContent =
            "@keyframes congrats-bounce {" +
            "  0%   { transform: scale(0.4); opacity: 0; }" +
            "  70%  { transform: scale(1.08); opacity: 1; }" +
            "  100% { transform: scale(1);    opacity: 1; }" +
            "}";
        document.head.appendChild(style);
    }

    // Create full-screen overlay
    let overlay = document.createElement("div");
    overlay.style.cssText =
        "position: fixed;" +
        "top: 0; left: 0; width: 100%; height: 100%;" +
        "display: flex; align-items: center; justify-content: center;" +
        "background: rgba(0, 0, 0, 0.6);" +
        "z-index: 9999;" +
        "opacity: 1;" +
        "transition: opacity 0.8s ease;";

    // Create the card
    let card = document.createElement("div");
    card.style.cssText =
        "background: linear-gradient(135deg, #7b0000, #c0000c, #7b0000);" +
        "border: 5px solid gold;" +
        "border-radius: 20px;" +
        "padding: 40px 60px;" +
        "text-align: center;" +
        "box-shadow: 0 0 60px gold, 0 0 20px rgba(255, 215, 0, 0.6);" +
        "animation: congrats-bounce 0.4s ease;";

    // Trophy emoji
    let emoji = document.createElement("div");
    emoji.textContent = "🏆";
    emoji.style.cssText = "font-size: 4em; margin-bottom: 10px;";

    // "CONGRATULATIONS!" heading
    let heading = document.createElement("div");
    heading.textContent = "CONGRATULATIONS!";
    heading.style.cssText =
        "font-size: 2.5em;" +
        "font-weight: bold;" +
        "color: gold;" +
        "font-family: Impact, 'Arial Narrow Bold', sans-serif;" +
        "text-shadow: 2px 2px 6px black;" +
        "letter-spacing: 3px;";

    // Milestone name
    let milestoneName = document.createElement("div");
    milestoneName.textContent = milestoneNames[index];
    milestoneName.style.cssText =
        "font-size: 1.8em;" +
        "color: white;" +
        "font-weight: bold;" +
        "margin-top: 10px;" +
        "text-shadow: 1px 1px 4px black;";

    // Sub-text with chip count
    let sub = document.createElement("div");
    sub.innerHTML = "You reached <strong>" + milestones[index].toLocaleString() + "</strong> chips!";
    sub.style.cssText =
        "font-size: 1.1em;" +
        "color: #ffe08a;" +
        "margin-top: 10px;";

    card.appendChild(emoji);
    card.appendChild(heading);
    card.appendChild(milestoneName);
    card.appendChild(sub);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Fade out after 3.5 seconds, then remove from DOM
    setTimeout(function() {
        overlay.style.opacity = "0";
        setTimeout(function() {
            overlay.remove();
        }, 800);
    }, 3500);
}

// Set initial store labels with costs
storeItems[0].textContent = "Lever - Cost: " + leverCost + " chips";
storeItems[1].textContent = "Faster Click - Cost: " + fasterClickCost + " chips";
storeItems[2].textContent = "Card - Cost: " + cardCost + " chips";
storeItems[3].textContent = "Roulette Wheel - Cost: " + rouletteWheelCost + " chips";
storeItems[4].textContent = "Casino Chip - Cost: " + casinoChipCost + " chips";
