// script.js
document.getElementById("yes-button").onclick = function() {
    createHeartBurst();
    setTimeout(() => {
        window.location.href = "yes.html";
    }, 1200);
};

document.getElementById("no-button").onclick = function() {
    window.location.href = "no.html";
};

// Flower falling animation
const flowersContainer = document.querySelector('.flowers');
const flowerImages = [
    'images/flower.png',
    'images/1.png',
    'images/2.png',
    'images/3.jpeg',
    'images/Blue And Yellow Digital Marketing Agency Flyer.png',
    'images/Phonix 2.png',
    'images/mom 1.png',
    'images/mom 2.png',
    'images/mom 3.png',
    'images/mom 4.png',
    'images/mom 5.png',
    'images/mom 6.png',
    'images/mom 7.png',
    'images/mom 8.png',
];

function createFlower() {
    const flower = document.createElement('div');
    flower.classList.add('flower');
    const img = flowerImages[Math.floor(Math.random() * flowerImages.length)];
    flower.style.backgroundImage = `url('${img}')`;
    flower.style.left = Math.random() * 98 + 'vw';
    flower.style.animationDuration = (Math.random() * 2.5 + 3.5).toFixed(2) + 's';
    flower.style.top = '-60px';
    flower.style.transform = `rotate(${Math.random()*360}deg)`;
    flowersContainer.appendChild(flower);

    setTimeout(() => {
        flower.remove();
    }, 6000);
}

setInterval(createFlower, 350);

// Heart animation
function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = (x - 18) + 'px';
    heart.style.top = (y - 18) + 'px';
    heart.style.animationDuration = (Math.random() * 1 + 1.8).toFixed(2) + 's';
    heart.innerHTML = `<svg viewBox="0 0 32 29.6"><path d="M23.6,0c-2.7,0-5.1,1.3-6.6,3.3C15.5,1.3,13.1,0,10.4,0C4.7,0,0,4.7,0,10.4c0,11.1,16,19.2,16,19.2s16-8.1,16-19.2C32,4.7,27.3,0,23.6,0z" fill="#d72660"/></svg>`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2000);
}

function createHeartBurst() {
    const rect = document.querySelector('.container').getBoundingClientRect();
    for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16;
        const x = rect.left + rect.width / 2 + Math.cos(angle) * 80 + window.scrollX;
        const y = rect.top + rect.height / 2 + Math.sin(angle) * 40 + window.scrollY;
        setTimeout(() => createHeart(x, y), i * 40);
    }
}

// Optional: floating hearts on click anywhere
document.body.addEventListener('click', function(e) {
    if (!e.target.closest('button')) {
        createHeart(e.clientX, e.clientY);
    }
});