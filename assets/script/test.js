import React, {useEffect, useState} from 'react'
import {createRoot} from "react-dom/client";
import AnimeCard from './animeCard';

const baseUrl = "https://kitsu.io/api/edge/"


document.addEventListener('DOMContentLoaded', () => {

    init()
})

const init = () => {
    const container = document.getElementById('test')
    const root = createRoot(container); // createRoot(container!) if you use TypeScript
    root.render(<Test />);
}





export default function Test() {

    const [animes, setAnimes] = useState([]);
    useEffect(() => {
        const button = document.getElementById('clickTest');
        button.addEventListener('click', async () => {
            const endpoint = "/anime";
            await initRequest(endpoint);
        });
    }, []);
    async function initRequest(endpoint) {
        const fullUrl = baseUrl.concat('', endpoint);
        const response = await fetch(fullUrl);
        const data = await response.json();

        // Assuming the structure of the response matches what you expect
        const formattedAnimes = data.data.map(anime => ({
            title: anime.attributes.titles.en || anime.attributes.titles.en_jp,
            rating: Math.round((anime.attributes.averageRating / 10) * 100) / 100,
            description: anime.attributes.description,
            imageUrl: anime.attributes.posterImage.large
        }));

        setAnimes(formattedAnimes);
    }

    useEffect(() => {
        if (animes.length > 0) {
            const container = document.getElementById('container');
            // const htmlStrings = animes.map(anime => `
            //     <div>
            //         <p>${anime.title}</p>
            //         <p>${anime.rating}</p>
            //         <div class="toggleDescription">Description</div>
            //         <p class="animeDescription">${anime.description}</p>
            //         <img src="${anime.imageUrl}" class="animeImage"/>
            //         <div class="toggleDescription"></div>
            //     </div>`).join('');

            // container.innerHTML = htmlStrings;
            // document.querySelectorAll('.toggleDescription').forEach(button => {
            //     button.addEventListener('click', toggleDescription);
            // });
        }
    }, [animes]);

    return (
        <>
            <div className="ui buttons" id="startYearSelector">
                {/*{animes[0].title}*/}
                <AnimeCard animes={animes}/>
            </div>
        </>
    )
}