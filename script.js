const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?api_key=04c35731a5ee918f014970082a0088b1&query=";

const moviesContainer = document.getElementById('movies-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const moviesSection = document.getElementById('movies-section');
const heroSection = document.querySelector('.hero-section');
const movieModal = document.getElementById('movie-modal');
const movieDetails = document.getElementById('movie-details');
const closeModal = document.getElementsByClassName('close')[0];
const watchNowButton = document.getElementById('watch-now-button');

// Fetch movies from API
async function getMovies(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
}

// Show hero section, hide movies section
window.onload = () => {
  heroSection.style.display = 'block';
  moviesSection.style.display = 'none';
};

// Display movies as cards
function showMovies(movies) {
  moviesContainer.innerHTML = '';
  if (movies.length === 0) {
    const noResults = document.createElement('div');
    noResults.textContent = 'No movies found.';
    moviesContainer.appendChild(noResults);
    noResults.style.marginBottom = "28rem";
    noResults.style.color = "white";
    noResults.style.fontSize = "24px";
  } else {
    movies.forEach((movie) => {
      const { title, poster_path, release_date } = movie;
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      movieCard.innerHTML = `
        <img src="${IMGPATH + poster_path}" alt="${title}">
        <h3>${title}</h3>
        <p><strong>Release Date:</strong> ${release_date}</p>
      `;
      movieCard.addEventListener('click', () => showModal(movie));
      moviesContainer.appendChild(movieCard);
    });
  }
  
  // Show movies section and hide hero section
  moviesSection.style.display = 'block';
  heroSection.style.display = 'none';
}

// Show modal with movie details including cast
async function showModal(movie) {
  const { id, title, overview, release_date, vote_average, poster_path } = movie;
  const castURL = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=04c35731a5ee918f014970082a0088b1`;

  try {
    // Fetch cast data
    const response = await fetch(castURL);
    const data = await response.json();
    const cast = data.cast.slice(0, 6); 

    const castList = cast.map(actor => `${actor.name}, `).join('');

    // Modal content
    movieDetails.innerHTML = `
    <div class="left-content">
      <h2>${title}</h2>
      <img src="${IMGPATH + poster_path}" alt="${title}">
    </div>
    <div class="right-content">
      <h4>Plot:</h4>
      <p>${overview}</p>
      <h4>Cast:</h4>
      <p>${castList}</p>
      <p><strong>Release Date: </strong>${release_date}</p>
      <p><strong>Rating: </strong>${vote_average}</p>
    </div>
  `;
  
    // Display modal
    movieModal.style.display = 'block';
  } catch (error) {
    console.error('Error fetching cast data: ', error);
  }
}

// Close modal
closeModal.onclick = function() {
  movieModal.style.display = 'none';
}

// Event listener to watch now
watchNowButton.addEventListener('click', async () => {
  try {
    // Fetch movies
    const movies = await getMovies(APIURL);

    // Display cards
    showMovies(movies);
  } catch (error) {
    console.error('Error fetching movies: ', error);
  }
});

// Search functionality
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value;
  let url = SEARCHAPI + searchTerm;

  // If search term is empty
  if (!searchTerm) {
    alert('Please enter a valid search term');
    return;
  }

  // localStorage for cached data
  let movies = JSON.parse(localStorage.getItem(searchTerm));

  if (!movies) {
    movies = await getMovies(url);
    localStorage.setItem(searchTerm, JSON.stringify(movies));
  }

  showMovies(movies);
});


