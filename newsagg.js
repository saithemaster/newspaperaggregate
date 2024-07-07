const apiKey = '00f61c2287694f8bab470be458084239'; // Replace with your actual API key (avoid putting it here)
const baseUrl = 'https://newsapi.org/v2/everything?q=sports&sortBy=publishedAt&apiKey=';

async function getSportsNews() {
  const response = await fetch(baseUrl + apiKey);
  const data = await response.json();
  return data.articles;
}

// Three.js scene initialization and animation logic here
