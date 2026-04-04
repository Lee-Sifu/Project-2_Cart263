console.log("JS Loaded");

document.addEventListener('DOMContentLoaded', () => {
	const clickArea = document.getElementById('click-area');
	const countEl = document.getElementById('click-count');
	const resetBtn = document.getElementById('reset-btn');
	const imageContainer = document.getElementById('image-container');

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

	// Add click event listener to the click area
	clickArea.addEventListener('click', () => {
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
            duration: 100,
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

		imageContainer.innerHTML = '';
		document.body.style.backgroundColor = '#ffffff';
		document.body.style.backgroundImage = '';
		document.body.style.animation = '';
	}
});