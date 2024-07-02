import React, {useEffect, useState} from 'react'
import {createRoot} from "react-dom/client";
import AnimeCard from './AnimeCard';

const baseUrl = "https://kitsu.io/api/edge/"


document.addEventListener('DOMContentLoaded', () => {
    init()
})

const init = () => {
    const container = document.getElementById('container')
    const root = createRoot(container);
    root.render(<Anime />);
}

export default function Anime() {
    const [animes, setAnimes] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({first : null, previous : null, next : null, last : null})

    useEffect(() => {
        const button = document.getElementById('clickTest');
        button.addEventListener('click', async () => {
            const endpoint = "anime";
            const fullUrl = createUrl(endpoint)
            await initRequest(fullUrl);
        });
    }, []);
    useEffect(() => {
        const button = document.getElementById('trending');
        button.addEventListener('click', async () => {
            const endpoint = "trending/anime";
            const fullUrl = createUrl(endpoint)
            await initRequest(fullUrl);
        });
    }, []);

    useEffect(() => {
        const button = document.getElementById('category');
        button.addEventListener('click', async () => {
            const endpoint = "anime?filter[categories]=musical-band";
            const fullUrl = createUrl(endpoint)
            await initRequest(fullUrl);
        });
    }, []);


    async function initRequest(endpoint, navigation = null) {
        const response = await fetch(endpoint);
        const data = await response.json();

        setCurrentPage(extractPageNumber(endpoint))

        const formattedAnimes = data.data.map(anime => ({
            title: anime.attributes.titles.en || anime.attributes.titles.en_jp,
            rating: Math.round((anime.attributes.averageRating / 10) * 100) / 100,
            description: anime.attributes.description,
            imageUrl: anime.attributes.posterImage.large,
            startDate: anime.attributes.startDate
        }));
        if(data.links) {
            setPagination({
                first: data.links.first,
                previous: data.links.prev,
                next: data.links.next,
                last: data.links.last,
            })
        }
        setAnimes(formattedAnimes);
        setIsDataFetched(true);
    }

    function createUrl(endpoint) {
        return baseUrl.concat('', endpoint)
    }

    function extractPageNumber(url) {
        const params = new URLSearchParams(new URL(url).search);
        const pageNumber = params.get('page[number]');
        return pageNumber ? pageNumber : 1
    }
    const handleDescriptionToggle = (index) => {
        setSelectedIndex(index);
    };

    return (
        <>

            {isDataFetched && (
                <>
                    {currentPage}
                    {pagination.first && (
                        <button onClick={() => initRequest(pagination.first)}>First</button>
                    )}
                    {pagination.previous && (
                        <button onClick={() => initRequest(pagination.previous, "previous")}>Previous</button>
                    )}
                    {pagination.next && (
                        <button onClick={() => initRequest(pagination.next, "next")}>Next</button>
                    )}
                    {pagination.last && (
                        <button onClick={() => initRequest(pagination.last)}>Last</button>
                    )}
                </>
            )}

            <AnimeCard animes={animes} selectedIndex={selectedIndex} onDescriptionToggle={handleDescriptionToggle}/>
        </>
    )
}