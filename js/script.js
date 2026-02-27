/*
 * File:    left.js
 * Authors: Marc Keanne Principe & Emre
 * Date:    12/02/26
 * Description: Main game logic for Casino Clicker.
 */

window.addEventListener("load", function() {

    // MODEL
    let score = 0;
    let clickPower = 1;

    let luckyFingersCost  = 100;
    let goldenGlovesCost  = 400;
    let diamondHandsCost  = 2000;
    let autoDealerCost    = 150;
    let vipLoungeCost     = 800;

    let luckyFingersCount  = 0;
    let goldenGlovesCount  = 0;
    let diamondHandsCount  = 0;
    let autoDealerCount    = 0;
    let vipLoungeCount     = 0;

    let autoClickTimer = null;
    let autoClickDelay = 2000;

    let milestones     = [1000, 5000, 10000, 1000000, 20000000];
    let milestoneNames = ["First Jackpot", "Lucky Roll", "High Roller", "Millionaire", "Go Big or Go Home"];
    let milestoneIcons = ["🎰", "🎲", "🃏", "💰", "🏆"];
    let milestoneReached = [false, false, false, false, false];

    let helpVisible  = false;
    let errorTimeout = null;

    // VIEW REFERENCES
    let scoreDisplay      = document.getElementById("score");
    let clickPowerDisplay = document.getElementById("click-power-display");
    let upgradesDisplay   = document.getElementById("upgrades-display");
    let slotMachine       = document.getElementById("cookie-click");
    let upgradeBoxes      = document.querySelectorAll(".upgrade");
    let storeItems        = document.querySelectorAll(".item");
    let errorMessage      = document.getElementById("error-message");
    let congratsBanner    = document.getElementById("congrats-banner");
    let congratsText      = document.getElementById("congrats-text");
    let helpPanel         = document.getElementById("help-panel");
    let helpBtn           = document.getElementById("help-btn");
    let helpClose         = document.getElementById("help-close");

    // VIEW FUNCTIONS
    function formatNumber(n) {
        n = Math.floor(n);
        if (n >= 1000000000) { return (n / 1000000000).toFixed(1) + "B"; }
        if (n >= 1000000)    { return (n / 1000000).toFixed(1) + "M"; }
        if (n >= 1000)       { return (n / 1000).toFixed(1) + "K"; }
        return String(n);
    }

    function updateScore() {
        scoreDisplay.textContent = formatNumber(score);
    }

    function updateStats() {
        let totalUpgrades = luckyFingersCount + goldenGlovesCount + diamondHandsCount
                          + autoDealerCount + vipLoungeCount;
        clickPowerDisplay.textContent = "Click Power: " + clickPower;
        upgradesDisplay.textContent   = "Upgrades Owned: " + totalUpgrades;
    }

    function updateStoreLabel(index) {
        let names  = ["Lucky Fingers", "Golden Gloves", "Diamond Hands", "Auto Dealer", "VIP Lounge"];
        let bonus  = ["+1/click", "+3/click", "+10/click", autoClickDelay + "ms/click", "+5/sec"];
        let costs  = [luckyFingersCost, goldenGlovesCost, diamondHandsCost, autoDealerCost, vipLoungeCost];
        let counts = [luckyFingersCount, goldenGlovesCount, diamondHandsCount, autoDealerCount, vipLoungeCount];
        let owned  = counts[index] > 0 ? " (" + counts[index] + " owned)" : "";
        storeItems[index].textContent = names[index] + owned + " | " + bonus[index] + " | Cost: " + formatNumber(costs[index]);
    }

    function showError(message) {
        errorMessage.textContent = message;
        clearTimeout(errorTimeout);
        errorTimeout = setTimeout(function() {
            errorMessage.textContent = "";
        }, 2000);
    }

    // AUTO-CLICK
    function startAutoClick() {
        if (autoClickTimer !== null) { clearInterval(autoClickTimer); }
        autoClickTimer = setInterval(function() {
            score = score + clickPower;
            updateScore();
            checkMilestones();
        }, autoClickDelay);
    }

    // PASSIVE INCOME
    setInterval(function() {
        if (vipLoungeCount > 0) {
            score = score + (vipLoungeCount * 5);
            updateScore();
            checkMilestones();
        }
    }, 1000);

    // MILESTONES
    function checkMilestones() {
        for (let i = 0; i < milestones.length; i++) {
            if (!milestoneReached[i] && score >= milestones[i]) {
                milestoneReached[i] = true;
                showMilestone(i);
            }
        }
    }

    function showMilestone(index) {
        let box = upgradeBoxes[index];
        box.textContent           = milestoneIcons[index] + " " + milestoneNames[index] + " — " + formatNumber(milestones[index]) + " chips";
        box.style.backgroundColor = "gold";
        box.style.fontWeight      = "bold";
        box.style.color           = "darkred";

        let flashCount = 0;
        let flashInterval = setInterval(function() {
            box.style.backgroundColor = (flashCount % 2 === 0) ? "orange" : "gold";
            flashCount++;
            if (flashCount >= 6) {
                clearInterval(flashInterval);
                box.style.backgroundColor = "gold";
            }
        }, 300);

        congratsText.textContent = milestoneIcons[index] + " " + milestoneNames[index] + " Unlocked!";
        congratsBanner.classList.remove("show");
        void congratsBanner.offsetWidth;
        congratsBanner.classList.add("show");
        setTimeout(function() {
            congratsBanner.classList.remove("show");
        }, 3000);
    }

    // STORE PURCHASES
    function buyUpgrade(index) {
        let cost = [luckyFingersCost, goldenGlovesCost, diamondHandsCost, autoDealerCost, vipLoungeCost][index];

        if (score < cost) {
            showError("Need " + formatNumber(cost) + " chips — you have " + formatNumber(score) + ".");
            return;
        }

        score = score - cost;

        if (index === 0) {
            luckyFingersCount++;
            clickPower       = clickPower + 1;
            luckyFingersCost = Math.floor(luckyFingersCost * 1.5);
        } else if (index === 1) {
            goldenGlovesCount++;
            clickPower      = clickPower + 3;
            goldenGlovesCost = Math.floor(goldenGlovesCost * 1.5);
        } else if (index === 2) {
            diamondHandsCount++;
            clickPower      = clickPower + 10;
            diamondHandsCost = Math.floor(diamondHandsCost * 1.5);
        } else if (index === 3) {
            autoDealerCount++;
            autoDealerCost  = Math.floor(autoDealerCost * 1.5);
            autoClickDelay  = autoDealerCount === 1 ? 2000 : Math.max(100, Math.floor(autoClickDelay * 0.75));
            startAutoClick();
        } else if (index === 4) {
            vipLoungeCount++;
            vipLoungeCost = Math.floor(vipLoungeCost * 1.5);
        }

        updateScore();
        updateStats();
        updateStoreLabel(index);
        checkMilestones();
    }

    for (let i = 0; i < storeItems.length; i++) {
        (function(idx) {
            storeItems[idx].addEventListener("click", function() { buyUpgrade(idx); });
        })(i);
    }

    // MANUAL CLICK
    slotMachine.addEventListener("click", function(event) {
        score = score + clickPower;
        updateScore();
        checkMilestones();

        slotMachine.style.transform = "scale(0.85)";
        setTimeout(function() {
            slotMachine.style.transform = "scale(1.1)";
            setTimeout(function() { slotMachine.style.transform = "scale(1)"; }, 100);
        }, 100);

        let popup = document.createElement("div");
        popup.style.cssText = "position:fixed; left:" + event.clientX + "px; top:" + event.clientY
            + "px; display:flex; align-items:center; gap:5px; pointer-events:none;"
            + "transition:transform 0.8s ease, opacity 0.8s ease; opacity:1; z-index:999;";

        let coinImg = document.createElement("img");
        coinImg.src          = "images/coin.png";
        coinImg.style.cssText = "width:30px; height:30px;";
        coinImg.alt          = "coin";

        let label = document.createElement("span");
        label.textContent  = "+" + clickPower;
        label.style.cssText = "font-size:1.6em; font-weight:bold; color:gold; text-shadow:1px 1px 3px black;";

        popup.appendChild(coinImg);
        popup.appendChild(label);
        document.body.appendChild(popup);

        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                popup.style.transform = "translateY(-80px)";
                popup.style.opacity   = "0";
            });
        });

        setTimeout(function() { popup.remove(); }, 900);
    });

    // HELP PANEL
    function toggleHelp() {
        helpVisible             = !helpVisible;
        helpPanel.style.display = helpVisible ? "block" : "none";
        helpBtn.textContent     = helpVisible ? "✕ Close Help" : "? Help";
    }

    if (helpBtn !== null)   { helpBtn.addEventListener("click", toggleHelp); }
    if (helpClose !== null) { helpClose.addEventListener("click", toggleHelp); }
    helpPanel.style.display = "none";

    // INIT
    for (let i = 0; i < storeItems.length; i++) { updateStoreLabel(i); }
    updateScore();
    updateStats();

    // CHEAT (console only)
    window.cheat = function(amount) {
        score      = score + amount;
        clickPower = clickPower + amount;
        updateScore();
        updateStats();
    };

}); // end load