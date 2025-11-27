const API_KEY = 'ab6dcd4095311c37103662cca54c0bd6';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Ambil elemen grid dari HTML
const grids = document.querySelectorAll('.movie-grid');
const trendingGrid = grids[0];
const newReleaseGrid = grids[1];
const trendingHeader = trendingGrid.closest('.section').querySelector('h2'); // judul di atas grid
const searchInput = document.querySelector('.navbar input');

// Fungsi fetch data
async function fetchMovies(url) {
    try {
        const res = await fetch(url);
        if(!res.ok) throw new Error("HTTP error " + res.status);
        const data = await res.json();
        return data.results;
    } catch(e) {
        console.error(e);
        return [];
    }
}

// Ambil random movies
function getRandomMovies(movies, count = 8){
    const shuffled = movies.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Fungsi display film di grid
function displayMoviesGrid(movies, grid){
    grid.innerHTML = '';
    const movieList = document.createElement('div');
    movieList.classList.add('movie-list');
    movieList.style.display = 'flex';
    movieList.style.gap = '14px';
    movieList.style.paddingBottom = '10px';

    movies.forEach(movie => {
        const card = document.createElement('a');
        card.classList.add('movie-card');
        card.href = `movies/?id=${movie.id}`;
        card.style.minWidth = '150px';
        card.style.height = '220px';
        card.style.position = 'relative';
        card.style.borderRadius = '8px';
        card.style.overflow = 'hidden';
        card.style.flex = '0 0 auto';
        card.style.cursor = 'pointer';
        card.style.backgroundColor = '#2a2a2a';
        card.style.transition = 'transform 0.3s';

        // Hover effect
        card.addEventListener('mouseenter', () => { card.style.transform = 'scale(1.05)'; });
        card.addEventListener('mouseleave', () => { card.style.transform = 'scale(1)'; });

        if(movie.poster_path){
            const img = document.createElement('img');
            img.src = IMAGE_URL + movie.poster_path;
            img.alt = movie.title + " Poster";
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            card.appendChild(img);
        }

        // Overlay info
        const info = document.createElement('div');
        info.style.position = 'absolute';
        info.style.bottom = '0';
        info.style.width = '100%';
        info.style.background = 'rgba(0,0,0,0.7)';
        info.style.color = 'white';
        info.style.padding = '6px';
        info.style.fontSize = '12px';
        info.innerHTML = `
            <h4 style="margin:2px;font-size:14px;">${movie.title}</h4>
            <p style="margin:0;">⭐ ${movie.vote_average} | ${movie.release_date}</p>
        `;
        card.appendChild(info);

        movieList.appendChild(card);
    });

    grid.appendChild(movieList);
}

// Load trending & new release
async function loadMovies() {
    const trendingMovies = await fetchMovies(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const nowPlayingMovies = await fetchMovies(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);

    trendingHeader.textContent = "Trending";
    displayMoviesGrid(getRandomMovies(trendingMovies), trendingGrid);
    displayMoviesGrid(getRandomMovies(nowPlayingMovies), newReleaseGrid);
}

// Search movie
if(searchInput){
    searchInput.addEventListener('keypress', async function(e){
        if(e.key === 'Enter'){
            const term = searchInput.value.trim();
            if(!term) return;

            const searchResults = await fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(term)}`);

            if(searchResults.length === 0){
                alert('No movies found for: ' + term);
                return;
            }

            // Ubah label trending menjadi kata kunci pencarian
            trendingHeader.textContent = `Result: ${term}`;

            // Tampilkan hasil pencarian di trending grid
            displayMoviesGrid(searchResults, trendingGrid);

            // New Release tetap tampilkan 8 film acak dari now playing
            const nowPlayingMovies = await fetchMovies(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
            displayMoviesGrid(getRandomMovies(nowPlayingMovies), newReleaseGrid);
        }
    });
}

const backBtn = document.getElementById('backBtn');

// Search Movie //
if(searchInput){
    searchInput.addEventListener('keypress', async function(e){
        if(e.key === 'Enter'){
            const term = searchInput.value.trim();
            if(!term) return;

            // Fetch hasil search
            const results = await fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(term)}`);
            
            // Tampilkan hasil di trending grid
            displayMoviesGrid(results, trendingGrid);
            
            // Sembunyikan new release
            newReleaseGrid.style.display = 'none';
            
            // Tampilkan tombol back
            backBtn.style.display = 'inline-block';

            // Ubah label grid
            const trendingHeader = trendingGrid.previousElementSibling.querySelector('h2');
            if(trendingHeader) trendingHeader.textContent = `Search Result: ${term}`;
        }
    });
}

// Tombol back
if(backBtn){
    backBtn.addEventListener('click', function(){
        // Load movies semula
        loadMovies();

        // Tampilkan kembali new release
        newReleaseGrid.style.display = 'block';

        // Sembunyikan tombol back
        backBtn.style.display = 'none';

        // Reset input search
        searchInput.value = '';

        // Reset trending header
        const trendingHeader = trendingGrid.previousElementSibling.querySelector('h2');
        if(trendingHeader) trendingHeader.textContent = `Trending`;
    });
}

const reviews = [
    { author: "Nesha", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
    { author: "Wilton", content: "Another very long review..." }
];




// Inisialisasi
document.addEventListener('DOMContentLoaded', loadMovies);
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a[data-target]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e){
            e.preventDefault(); // cegah reload
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if(targetSection){
                targetSection.scrollIntoView({behavior: 'smooth'});
            }
        });
    });
});

