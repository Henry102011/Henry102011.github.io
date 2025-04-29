// Bearkat paw prints flying up from bottom animation
document.addEventListener('DOMContentLoaded', function() {
    // Function to create a paw print that flies up from the bottom
    function createFlyingPawPrint() {
        const pawPrint = document.createElement('div');
        pawPrint.className = 'flying-paw-print';
        pawPrint.innerHTML = '🐾';
        
        // Random horizontal position
        const randomX = Math.random() * window.innerWidth;
        pawPrint.style.left = randomX + 'px';
        
        // Start from bottom
        pawPrint.style.bottom = '-50px';
        
        // Random rotation
        const rotation = Math.random() * 360;
        pawPrint.style.transform = `rotate(${rotation}deg)`;
        
        // Random size variation
        const size = 20 + Math.random() * 20;
        pawPrint.style.fontSize = `${size}px`;
        
        // Add to document
        document.body.appendChild(pawPrint);
        
        // Remove after animation completes
        setTimeout(() => {
            pawPrint.remove();
        }, 6000); // Animation duration + buffer
    }
    
    // Create paw prints periodically
    setInterval(createFlyingPawPrint, 800);
    
    // Create a few paw prints immediately
    for (let i = 0; i < 5; i++) {
        setTimeout(createFlyingPawPrint, i * 300);
    }
    
    // SHSU orange color effect on click
    document.addEventListener('click', function(e) {
        const orangeFlash = document.createElement('div');
        orangeFlash.className = 'orange-flash';
        orangeFlash.style.left = e.clientX + 'px';
        orangeFlash.style.top = e.clientY + 'px';
        document.body.appendChild(orangeFlash);
        
        // Create extra paw prints on click
        for (let i = 0; i < 3; i++) {
            setTimeout(createFlyingPawPrint, i * 100);
        }
        
        setTimeout(() => {
            orangeFlash.remove();
        }, 500);
    });
});

