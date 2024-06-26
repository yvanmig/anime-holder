import React from 'react'

const AnimeCard = ({animes}) => {

    //TODO Update to react logic
    function toggleDescription(event) {
        const descriptionElement = event.target.nextElementSibling;
        // Hide all other descriptions
        document.querySelectorAll('.animeDescription').forEach(desc => desc.style.display = 'none');
        descriptionElement.style.display = 'block';
    }

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
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default AnimeCard