const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('backgroundCanvas').appendChild(renderer.domElement);

const particleCount = 1000;
const particles = new THREE.Group();
const particleGeometry = new THREE.SphereGeometry(0.1, 32, 32);

for (let i = 0; i < particleCount; i++) {
    const hue = Math.random();
    const saturation = Math.random() * 0.5 + 0.5;
    const lightness = Math.random() * 0.5 + 0.5;
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, saturation, lightness),
        opacity: 0.6,
        transparent: true
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);

    particle.position.x = (Math.random() - 0.5) * 20;
    particle.position.y = (Math.random() - 0.5) * 20;
    particle.position.z = (Math.random() - 0.5) * 20;

    particles.add(particle);
}

scene.add(particles);

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.001;
    renderer.render(scene, camera);
}

camera.position.z = 30;
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const apiKey = '00f61c2287694f8bab470be458084239';

async function fetchTopHeadlines(category = 'sports') {
    try {
        const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error(`Error fetching top headlines for ${category}:`, error);
        return [];
    }
}

function displayArticles(articles, targetElementId) {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) return;

    targetElement.innerHTML = '';
    articles.forEach(article => {
        const articleHtml = `
            <div class="col-md-4">
                <div class="card">
                    <img src="${article.urlToImage || 'https://via.placeholder.com/150'}" class="card-img-top" alt="Article Image">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.description || 'No description available.'}</p>
                        <a href="${article.url}" class="btn btn-primary">Read more</a>
                    </div>
                </div>
            </div>
        `;
        targetElement.innerHTML += articleHtml;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const topHeadlines = await fetchTopHeadlines();
        displayArticles(topHeadlines, 'headlineNews');
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
});
