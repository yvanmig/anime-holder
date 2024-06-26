import React from 'react'
import {createRoot} from "react-dom";

const AnimeCard = ({animes}) => {
    const title = "hey"

    console.log('animes', animes)
    return (
        <>
            <div id="container">
                { animes.map((anime) => {
                    return (
                        <div key={anime.title}>
                            <p>{anime.title}</p>
                            <p>{anime.rating}</p>
                            <div className="toggleDescription">Description</div>
                            <p className="animeDescription">{anime.description}</p>
                            <img src={anime.imageUrl} className="animeImage"/>
                            <div className="toggleDescription"></div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default AnimeCard