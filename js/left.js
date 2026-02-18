const cookie = document.getElementById('cookie-click');
let count = 0;
const scoreDisplay = document.getElementById('score');

function saveScore() {
    let myData = {
        score: count
    };
    localStorage.setItem('cookieScore', JSON.stringify(myData));
}

function loadScore() {
    let saved = localStorage.getItem('cookieScore');

    if (saved != null) {
        let data = JSON.parse(saved);
        count = data.score;
        scoreDisplay.textContent = count;
    }
}

function downloadScore() {
    let myData = {
        score: count
    };

    let jsonString = JSON.stringify(myData);

    let blob = new Blob([jsonString], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'cookie_score.json';
    a.click();
}

cookie.addEventListener('click', (e) => {
    count++;
    scoreDisplay.textContent = count;
    saveScore();

    for (let i = 0; i < 1; i++) {
        let img = document.createElement('img');
        img.src = 'images/coin.png';
        img.style.cssText = `
            position: fixed;
            width: 30px;
            left: ${e.clientX + (Math.random() - 0.5) * 60}px;
            top: ${e.clientY}px;
            pointer-events: none;
            transition: all 1s ease-out;
            opacity: 1;
            z-index: 999;
        `;
        document.body.appendChild(img);

        requestAnimationFrame(() => {
            img.style.top = (e.clientY - 80 - Math.random() * 60) + 'px';
            img.style.opacity = '0';
        });

        setTimeout(() => img.remove(), 1000);

        let plus = document.createElement('div');
        plus.textContent = '+1';
        plus.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY - 10}px;
            font-size: 18px;
            font-weight: bold;
            color: red;
            pointer-events: none;
            user-select: none;
            transition: all 1s ease-out;
            opacity: 1;
            z-index: 1000;
        `;
        document.body.appendChild(plus);

        requestAnimationFrame(() => {
            plus.style.top = (e.clientY - 80) + 'px';
            plus.style.opacity = '0';
        });

        setTimeout(() => plus.remove(), 1000);
    }
});

loadScore();