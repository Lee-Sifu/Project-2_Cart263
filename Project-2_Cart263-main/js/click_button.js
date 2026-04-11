console.log("JS Loaded");

document.addEventListener('DOMContentLoaded', () => {
	const clickArea = document.getElementById('click-area');
	const countEl = document.getElementById('click-count');
	const resetBtn = document.getElementById('reset-btn');
	const imageContainer = document.getElementById('image-container');

	initParticles();

	// Initialize count from the displayed text, or start at 0 if it's not a number
	let count = 0;
	let hasBroken = false;

	// Image Array
	const images = [
		'img/food.jpeg',
		'img/food2.jpg',
		'img/food3.jpeg',
		'img/food4.jpg',
		'img/panda1.jpeg',
		'img/panda2.jpg',
		'img/panda3.jpg',
		'img/plant.jpg',
		'img/plant2.jpg',
		'img/plant3.jpg',
		'img/plant4.jpg',
		'img/artwork.jpg',
		'img/artwork2.jpg',
		'img/artwork3.jpg',
		'img/artwork4.jpg',
	];

	// particle click
	function spawnParticles(x, y) {
		const colors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ff6b81', '#eccc68'];
		const particleCount = 20;

		for (let i = 0; i < particleCount; i++) {
			const particle = document.createElement('div');
			particle.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
        `;
			document.body.appendChild(particle);
			anime({
				targets: particle,
				translateX: (Math.random() - 0.5) * 300,
				translateY: (Math.random() - 0.5) * 300,
				scale: [1, 0],
				opacity: [1, 0],
				duration: 800 + Math.random() * 400,
				easing: 'easeOutExpo',
				complete: () => particle.remove() // clean up DOM
			});
		}
	}
	// Add click event listener to the click area
	clickArea.addEventListener('click', (e) => {
		spawnParticles(e.clientX, e.clientY);

		count += 1;
		countEl.textContent = count;
		changeBackgroundColor();
		changeBackgroundImage();
		hasBroken = false; // Reset collapse mode if user clicks again
		//Random picture spawn every 5 clicks
		if (count % 5 === 0) {
			showRandomImage();
		}

		// Collapse mode when you reach 30 clicks
		if (count === 30 && !hasBroken) {
			hasBroken = true;
			triggerShake();
			showWarningMessage();
			chaoticParticles();
		}

		// Reset after 50 clicks
		if (count === 50) {
			autoReset();
		}
	});

	// Add click event listener to the reset button
	resetBtn.addEventListener('click', (e) => {
		e.stopPropagation();

		count = 0;
		countEl.textContent = count;
		window.pJSDom[0].pJS.fn.vendors.destroypJS(); // Destroy current particles instance
		window.pJSDom = [];
		initParticles(); // Reinitialize particles


		imageContainer.innerHTML = '';
		document.body.style.backgroundColor = '#ffffff'; // Reset background color to white
		document.body.style.backgroundImage = ''; // Remove background image
	});

	// Function to show a random image
	function showRandomImage() {
		const randomIndex = Math.floor(Math.random() * images.length);
		const randomPositionX = Math.random() * (window.innerWidth - 100);
		const randomPositionY = Math.random() * (window.innerHeight - 100);

		const img = document.createElement('img');
		img.src = images[randomIndex];
		img.classList.add('random-image');
		img.style.position = 'absolute';
		img.style.left = `${randomPositionX}px`;
		img.style.top = `${randomPositionY}px`;
		imageContainer.appendChild(img);

		anime({
			targets: img,
			scale: [{ value: 0 }, { value: 1.5 }, { value: 1.2 }],      // overshoot then settle
			rotate: {
				value: Math.random() * 720,   // spin on the way in
				easing: 'easeOutCubic'
			},
			opacity: [0, 1],
			duration: 900,
			easing: 'easeOutBounce'
		});
	}

	// Function to change background color
	function changeBackgroundColor() {
		const bgColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
		document.body.style.backgroundColor = bgColor;
	}

	// Function to initialize particles.js
	function initParticles() {
		particlesJS('particles-js', {
			particles: {
				number: {
					value: 80,
					density: { enable: true, value_area: 800 }
				},
				color: { value: '#ffffff' },
				shape: { type: 'circle' },
				opacity: { value: 0.5 },
				size: { value: 3, random: true },
				line_linked: {
					enable: true,
					distance: 150,
					color: '#ffffff',
					opacity: 0.4,
					width: 1
				},
				move: {
					enable: true,
					speed: 2,
					direction: 'none',
					out_mode: 'out'
				}
			},
			interactivity: {
				detect_on: 'window',
				events: {
					onhover: { enable: true, mode: 'repulse' },
					onclick: { enable: true, mode: 'push' }
				},
				modes: {
					repulse: { distance: 100 },
					push: { particles_nb: 4 }
				}
			},
			retina_detect: true
		});
	}

	// Function for chaostic particle effect
	function chaoticParticles() {
	  // Destroy current instance and restart with wild settings
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];

    particlesJS('particles-js', {
        particles: {
            number: { value: 200 },
            color: { value: ['#ff0000', '#ff6600', '#ffff00'] },
            shape: { type: 'star' },
            opacity: { value: 1, random: true },
            size: { value: 10, random: true },
            move: {
                enable: true,
                speed: 15,       // much faster
                direction: 'none',
                random: true,
                out_mode: 'out'
            }
        },
        interactivity: {
            events: { onclick: { enable: true, mode: 'explode' } },
            modes: { explode: { particles_nb: 30 } }
        }
    });
}
	// Function to change background image with 50% chance
	function changeBackgroundImage() {
		if (Math.random() < 0.5) {
			const randomIndex = Math.floor(Math.random() * images.length);
			document.body.style.backgroundImage = `url(${images[randomIndex]})`;
			document.body.style.backgroundSize = 'cover';
		} else {
			document.body.style.backgroundImage = '';
		}
	}

	// Trigger shake animation
	function triggerShake() {
		anime({
			targets: document.body,
			translateX: [-55, 45],
			translateY: [-55, 45],
			direction: 'alternate',
			loop: 15,
			duration: 150,
			easing: 'easeInOutSine',
			complete: () => {
				document.body.style.transform = '';
			}
		});
	}

	// Alert message in collapse mode
	function showWarningMessage() {
		const warning = document.createElement('div');
		warning.textContent = "YOU ARE BREAKING THE SYSTEM!";
		warning.id = 'system-warning';

		document.body.appendChild(warning);

		// Remove warning after 3 seconds
		setTimeout(() => {
			warning.remove();
		}, 3000);
	}

	// Auto reset after 50 clicks
	function autoReset() {
		alert("System Overload! Resetting...");
		resetAll();
	}

	function resetAll() {
		count = 0;
		countEl.textContent = count;
		hasBroken = false;
		window.pJSDom[0].pJS.fn.vendors.destroypJS(); // Destroy current particles instance
		window.pJSDom = [];
		initParticles(); // Reinitialize particles

		imageContainer.innerHTML = '';
		document.body.style.backgroundColor = '#ffffff';
		document.body.style.backgroundImage = '';
		document.body.style.animation = '';
	}
});

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('../sw.js')
		.then(() => console.log("SW registered"));
}