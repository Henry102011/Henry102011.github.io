document.addEventListener('DOMContentLoaded', function() {
  // Remove the 'not-loaded' class to start animations
  document.body.classList.remove('not-loaded');
  
  // Initialize fireworks
  initFireworks();
  
  // Initialize falling petals
  initFallingPetals();
});

// Fireworks animation
function initFireworks() {
  const canvas = document.getElementById('fireworks');
  const ctx = canvas.getContext('2d');
  
  // Set canvas to full window size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Firework particles
  let particles = [];
  
  class Particle {
    constructor(x, y, color, velocity, isFirework = false) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.velocity = velocity;
      this.alpha = 1;
      this.isFirework = isFirework;
      this.gravity = 0.05;
      this.friction = 0.99;
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.isFirework ? 3 : 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    update() {
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;
      this.velocity.y += this.gravity;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= 0.01;
    }
  }
  
  // Create a firework
  function createFirework() {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    const velocity = {
      x: Math.random() * 6 - 3,
      y: Math.random() * -15 - 10
    };
    
    particles.push(new Particle(x, y, color, velocity, true));
  }
  
  // Create explosion particles
  function createExplosion(x, y, color) {
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      const velocity = {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8
      };
      particles.push(new Particle(x, y, color, velocity));
    }
  }
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Random chance to create a new firework
    if (Math.random() < 0.05) {
      createFirework();
    }
    
    // Update and draw particles
    particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        particles.splice(index, 1);
        return;
      }
      
      particle.update();
      particle.draw();
      
      // If it's a firework and it's reached its apex, create explosion
      if (particle.isFirework && particle.velocity.y >= 0) {
        particles.splice(index, 1);
        createExplosion(particle.x, particle.y, particle.color);
      }
    });
  }
  
  animate();
}

// Falling petals animation
function initFallingPetals() {
  const container = document.getElementById('fallingPetals');
  const colors = ['#ffcad4', '#ffc0cb', '#ff9eb5', '#ff85a1', '#ff7096'];
  const totalPetals = 30;
  
  for (let i = 0; i < totalPetals; i++) {
    createPetal(container, colors);
  }
  
  // Create new petals periodically
  setInterval(() => {
    if (container.children.length < 50) {
      createPetal(container, colors);
    }
  }, 1000);
}

function createPetal(container, colors) {
  const petal = document.createElement('div');
  const size = Math.random() * 15 + 5; // Random size between 5-20px
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  petal.className = 'petal';
  petal.style.width = `${size}px`;
  petal.style.height = `${size}px`;
  petal.style.background = color;
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.opacity = Math.random() * 0.7 + 0.3;
  petal.style.animationDuration = `${Math.random() * 10 + 5}s`;
  petal.style.animationDelay = `${Math.random() * 5}s`;
  
  // Remove petal after animation completes
  petal.addEventListener('animationend', () => {
    petal.remove();
  });
  
  container.appendChild(petal);
}
