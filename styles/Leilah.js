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
const flowerImages = [
    'https://media.discordapp.net/attachments/481247735387914241/1423875728113406115/SPOILER_Screenshot_20250930_005339_TikTok.jpg?ex=68e1e71b&is=68e0959b&hm=3588ee58902eda463af9503f58083cbf3f2b276b3415333a794a5df40ddca428&=&format=webp&width=710&height=777',
    'https://media.discordapp.net/attachments/481247735387914241/1423875728981884969/Screenshot_20250920_122553_TikTok.jpg?ex=68e1e71c&is=68e0959c&hm=de9fb55ec25860efd755ed0e5d5cc3ee71817806dc181c1e2e5b1bafa14d000e&=&format=webp&width=1378&height=778',
    'https://media.discordapp.net/attachments/481247735387914241/1423875729724280912/SPOILER_20250909_122357.jpg?ex=68e1e71c&is=68e0959c&hm=26287c88b306604d086f99cb7d385deaf6d63d730b83636cc5edbe83026615ed&=&format=webp&width=1037&height=778',
    'https://media.discordapp.net/attachments/481247735387914241/1423875730197970984/SPOILER_20250905_232724.jpg?ex=68e1e71c&is=68e0959c&hm=3423bd60d9d1fb3055c1f66cfd0272a46547fdc12ac911e838d9965ca5bb54b8&=&format=webp&width=1010&height=778',
    'https://media.discordapp.net/attachments/481247735387914241/1423875730542170192/6DBEF9E8-F8B1-42CD-880C-95C4B605B22D.jpg?ex=68e1e71c&is=68e0959c&hm=fe95332c3049747846360419572a07ab253f65f8a40fd7c06d9889ceea2cfdba&=&format=webp&width=419&height=778',
    'https://media.discordapp.net/attachments/481247735387914241/1423875730835767449/SPOILER_Screenshot_20250831_155457_TikTok.jpg?ex=68e1e71c&is=68e0959c&hm=35fcb68318e363794e8365bef827bae2697399d9b65fdf2c0c50fe60228c77a9&=&format=webp&width=359&height=778',
    'https://media.discordapp.net/attachments/481247735387914241/1423875731242356776/SPOILER_Screenshot_20250831_155731_TikTok.jpg?ex=68e1e71c&is=68e0959c&hm=dd06c66b9a76b9991bed188f60018d72cf80a3ca8dbda9938102825980a66a99&=&format=webp&width=359&height=778',
    'https://media.discordapp.net/attachments/481247735387914241/1423875731666239600/20250606_234910.jpg?ex=68e1e71c&is=68e0959c&hm=06994432ffde3eb1f283e60fde6b43730c62e8e3026431251d4e51a1a5081ef0&=&format=webp&width=583&height=778',
    'https://media.discordapp.net/attachments/481247735387914241/1423875732333133884/20250909_122402.jpg?ex=68e1e71c&is=68e0959c&hm=338b051017ce010a6e9513ba7f4e1aa636198e9567a975e0eed7cc82e4442765&=&format=webp&width=1037&height=778',
    'https://media.discordapp.net/attachments/481247735387914241/1423875728516186184/Screenshot_20250921_235604_TikTok.jpg?ex=68e1e71c&is=68e0959c&hm=ea05c87234c78a77b9d134b73ab59c92a5a2045532b42859d9fe41e44266a9bc&=&format=webp&width=1469&height=778'
];

function createFlower() {
    if (!flowersContainer) return;
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

const flowerInterval = setInterval(createFlower, 350);

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
    const bloom = document.createElement('div');
    bloom.className = 'bloom';
    const left = Math.random() * 92 + 4; // keep inside edges
    bloom.style.left = left + 'vw';

    const stem = document.createElement('div');
    stem.className = 'stem';

    // create 5 petals around
    for (let i = 0; i < 5; i++) {
        const pet = document.createElement('div');
        pet.className = 'petal';
        const angle = (i / 5) * Math.PI * 2;
        const rx = Math.cos(angle) * 10;
        const ry = Math.sin(angle) * 8;
        pet.style.left = (50 + rx) + '%';
        pet.style.bottom = (8 + ry) + 'px';
        pet.style.transform = `translateX(-50%) rotate(${(i-2)*18}deg)`;
        pet.style.animation = `petalSway ${3 + Math.random()*3}s ease-in-out ${Math.random()*0.6}s infinite`;
        bloom.appendChild(pet);
    }

    const center = document.createElement('div');
    center.className = 'center';

    bloom.appendChild(stem);
    bloom.appendChild(center);
    garden.appendChild(bloom);

    // remove after a while (but leave many to create a garden)
    setTimeout(() => {
        bloom.style.opacity = '0';
        setTimeout(() => bloom.remove(), 1200);
    }, 7000 + Math.random()*8000);
}

setInterval(createBloom, 1200);

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