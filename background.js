// Setup Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('background'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Sphere background with texture (replace with your texture setup)
const geometry = new THREE.SphereGeometry(500, 60, 40); // Adjust radius and segments for detail
const material = new THREE.MeshBasicMaterial({ color: 0x2a2a2a });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Camera position
camera.position.z = 1000;

// OrbitControls for interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// Function to create text mesh for news content
function createTextMesh(text, position) {
    const loader = new THREE.FontLoader();
    loader.load('https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        const geometry = new THREE.TextGeometry(text, {
            font: font,
            size: 20,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.8,
            bevelOffset: 0,
            bevelSegments: 5
        });
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(geometry, material);
        textMesh.position.copy(position);
        scene.add(textMesh);
    }, undefined, function(err) {
        console.error('Font loading error:', err);
    });
}

// Function to fetch and display sports news
function displaySportsNews() {
    const apiKey = '00f61c2287694f8bab470be458084239';
    const apiUrl = `https://newsapi.org/v2/top-headlines?category=sports&apiKey=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.articles.forEach((article, index) => {
                const position = new THREE.Vector3(-250, 100 - index * 50, -300); // Adjust text position
                createTextMesh(article.title, position); // Display each article title as text in the scene
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Update OrbitControls
    controls.update();

    // Rotate the sphere
    scene.rotation.y += 0.001;

    // Render scene
    renderer.render(scene, camera);
}

// Start fetching and displaying sports news
displaySportsNews();

// Start animation loop
animate();
