const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalPoster = document.getElementById('modal-poster');
const modalReleaseYear = document.getElementById('modal-release-year');
const modalPlot = document.getElementById('modal-plot');
const modalCast = document.getElementById('modal-cast');
const modalGenre = document.getElementById('modal-genre');
const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');

const apiKey = '97decf9c';
let currentPage = 1;
let totalPages = 1;
let currentResults = [];

function displayMovies(movies) {
  resultsContainer.innerHTML = '';
  movies.forEach((movie) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <h3>${movie.Title}</h3>
      <img src="${movie.Poster}" alt="${movie.Title} Poster">
      <p>${movie.Year}</p>
      <button data-imdb-id="${movie.imdbID}" class="view-details-button">View Details</button>
    `;
    resultsContainer.appendChild(movieCard);
  });
}

function displayModal(movie) {
  modalTitle.textContent = movie.Title;
  modalPoster.src = movie.Poster;
  modalReleaseYear.textContent = `Release Year: ${movie.Year}`;
  modalPlot.textContent = `Plot: ${movie.Plot}`;
  modalCast.textContent = `Cast: ${movie.Actors}`;
  modalGenre.textContent = `Genre: ${movie.Genre}`;
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

function fetchMovieDetails(imdbID) {
  const url = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayModal(data);
    })
    .catch((error) => {
      console.log('Error fetching movie details:', error);
      alert('Failed to fetch movie details. Please try again later.');
    });
}

function fetchMovies(searchTerm, page) {
  const url = `http://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}&page=${page}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === 'True') {
        totalPages = Math.ceil(parseInt(data.totalResults) / 10);
        currentResults = data.Search;
        displayMovies(currentResults);
      } else {
        resultsContainer.innerHTML = '<p>No results found.</p>';
      }
    })
    .catch((error) => {
      console.log('Error fetching movies:', error);
      alert('Failed to fetch movies. Please try again later.');
    });
}

function handleSearch(event) {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();

  if (searchTerm !== '') {
    fetchMovies(searchTerm, currentPage);
  }
}

function handleViewDetails(event) {
  const imdbID = event.target.dataset.imdbId;
  fetchMovieDetails(imdbID);
}

function handlePaginationButtonClick(event) {
  const buttonId = event.target.id;

  if (buttonId === 'previous-button' && currentPage > 1) {
    currentPage--;
    fetchMovies(searchInput.value.trim(), currentPage);
  } else if (buttonId === 'next-button' && currentPage < totalPages) {
    currentPage++;
    fetchMovies(searchInput.value.trim(), currentPage);
  }
}

searchButton.addEventListener('click', handleSearch);
resultsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('view-details-button')) {
    handleViewDetails(event);
  }
});
modal.addEventListener('click', (event) => {
  if (event.target === modal || event.target.classList.contains('close')) {
    closeModal();
  }
});
previousButton.addEventListener('click', handlePaginationButtonClick);
nextButton.addEventListener('click', handlePaginationButtonClick);
