import React, {useEffect, useState} from 'react'
import {createRoot} from "react-dom/client";
import AnimeCard from './AnimeCard';

const baseUrl = "https://kitsu.io/api/edge/anime"


document.addEventListener('DOMContentLoaded', () => {
    init()
})

const init = () => {
    const container = document.getElementById('searchBar')
    const root = createRoot(container);
    root.render(<SearchBar />);
}

export default function SearchBar() {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const url = new URL(baseUrl);
            const params = new URLSearchParams(url.search);
            params.append('filter[text]', searchInput);
            url.search = params.toString();
            initSearchRequest(url.toString());
            // Send Axios request here
        }, 400)

        return () => clearTimeout(delayDebounceFn)
    }, [searchInput])

    //TODO Create a component that share this function with all components that require it
    function createUrl(endpoint) {
        return baseUrl.concat('', endpoint)
    }

    //TODO Trigger this only when user inputs text. Currently it triggers on initial render
    async function initSearchRequest(endpoint) {
        const response = await fetch(endpoint);
        const data = await response.json();

        //Kitsu API doesnt allow to filter by title, it checks all text fields including the description which may reference other animes
        //So we must manually filter the titles of our query's results
        const filteredAnimes = data.data.reduce((acc, anime) => {
            const title = anime.attributes.titles.en || anime.attributes.titles.en_jp;

            // Check if the title matches the search input
            if (title.toLowerCase().includes(searchInput)) {
                // Push the anime into the accumulator array with the determined title
                acc.push({
                    title: title,
                });
            }

            return acc;
        }, []);

        setSearchResults(filteredAnimes);
    }

    return (
        <>
            <label>
                <input
                    name="myInput"
                    id={"searchInput"}
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}/>
            </label>

            { searchResults.map((anime, index) => {
                return (
                    <div className="animeCardContainer" key={index}>
                        <p key={index}>{anime.title}</p>
                    </div>
                )
            })}


        </>
    )
}