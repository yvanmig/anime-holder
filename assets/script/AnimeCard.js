import React from 'react'

const AnimeCard = ({animes, onDescriptionToggle, selectedIndex}) => {
    function toggleDescription(index) {
        //Hide description if it's already displayed
        if(index === selectedIndex) {
            onDescriptionToggle(null);
        } else {
            onDescriptionToggle(index);
        }
    }

    return (
        <>
            <div id="container">
                { animes.map((anime, index) => {
                    return (
                        <div key={index}>
                            <p>{anime.title}</p>
                            <p>{anime.rating}</p>
                            <div className="toggleDescription" onClick={() => toggleDescription(index)}>Description</div>
                            {selectedIndex === index && <p className="aznimeDescription">{anime.description}</p>}                            <img src={anime.imageUrl} className="animeImage"/>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default AnimeCard