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
    const [randomAnime, setRandomAnime] = useState({});
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({first : null, previous : null, next : null, last : null})

    useEffect(() => {
        const button = document.getElementById('randomAnime');
        button.addEventListener('click', async () => {
            const endpoint = "anime";
            const fullUrl = createUrl(endpoint)
            await initRandomRequest(fullUrl);
        });
    }, []);

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

     async function initRandomRequest(endpoint) {
         try {
             const response = await fetch(endpoint);

             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             }

             let data = await response.json();
             const animecount = data.meta.count;

             //TODO Turn 10 into a variable that can adapt to a different pagination setting
             const randomPageNumber = Math.random() * (animecount/10 - 1) + 1;

             const url = new URL(endpoint);
             const params = new URLSearchParams(url.search);
             params.append('page[offset]', randomPageNumber.toString());
             url.search = params.toString();

             const randomPage = await fetch(url.toString());
             data = await randomPage.json();
             const randomAnimeResult = data.data[Math.floor(Math.random() * (9))];
             const anime = createThumbAnimeData(randomAnimeResult)

             setRandomAnime(anime)

         } catch (error) {
             console.error("Failed to fetch data:", error);
         }
     }

    async function initRequest(endpoint) {
        try {
            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const formattedAnimes = data.data.map(createThumbAnimeData);

            if (data.links) {
                setPagination({
                    first: data.links.first,
                    previous: data.links.prev,
                    next: data.links.next,
                    last: data.links.last,
                });
            }

            setCurrentPage(extractPageNumber(endpoint));
            setAnimes(formattedAnimes);
            setIsDataFetched(true);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }

    function createThumbAnimeData(rawAnime) {
        const title = rawAnime.attributes.titles.en || rawAnime.attributes.titles.en_jp;
        const rating = Math.round((rawAnime.attributes.averageRating / 10) * 100) / 100;
        const startDate = rawAnime.attributes.startDate.substring(0, 4);
        const isOngoing = !rawAnime.attributes.endDate ?? true;
        const episodeCount = rawAnime.attributes.episodeCount ? rawAnime.attributes.episodeCount : null;
        const anime = {
            title: title,
            rating: rating,
            description: rawAnime.attributes.description,
            imageUrl: rawAnime.attributes.posterImage.large,
            startDate: startDate,
            isOngoing: isOngoing,
            episodeCount: episodeCount
        }

        return anime
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
                <div className="animeCardContainer">
                    <p>{randomAnime.title}</p>
                    <p>{randomAnime.rating}</p>
                    <p>{randomAnime.startDate} {randomAnime.isOngoing && <span>- Currently airing </span>}</p>
                    {randomAnime.episodeCount && <p> {randomAnime.episodeCount} episodes </p>}
                    <img src={randomAnime.imageUrl} className="animeImage"/>
                </div>

                <AnimeCard animes={animes} selectedIndex={selectedIndex} onDescriptionToggle={handleDescriptionToggle}/>
            </div>
            {isDataFetched && (
                <>
                    <div id="pagination">

                        {pagination.first && (
                            <button className={"paginationButton"}
                                    onClick={() => initRequest(pagination.first)}>First</button>
                        )}
                        {pagination.previous && (
                            <button className={"paginationButton"}
                                    onClick={() => initRequest(pagination.previous, "previous")}> {currentPage - 1} </button>
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