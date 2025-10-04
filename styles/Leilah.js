// script.js
const yesBtn = document.getElementById("yes-button");
const noBtn = document.getElementById("no-button");
if (yesBtn) {
    yesBtn.addEventListener('click', () => {
        createHeartBurst();
        setTimeout(() => {
            window.location.href = "yes.html";
        }, 1200);
    });
}
if (noBtn) {
    noBtn.addEventListener('click', () => {
        window.location.href = "no.html";
    });
}

// Flower falling animation
const flowersContainer = document.querySelector('.flowers');

function createFlower(size = 44) {
    if (!flowersContainer) return;
    const pet = document.createElement('div');
    pet.classList.add('falling-petal');
    // size in px for desktop, smaller on mobile logic handled by caller
    pet.style.width = (size * 0.9) + 'px';
    pet.style.height = (size * 1.1) + 'px';
    pet.style.left = Math.random() * 98 + 'vw';
    pet.style.top = '-80px';
    const dir = Math.random() < 0.5 ? -1 : 1;
    pet.style.setProperty('--direction', dir);
    const dur = (Math.random() * 3 + 5).toFixed(2);
    pet.style.animationDuration = dur + 's';
    pet.style.transform = `rotate(${(Math.random()*360).toFixed(1)}deg)`;
    flowersContainer.appendChild(pet);

    setTimeout(() => {
        pet.remove();
    }, parseFloat(dur) * 1000 + 600);
}

let flowerInterval = null;
let bloomInterval = null;
let isMobile = window.matchMedia('(max-width: 600px)').matches;

function startIntervals() {
    // clear existing intervals
    if (flowerInterval) clearInterval(flowerInterval);
    if (bloomInterval) clearInterval(bloomInterval);

    if (isMobile) {
        flowerInterval = setInterval(() => createFlower(30), 600);
        bloomInterval = setInterval(createBloom, 1800);
    } else {
        flowerInterval = setInterval(() => createFlower(44), 350);
        bloomInterval = setInterval(createBloom, 1200);
    }
}

startIntervals();

// Restart intervals when viewport changes (responsive)
window.addEventListener('resize', () => {
    const mobileNow = window.matchMedia('(max-width: 600px)').matches;
    if (mobileNow !== isMobile) {
        isMobile = mobileNow;
        startIntervals();
    }
});

// add subtle animated bg and floating name element
const animatedBg = document.createElement('div');
animatedBg.className = 'animated-bg';
document.body.appendChild(animatedBg);

const nameEl = document.createElement('div');
nameEl.className = 'floating-name';
nameEl.textContent = 'Leilah';
document.body.appendChild(nameEl);

// Startup charm: a few flowers and hearts
setTimeout(() => {
    for (let i = 0; i < 6; i++) {
        setTimeout(createFlower, i * 240);
        setTimeout(() => createHeart(window.innerWidth/2 + (i-3)*20, window.innerHeight/2 - 30), i*200 + 100);
    }
}, 700);

// Garden blooms
const garden = document.querySelector('.garden');
function createBloom() {
    if (!garden) return;
    const flower = document.createElement('div');
    flower.className = 'flower flower--' + (Math.floor(Math.random()*3)+1);
    const left = Math.random() * 92 + 4;
    flower.style.left = left + 'vw';
    // small vertical offset per variant to mimic original layout
    const variantIndex = parseInt(flower.className.replace(/[^0-9]/g,''),10) || 1;
    const bottomOffset = variantIndex === 1 ? '10vmin' : (variantIndex === 2 ? '8vmin' : '12vmin');
    flower.style.bottom = bottomOffset;

    // leafs wrapper
    const leafs = document.createElement('div');
    leafs.className = 'flower__leafs flower__leafs--' + (Math.floor(Math.random()*3)+1);
    // add 4 leaf elements
    for (let i=1;i<=4;i++){
        const lf = document.createElement('div');
        lf.className = 'flower__leaf flower__leaf--' + i;
        leafs.appendChild(lf);
    }
    // white circle and some lights
    const white = document.createElement('div'); white.className='flower__white-circle'; leafs.appendChild(white);
    for (let i=0;i<6;i++){ const l=document.createElement('div'); l.className='flower__light flower__light--'+(i+1); leafs.appendChild(l); }

    // stem/line
    const line = document.createElement('div'); line.className='flower__line';
    for (let i=1;i<=6;i++){ const ll=document.createElement('div'); ll.className='flower__line__leaf flower__line__leaf--'+i; line.appendChild(ll); }

    flower.appendChild(leafs);
    flower.appendChild(line);
    garden.appendChild(flower);

    // set per-flower animation timing so stem, leafs and lights animate in sync
    const bloomDelay = (Math.random() * 0.9 + 0.2).toFixed(2) + 's'; // small random delay
    const bloomDur = (Math.random() * 1.6 + 1.6).toFixed(2) + 's'; // 1.6s - 3.2s
    const stemDur = (parseFloat(bloomDur) * (Math.random() * 0.5 + 1.0)).toFixed(2) + 's';
    const lightDur = (Math.random() * 2 + 3).toFixed(2) + 's';
    flower.style.setProperty('--bloom-delay', bloomDelay);
    flower.style.setProperty('--bloom-duration', bloomDur);
    flower.style.setProperty('--stem-duration', stemDur);
    flower.style.setProperty('--light-duration', lightDur);

    // auto-fade/remove to avoid infinite DOM growth; keep longer so moving animations finish
    setTimeout(()=>{ flower.style.opacity='0'; setTimeout(()=>flower.remove(),1200); }, 25000 + Math.random()*10000);
}


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