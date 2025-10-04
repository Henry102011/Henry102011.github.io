// script.js
document.getElementById("yes-button").onclick = function() {
    window.location.href = "yes.html";
};

document.getElementById("no-button").onclick = function() {
    window.location.href = "no.html";
};

// Flower falling animation
const flowersContainer = document.querySelector('.flowers');

function createFlower() {
    const flower = document.createElement('div');
    flower.classList.add('flower');
    flower.style.left = Math.random() * 100 + 'vw';
    flower.style.animationDuration = Math.random() * 3 + 2 + 's';
    flowersContainer.appendChild(flower);

    setTimeout(() => {
        flower.remove();
    }, 5000);
}

setInterval(createFlower, 500);