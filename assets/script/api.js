const baseUrl = "https://kitsu.io/api/edge/"

// document.addEventListener('DOMContentLoaded', function() {
//     const button = document.getElementById('click');
//     button.addEventListener('click', function() {
//         initRequest("/anime");
//     });
// });

// document.addEventListener('DOMContentLoaded', function() {
//     const button = document.getElementById('trending');
//     button.addEventListener('click', function() {
//         initRequest("trending/anime");
//     });
// });

async function initRequest2(endpoint) {

    const fullUrl = baseUrl.concat('', endpoint)
    const response = await fetch(fullUrl);
    const animes = await response.json();
    const minCeiled = Math.ceil(10);
    const maxFloored = Math.floor(0);
    // let random = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);

    const htmlStrings = animes.data.map(anime => {
        const title = anime.attributes.titles.en || anime.attributes.titles.en_jp;
        const rating = Math.round((anime.attributes.averageRating / 10) * 100) / 100;

        return `
            <div>
                <p>${title}</p>
                <p>${rating}</p>
                <div class="toggleDescription">Description</div>
                <p class="animeDescription">${anime.attributes.description}</p>
                <img src="${anime.attributes.posterImage.large}" class="animeImage"/>
            </div>`;
    });

    // Join all HTML strings into one string and insert the HTML string into the container
    document.getElementById('container').innerHTML = htmlStrings.join('');
    document.querySelectorAll('.toggleDescription').forEach(button => {
        button.addEventListener('click', toggleDescription);
    });
}
function toggleDescription(event) {
    const descriptionElement = event.target.nextElementSibling;
    // Hide all other descriptions
    document.querySelectorAll('.animeDescription').forEach(desc => desc.style.display = 'none');
    descriptionElement.style.display = 'block';
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
