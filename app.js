const input = document.querySelector(".barra input");
const main_grid = document.querySelector(".restoCuerpo");
const image_path = "https://image.tmdb.org/t/p/w1280";

const popup = document.querySelector('.popup-container')

const API = "3c7436fdbdda925156234a121655d7cb"

//Obtiene de la API todas las películas "trending" y las devuelve.
async function get_movies() {
    const resp = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API}`)
    const respData = await resp.json()
    return respData.results
}

add_movies()

//Almacena en una variable el return de get_movies. Añade al HTML un código que mete esa información en sus respectivos sitios.
async function add_movies() {

    const data = await get_movies()
    
    main_grid.innerHTML = data.slice(0, 20).map(e => {
        if (e.title == undefined) {
            return `
            <div class="cajaPeli" id="peli" data-id="${e.id}">
                <div class="imagen">
                    <img src="${image_path + e.poster_path}" alt="">
                </div>
                <div class="nombre">
                    <h3>${e.name}</h3>
                </div>
                <div class="Nota">
                    <a>Nota: ${e.vote_average}</a>
                </div>
            </div>
        `
        } else {

            return `
            <div class="cajaPeli" id="peli" data-id="${e.id}">
                <div class="imagen">
                    <img src="${image_path + e.poster_path}" alt="">
                </div>
                <div class="nombre">
                    <h3>${e.title}</h3>
                </div>
                <div class="Nota">
                    <a>Nota: ${e.vote_average}</a>
                </div>
            </div>
        `
        }
    }).join('')
	//Crea un Listener por cada peli para que detecte la acción de click y abra el popup
	const pelis = document.querySelectorAll('.cajaPeli')
    pelis.forEach(peli => {
        peli.addEventListener('click', () => show_popup(peli))
    })
    
}
//Obtiene de la API todas las películas que coincidan con la búsqueda y las devuelve.
async function get_movies_searched(search_term) {
		const resp = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API}&query=${search_term}`)
    	const respData = await resp.json()
    	return respData.results
}
//Un listener para el input para que cuando el usuario meta enter con el teclado, le muestre los resultados de la búsqueda.
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      add_movies_searched();
    }
});
//Detecta si el input está vacío y te vuelve a mostrar la pantaña de Trending
input.addEventListener('input', function (e) {
    if (input.value === "") {
      add_to_dom_trending();
    }
});
//Almacena en una variable el return de get_movies_searched. Añade al HTML un código que mete esa información en sus respectivos sitios.
async function add_movies_searched() {
	const data = await get_movies_searched(input.value)

    main_grid.innerHTML = data.map(e => {
        return `
            <div class="cajaPeli" id="peli" data-id="${e.id}">
                <div class="imagen">
                    <img src="${image_path + e.poster_path}" alt="">
                </div>
                <div class="nombre">
                    <h3>${e.title}</h3>
                </div>
                <div class="Nota">
                    <a>Nota: ${e.vote_average}</a>
                </div>
            </div>
`
		
    }).join('')
	const pelis = document.querySelectorAll('.cajaPeli')
    pelis.forEach(peli => {
        peli.addEventListener('click', () => show_popup(peli))
    })
		
	
}
//Muestra en pantalla un popup con toda la información de la respectiva peli clicada
async function show_popup(peli) {
    popup.classList.add('show-popup')

    const movie_id = peli.getAttribute('data-id')
    const movie = await get_movie_by_id(movie_id)

    popup.style.background = `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 1)), url(${image_path + movie.poster_path})`
    popup.innerHTML = `
            <span class="x-icon">&#10006;</span>
            <div class="content">
                <div class="left">
                    <div class="poster-img">
                        <img src="${image_path + movie.poster_path}" alt="">
                    </div>
                </div>
                <div class="right">
                    <h1>${movie.title}</h1>
                    <h3>${movie.tagline}</h3>
                    <div class="single-info-container">
                        <div class="single-info">
                            <span>Idiomas:</span>
                            <span>${movie.spoken_languages[0].name}</span>
                        </div>
                        <div class="single-info">
                            <span>Duración:</span>
                            <span>${movie.runtime} minutos</span>
                        </div>
                        <div class="single-info">
                            <span>Puntuación:</span>
                            <span>${movie.vote_average} / 10</span>
                        </div>
                        <div class="single-info">
                            <span>Presupuesto:</span>
                            <span>$ ${movie.budget}</span>
                        </div>
                        <div class="single-info">
                            <span>Fecha de lanzamiento:</span>
                            <span>${movie.release_date}</span>
                        </div>
                    </div>
                    <div class="genres">
                        <h2>Géneros</h2>
                        <ul>
                            ${movie.genres.map(e => `<li>${e.name}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="overview">
                        <h2>Descripción</h2>
                        <p>${movie.overview}</p>
                    </div>

                </div>
            </div>
    `
    const x_icon = document.querySelector('.x-icon')
    x_icon.addEventListener('click', () => popup.classList.remove('show-popup'))
}
	
async function get_movie_by_id(id) {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API}`)
    const respData = await resp.json()
    return respData
}