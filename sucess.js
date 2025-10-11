function Star(id, x, y){
	this.id = id;
	this.x = x;
	this.y = y;
	this.r = Math.floor(Math.random()*2)+1;
	var alpha = (Math.floor(Math.random()*10)+1)/10/2;
	this.color = "rgba(255,255,255,"+alpha+")";
}

Star.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.shadowBlur = this.r * 2;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.fill();
}

Star.prototype.move = function() {
	this.y -= .15 + params.backgroundSpeed/100;
	if (this.y <= -10) this.y = HEIGHT + 10;
	this.draw();
}


function Dot(id, x, y, r) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.r = Math.floor(Math.random()*5)+1;
	this.maxLinks = 2;
	this.speed = .5;
	this.a = .5;
	this.aReduction = .005;
	this.color = "rgba(255,255,255,"+this.a+")";
	this.linkColor = "rgba(255,255,255,"+this.a/4+")";

	this.dir = Math.floor(Math.random()*140)+200;
}

Dot.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.shadowBlur = this.r * 2;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.fill();
}

Dot.prototype.link = function() {
	if (this.id == 0) return;
	var previousDot1 = getPreviousDot(this.id, 1);
	var previousDot2 = getPreviousDot(this.id, 2);
	var previousDot3 = getPreviousDot(this.id, 3);
	if (!previousDot1) return;
	ctx.strokeStyle = this.linkColor;
	ctx.moveTo(previousDot1.x, previousDot1.y);
	ctx.beginPath();
	ctx.lineTo(this.x, this.y);
	if (previousDot2 != false) ctx.lineTo(previousDot2.x, previousDot2.y);
	if (previousDot3 != false) ctx.lineTo(previousDot3.x, previousDot3.y);
	ctx.stroke();
	ctx.closePath();
}

function getPreviousDot(id, stepback) {
	if (id == 0 || id - stepback < 0) return false;
	if (typeof dots[id - stepback] != "undefined") return dots[id - stepback];
	else return false;//getPreviousDot(id - stepback);
}

Dot.prototype.move = function() {
	this.a -= this.aReduction;
	if (this.a <= 0) {
		this.die();
		return
	}
	this.color = "rgba(255,255,255,"+this.a+")";
	this.linkColor = "rgba(255,255,255,"+this.a/4+")";
	this.x = this.x + Math.cos(degToRad(this.dir))*(this.speed+params.dotsSpeed/100),
	this.y = this.y + Math.sin(degToRad(this.dir))*(this.speed+params.dotsSpeed/100);

	this.draw();
	this.link();
}

Dot.prototype.die = function() {
    dots[this.id] = null;
    delete dots[this.id];
}


var canvas  = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	WIDTH,
	HEIGHT,
	mouseMoving = false,
	mouseMoveChecker,
	mouseX,
	mouseY,
	stars = [],
	initStarsPopulation = 80,
	dots = [],
	dotsMinDist = 2,
	params = {
		maxDistFromCursor: 50,
		dotsSpeed: 0,
		backgroundSpeed: 0
	};

var gui;
gui = new dat.GUI();
gui.add(params, 'maxDistFromCursor').min(0).max(100).step(10).name('Size');
gui.add(params, 'dotsSpeed').min(0).max(100).step(.5).name('Speed');
gui.add(params, 'backgroundSpeed').min(0).max(150).step(1).name('Sky speed');
gui.open();

setCanvasSize();
init();

function setCanvasSize() {
	WIDTH = document.documentElement.clientWidth,
    HEIGHT = document.documentElement.clientHeight;                      

	canvas.setAttribute("width", WIDTH);
	canvas.setAttribute("height", HEIGHT);
}

function init() {
	ctx.strokeStyle = "white";
	ctx.shadowColor = "white";
	for (var i = 0; i < initStarsPopulation; i++) {
		stars[i] = new Star(i, Math.floor(Math.random()*WIDTH), Math.floor(Math.random()*HEIGHT));
		//stars[i].draw();
	}
	ctx.shadowBlur = 0;
	animate();
}

function animate() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for (var i in stars) {
    	stars[i].move();
    }
    for (var i in dots) {
    	dots[i].move();
    }
    drawIfMouseMoving();
    requestAnimationFrame(animate);
}

window.onmousemove = function(e){
	mouseMoving = true;
	mouseX = e.clientX;
	mouseY = e.clientY;
	clearInterval(mouseMoveChecker);
	mouseMoveChecker = setTimeout(function() {
		mouseMoving = false;
	}, 100);
}


