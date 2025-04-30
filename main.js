onload = () => {
    const c = setTimeout(() => {
      document.body.classList.remove("not-loaded");
      clearTimeout(c);
    }, 1000);
  };
  document.addEventListener('DOMContentLoaded', function() {
    const petalContainer = document.getElementById('fallingPetals');
    const petalCount = 20; // Number of petals
    
    // Create petals
    for (let i = 0; i < petalCount; i++) {
      createPetal(petalContainer);
    }
    
    // Continue creating petals at intervals
    setInterval(() => {
      if (document.querySelectorAll('.petal').length < 30) { // Limit max petals
        createPetal(petalContainer);
      }
    }, 1000);
  });
  
  function createPetal(container) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // Randomly add blue petals
    if (Math.random() > 0.5) {
      petal.classList.add('petal--blue');
    }
    
    // Random starting position
    const startPositionX = Math.random() * 100;
    petal.style.left = `${startPositionX}vw`;
    
    // Random size
    const size = 5 + Math.random() * 6;
    petal.style.width = `${size}vmin`;
    petal.style.height = `${size * 1.375}vmin`;
    
    // Random direction
    const direction = Math.random() > 0.5 ? 1 : -1;
    petal.style.setProperty('--direction', direction);
    
    // Random animation duration
    const duration = 8 + Math.random() * 7;
    petal.style.animationDuration = `${duration}s`;
    
    // Random delay
    const delay = Math.random() * 5;
    petal.style.animationDelay = `${delay}s`;
    
    // Add to container
    container.appendChild(petal);
    
    // Remove petal after animation completes
    setTimeout(() => {
      if (petal.parentNode === container) {
        container.removeChild(petal);
      }
    }, (duration + delay) * 1000);
  }