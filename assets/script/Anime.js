import React, {useEffect, useState} from 'react'
import {createRoot} from "react-dom/client";
import AnimeCard from './animeCard';

const baseUrl = "https://kitsu.io/api/edge/"


document.addEventListener('DOMContentLoaded', () => {
    init()
})

const init = () => {
    const container = document.getElementById('test')
    const root = createRoot(container);
    root.render(<Anime />);
}

export default function Anime() {

    const [animes, setAnimes] = useState([]);
    useEffect(() => {
        const button = document.getElementById('clickTest');
        button.addEventListener('click', async () => {
            const endpoint = "/anime";
            await initRequest(endpoint);
        });
    }, []);
    useEffect(() => {
        const button = document.getElementById('trending');
        button.addEventListener('click', async () => {
            const endpoint = "trending/anime";
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



    return (
        <>
            <div className="ui buttons" id="startYearSelector">
                <AnimeCard animes={animes}/>
            </div>
        </>
    )
}