function drawIfMouseMoving(){
	if (!mouseMoving) return;

	if (dots.length == 0) {
		dots[0] = new Dot(0, mouseX, mouseY);
		dots[0].draw();
		return;
	}

	var previousDot = getPreviousDot(dots.length, 1);
	var prevX = previousDot.x; 
	var prevY = previousDot.y; 

	var diffX = Math.abs(prevX - mouseX);
	var diffY = Math.abs(prevY - mouseY);

	if (diffX < dotsMinDist || diffY < dotsMinDist) return;

	var xVariation = Math.random() > .5 ? -1 : 1;
	xVariation = xVariation*Math.floor(Math.random()*params.maxDistFromCursor)+1;
	var yVariation = Math.random() > .5 ? -1 : 1;
	yVariation = yVariation*Math.floor(Math.random()*params.maxDistFromCursor)+1;
	dots[dots.length] = new Dot(dots.length, mouseX+xVariation, mouseY+yVariation);
	dots[dots.length-1].draw();
	dots[dots.length-1].link();
}
//setInterval(drawIfMouseMoving, 17);

function degToRad(deg) {
	return deg * (Math.PI / 180);
}

/* ----- Stargaze interaction: falling-star CTA, modal open/close, form handling ----- */
(function(){
	// small helpers
	function qs(sel, ctx){ return (ctx||document).querySelector(sel); }
	function qsa(sel, ctx){ return (ctx||document).querySelectorAll(sel); }

	var stargazeHelp = qs('.stargaze-help');
	var modal = qs('#stargaze-modal');
	var sgForm = qs('#stargaze-form');
	var sgDate = qs('#sg-date');
	var sgTime = qs('#sg-time');
	var sgToast = qs('#sg-toast');
	var fallingStarTimer;

	// open/close modal
	function openModal(){
		if(!modal) return;
		modal.removeAttribute('hidden');
		modal.classList.add('open');
		// trap focus lightly
		setTimeout(function(){ if(sgDate) sgDate.focus(); }, 120);
	}
	function closeModal(){
		if(!modal) return;
		modal.setAttribute('hidden','');
		modal.classList.remove('open');
	}

	// backdrop/close buttons
	document.addEventListener('click', function(e){
		var el = e.target;
		if (el && el.hasAttribute && el.hasAttribute('data-close')) { closeModal(); }
	});
	document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

	// spawn a falling star DOM element at random x near top and animate it across the screen
	function spawnFallingStar(){
		var s = document.createElement('div');
		s.className = 'falling-star shoot';
		var startX = Math.floor(Math.random() * (window.innerWidth*0.8)) + 20;
		s.style.left = startX + 'px';
		s.style.top = '-20px';
		var trail = document.createElement('div'); trail.className = 'trail';
		s.appendChild(trail);
		document.body.appendChild(s);

		// click opens modal to plan
		s.addEventListener('click', function(ev){ ev.stopPropagation(); openModal(); });

		// remove after animation
		s.addEventListener('animationend', function(){ s.remove(); });
	}

	// occasionally spawn a falling star; also on user click spawn a star near cursor
		function scheduleFallingStars(){
			clearInterval(fallingStarTimer);
			// slower, more cinematic cadence
			fallingStarTimer = setInterval(function(){
				if (Math.random() < 0.45) spawnFallingStar();
			}, 4200 + Math.random()*4800);
		}
		scheduleFallingStars();

		// When user clicks, only open modal if they clicked a falling star element
		document.addEventListener('click', function(e){
			if (modal && modal.contains(e.target)) return;
			var el = e.target;
			if (el.classList && el.classList.contains('falling-star')){
				// star click handled by spawn listener, but ensure modal opens
				openModal();
			}
		});

	// form submit: validate, show toast and set a theme class
	if (sgForm){
		sgForm.addEventListener('submit', function(e){
			e.preventDefault();
			var dateVal = sgDate.value;
			var timeVal = sgTime.value;
			if (!dateVal || !timeVal) {
				showToast('Please pick both date and time.');
				return;
			}
			closeModal();
			applyStargazeTheme(dateVal, timeVal);
			showToast('Stargazing saved for ' + dateVal + ' at ' + timeVal + ' ✨');
			// optionally persist
			try{ localStorage.setItem('stargaze', JSON.stringify({date:dateVal,time:timeVal})); }catch(e){}
		});
	}

	function applyStargazeTheme(dateVal, timeVal){
		document.body.classList.remove('theme-coffee','theme-park','theme-cafe');
		document.body.classList.add('theme-stargaze');
		// if you want to display chosen time somewhere, you can set an element text here
		var existing = qs('.stargaze-when');
		if(!existing){ existing = document.createElement('div'); existing.className='stargaze-when'; document.body.appendChild(existing); }
		existing.textContent = 'Stargaze: ' + dateVal + ' ' + timeVal;
		existing.style.position = 'fixed'; existing.style.left='18px'; existing.style.bottom='18px'; existing.style.zIndex=50; existing.style.padding='8px 10px'; existing.style.background='rgba(0,0,0,0.36)'; existing.style.color='#fff'; existing.style.borderRadius='10px';
	}

	function showToast(msg){
		if(!sgToast) return; sgToast.textContent = msg; sgToast.removeAttribute('hidden'); sgToast.classList.add('show');
		setTimeout(function(){ sgToast.classList.remove('show'); sgToast.setAttribute('hidden',''); }, 3200);
	}

})();
