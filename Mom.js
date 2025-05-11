document.addEventListener('DOMContentLoaded', function() {
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.photo-card, .message, .reasons, h2');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if(elementPosition < screenPosition) {
                element.classList.add('animate-in');
            }
        });
    };
    
    // Set initial styles with CSS classes
    const style = document.createElement('style');
    style.innerHTML = `
        .photo-card, .message, .reasons, h2 {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .falling-heart {
            position: fixed;
            top: -10vh;
            font-size: 1.5rem;
            animation: fall linear forwards;
            z-index: -1;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
        }
        
        @keyframes fall {
            to {
                transform: translateY(110vh) rotate(360deg);
            }
        }
        
        @keyframes float-around {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(10px, 10px) rotate(90deg); }
            50% { transform: translate(0, 20px) rotate(180deg); }
            75% { transform: translate(-10px, 10px) rotate(270deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        .flower {
            position: fixed;
            font-size: 2rem;
            opacity: 0.6;
            z-index: -1;
            animation: float-around 15s linear infinite;
        }
    `;
    document.head.appendChild(style);
    
    // Run on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Add falling hearts animation
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        
        // Randomly choose between different heart colors
        const hearts = ['❤️', '💖', '💕', '💗', '💓', '💘'];
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        
        // Random position and animation duration
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 2 + 's';
        heart.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
        heart.style.opacity = Math.random() * 0.4 + 0.6;
        
        document.body.appendChild(heart);
        
        // Remove after animation completes
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }
    
    // Create hearts at intervals
    setInterval(createHeart, 300);
    
    // Add hover effects to photo cards
    const photoCards = document.querySelectorAll('.photo-card');
    photoCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            setTimeout(() => {
                card.style.transform = '';
            }, 300);
        });
    });
    
    // Add a surprise confetti effect when clicking on the heart in the header
    const headerHeart = document.querySelector('header .heart');
    if (headerHeart) {
        headerHeart.addEventListener('click', function() {
            // Create and append confetti elements
            for (let i = 0; i < 50; i++) {
                createConfetti();
            }
            
            // Play a sound if desired
            // const audio = new Audio('path/to/sound.mp3');
            // audio.play();
        });
    }
    
    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.top = '50%';
        confetti.style.left = '50%';
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.zIndex = '1000';
        
        // Random initial velocity
        const angle = Math.random() * Math.PI * 2;
        const velocity = 10 + Math.random() * 20;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(confetti);
        
        let posX = 0;
        let posY = 0;
        let gravity = 0.5;
        let opacity = 1;
        let rotation = 0;
        
        function updateConfetti() {
            posX += vx;
            posY += vy;
            vy += gravity;
            opacity -= 0.01;
            rotation += Math.random() * 10;
            
            confetti.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotation}deg)`;
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(updateConfetti);
            } else {
                confetti.remove();
            }
        }
        
        requestAnimationFrame(updateConfetti);
    }
    
    function getRandomColor() {
        const colors = [
            '#ff6b8b', '#ffb6c1', '#ff85a2', '#ff99cc', 
            '#ff77aa', '#ff5588', '#ff3377', '#ff0066'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Add a subtle parallax effect
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const flowers = document.querySelectorAll('.flower');
        
        flowers.forEach((flower, index) => {
            const speed = 0.05 + (index * 0.01);
            flower.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
});