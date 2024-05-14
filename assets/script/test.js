document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('click');
    button.addEventListener('click', function() {
        initRequest();
    });
});

async function initRequest() {

    const response = await fetch("https://kitsu.io/api/edge/anime");
    const animes = await response.json();
    const minCeiled = Math.ceil(10);
    const maxFloored = Math.floor(0);
    let random = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);

    const htmlStrings = animes.data.map(anime =>
        `<div><p>${anime.attributes.titles.en === undefined ? anime.attributes.titles.en_jp : anime.attributes.titles.en}</p>
        <p>${anime.attributes.averageRating}</p>
        <img src="${anime.attributes.posterImage.large}" class="animeImage"/> </div>`
    );

    // Join all HTML strings into one string and insert the HTML string into the container
    document.getElementById('container').innerHTML = htmlStrings.join('');

}


function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    console.log(data);
}

function handleError(error) {
    alert('Error, check console');
    console.error(error);
}
