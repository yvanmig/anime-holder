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
        const button = document.getElementById('topAnimes');
        button.addEventListener('click', async () => {
            const endpoint = "anime";
            const fullUrl = createUrl(endpoint)
            await initRequest(fullUrl);
        });
    }, []);
    useEffect(() => {
        const button = document.getElementById('trendingAnimes');
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


    async function initRequest(endpoint) {
        const response = await fetch(endpoint);
        const data = await response.json();

        setCurrentPage(extractPageNumber(endpoint))

        const formattedAnimes = data.data.map(anime => {

            const title = anime.attributes.titles.en || anime.attributes.titles.en_jp;
            const rating = Math.round((anime.attributes.averageRating / 10) * 100) / 100
            const startDate = anime.attributes.startDate.substring(0,4)
            const isOngoing = !anime.attributes.endDate ?? true
            const episodeCount = anime.attributes.episodeCount ? anime.attributes.episodeCount : null

            return {
                title: title,
                rating: rating,
                description: anime.attributes.description,
                imageUrl: anime.attributes.posterImage.large,
                startDate: startDate,
                isOngoing : isOngoing,
                episodeCount : episodeCount
            }

        });
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
        return pageNumber ? parseInt(pageNumber) : 1
    }
    const handleDescriptionToggle = (index) => {
        setSelectedIndex(index);
    };

    return (
        <>
            <div id="animeContainer">
                <AnimeCard animes={animes} selectedIndex={selectedIndex} onDescriptionToggle={handleDescriptionToggle}/>
            </div>
            {isDataFetched && (
                <>
                    <div id="pagination">

                        {pagination.first && (
                            <button className={"paginationButton"} onClick={() => initRequest(pagination.first)}>First</button>
                        )}
                        {pagination.previous && (
                            <button className={"paginationButton"} onClick={() => initRequest(pagination.previous, "previous")}> {currentPage - 1} </button>
                        )}
                        <button className={"paginationButton currentPageButton"}> {currentPage} </button>
                        {pagination.next && (
                            <button className={"paginationButton"} onClick={() => initRequest(pagination.next, "next")}> {currentPage + 1}</button>
                        )}
                        {pagination.last && (
                            <button className={"paginationButton"} onClick={() => initRequest(pagination.last)}>Last</button>
                        )}
                    </div>

                </>
            )}

        </>
    )
}