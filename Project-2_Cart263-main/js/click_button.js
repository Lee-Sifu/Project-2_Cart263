console.log("JS Loaded");

document.addEventListener('DOMContentLoaded', () => {
	const countEl = document.getElementById('click-count');
	const resetBtn = document.getElementById('reset-btn');
	const imageContainer = document.getElementById('image-container');

	let scene, camera, renderer, cube, fragments = [];
	let isBroken3D = false;

	let raycaster, mouse;

	initParticles();
	initThree();

	// Touch support for mobile devices
	function updateParticlesFromTouch(e) {
		const touch = e.touches[0];
		const pJS = window.pJSDom[0]?.pJS;

		if (pJS) {
			const canvas = pJS.canvas.el;
			const rect = canvas.getBoundingClientRect();
			const ratio = window.devicePixelRatio || 1;

			const x = (touch.clientX - rect.left) * ratio;
			const y = (touch.clientY - rect.top) * ratio;

			pJS.interactivity.mouse.pos_x = x;
			pJS.interactivity.mouse.pos_y = y;
			pJS.interactivity.status = 'mousemove';
		}
	}

	//When finger starts touching
	document.addEventListener('touchstart', updateParticlesFromTouch, { passive: false });
	document.addEventListener('touchmove', updateParticlesFromTouch, { passive: false });

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
				complete: () => particle.remove()
			});
		}
	}

	// Main click handler
	function handleCubeClick(clientX, clientY) {
		if (!cube || isBroken3D) return;

		shakeCube();
		spawnParticles(clientX, clientY);

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
			breakCube();
		}

		// Reset after 50 clicks
		if (count === 50) {
			autoReset();
		}
	}

	// Add click event listener to the rest button
	resetBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		resetAll();
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
			scale: [{ value: 0 }, { value: 1.5 }, { value: 1.2 }], // overshoot then settle
			rotate: {
				value: Math.random() * 720, // spin on the way in
				easing: 'easeOutCubic'
			},
			opacity: [0, 1],
			duration: 900,
			easing: 'easeOutBounce'
		});
	}

	// Function to change background color
	function changeBackgroundColor() {
		const bgColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
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
					onclick: { enable: true, mode: 'push' },
					resize: true
				},
				modes: {
					repulse: {
						distance: 120,
						duration: 0.4
					},
					push: { particles_nb: 6 }
				}
			},
			retina_detect: true
		});
	}


	// Three.js 3D breaking effect
	function initThree() {
		const container = document.getElementById('three-container');

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		camera.position.z = 5;

		renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);

		//light
		const light = new THREE.PointLight(0xffffff, 1);
		light.position.set(5, 5, 5);
		scene.add(light);

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		createCube();

		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();

		renderer.domElement.addEventListener('click', onCubePointerClick);
		renderer.domElement.addEventListener('touchstart', onCubeTouchStart, { passive: true });

		window.addEventListener('resize', onWindowResize);

		animate();
	}

	// Cube
	function createCube() {
		const geometry = new THREE.BoxGeometry(2, 2, 2);
		const material = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			roughness: 0.5
		});

		cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
	}

	function onCubePointerClick(event) {
		if (!cube || isBroken3D) return;

		const rect = renderer.domElement.getBoundingClientRect();
		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObject(cube);

		if (intersects.length > 0) {
			handleCubeClick(event.clientX, event.clientY);
		}
	}

	function onCubeTouchStart(event) {
		if (!cube || isBroken3D) return;

		const touch = event.touches[0];
		const rect = renderer.domElement.getBoundingClientRect();

		mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObject(cube);

		if (intersects.length > 0) {
			handleCubeClick(touch.clientX, touch.clientY);
		}
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function animate() {
		requestAnimationFrame(animate);

		if (cube && !isBroken3D) {
			cube.rotation.x += 0.005;
			cube.rotation.y += 0.005;
		}

		// If in broken state, animate fragments
		fragments.forEach(f => {
			f.position.add(f.velocity);
			f.rotation.x += 0.02;
			f.rotation.y += 0.02;
		});

		renderer.render(scene, camera);
	}


	// Function for chaostic particle effect
	function chaoticParticles() {
		// Destroy current instance and restart with wild settings
		window.pJSDom[0].pJS.fn.vendors.destroypJS();
		window.pJSDom = [];

		particlesJS('particles-js', {
			particles: {
				number: { value: 50 },
				color: { value: ['#ff0000', '#ff6600', '#ffff00'] },
				shape: { type: 'star' },
				opacity: { value: 1, random: true },
				size: { value: 10, random: true },
				move: {
					enable: true,
					speed: 15,
					direction: 'none',
					random: true,
					out_mode: 'out'
				}
			},
			interactivity: {
				detect_on: 'window',
				events: { onclick: { enable: true, mode: 'push' } },
				modes: { push: { particles_nb: 30 } }
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

	// Shake effect for cube
	function shakeCube() {
		if (!cube || isBroken3D) return;

		anime({
			targets: cube.rotation,
			x: cube.rotation.x + 0.3,
			y: cube.rotation.y + 0.3,
			duration: 200,
			direction: 'alternate',
			easing: 'easeInOutSine'
		});
	}

	//Break cube into small cubes
	function breakCube() {
		if (isBroken3D) return;

		isBroken3D = true;
		scene.remove(cube);
		cube = null;

		const pieceSize = 0.5;

		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
				for (let z = -1; z <= 1; z++) {
					const geo = new THREE.BoxGeometry(pieceSize, pieceSize, pieceSize);
					const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
					const fragment = new THREE.Mesh(geo, mat);

					fragment.position.set(x * 0.7, y * 0.7, z * 0.7);
					fragment.velocity = new THREE.Vector3(
						(Math.random() - 0.5) * 0.2,
						(Math.random() - 0.5) * 0.2,
						(Math.random() - 0.5) * 0.2
					);

					fragments.push(fragment);
					scene.add(fragment);
				}
			}
		}
	}

	//Reset cube
	function resetCube() {
		fragments.forEach(f => scene.remove(f));
		fragments = [];

		isBroken3D = false;
		createCube();
	}

	// Alert message in collapse mode
	function showWarningMessage() {
		const warning = document.createElement('div');
		warning.textContent = "YOU ARE BREAKING THE SYSTEM!";
		warning.id = 'system-warning';
		document.body.appendChild(warning);

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

		window.pJSDom[0].pJS.fn.vendors.destroypJS();
		window.pJSDom = [];
		initParticles();

		imageContainer.innerHTML = '';
		document.body.style.backgroundColor = '#000000';
		document.body.style.backgroundImage = '';
		document.body.style.animation = '';

		resetCube();
	}
});

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js')
		.then(() => console.log("SW registered"));
}