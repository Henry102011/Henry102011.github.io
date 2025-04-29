// Bearkat paw print cursor effect for SHSU-themed website
document.addEventListener('DOMContentLoaded', function() {
    // Create a container for the mascot that follows the cursor
    const mascotContainer = document.createElement('div');
    mascotContainer.className = 'mascot-container';
    document.body.appendChild(mascotContainer);
    
    // Create the Bearkat mascot element
    const mascot = document.createElement('div');
    mascot.className = 'bearkat-mascot';
    mascot.innerHTML = '<img src="../images/bearkat-head.png" alt="Bearkat Mascot">';
    mascotContainer.appendChild(mascot);
    
    // Track mouse position with some lag for smooth following
    let mouseX = 0;
    let mouseY = 0;
    let mascotX = 0;
    let mascotY = 0;
    
    // Update mouse position on mouse move
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create paw prints where the mouse moves
        createPawPrint(e.clientX, e.clientY);
    });
    
    // Create paw print at mouse position
    function createPawPrint(x, y) {
        // Only create a paw print occasionally (1 in 5 mouse movements)
        if (Math.random() > 0.8) {
            const pawPrint = document.createElement('div');
            pawPrint.className = 'paw-print';
            
            // Randomly choose between different paw orientations
            const rotation = Math.random() * 360;
            pawPrint.innerHTML = '🐾';
            pawPrint.style.left = x + 'px';
            pawPrint.style.top = y + 'px';
            pawPrint.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            
            document.body.appendChild(pawPrint);
            
            // Remove paw print after animation completes
            setTimeout(() => {
                pawPrint.remove();
            }, 1000);
        }
    }
    
    // Animation loop for smooth mascot following
    function animateMascot() {
        // Calculate distance between mascot and mouse
        const dx = mouseX - mascotX;
        const dy = mouseY - mascotY;
        
        // Move mascot toward mouse with easing
        mascotX += dx * 0.1;
        mascotY += dy * 0.1;
        
        // Update mascot position
        mascotContainer.style.left = mascotX + 'px';
        mascotContainer.style.top = mascotY + 'px';
        
        // Continue animation
        requestAnimationFrame(animateMascot);
    }
    
    // Start animation
    animateMascot();
    
    // SHSU orange color effect on click
    document.addEventListener('click', function(e) {
        const orangeFlash = document.createElement('div');
        orangeFlash.className = 'orange-flash';
        orangeFlash.style.left = e.clientX + 'px';
        orangeFlash.style.top = e.clientY + 'px';
        document.body.appendChild(orangeFlash);
        
        setTimeout(() => {
            orangeFlash.remove();
        }, 500);
    });
});