import { useState, useEffect } from 'react';
import './charInfo.scss';
import Spinner from '../spinner/Spinner'
import ErrorMesage from '../error/ErrorMesage'


import MarvelService from '../../services/MarvelService';

const CharInfo = ({ id }) => {
    const [char, setChar] = useState({
        name: null,
        description: null,
        thumbnail: null,
        homepage: null,
        wiki: null,
        comics: [],
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const marvelService = new MarvelService()

    const onCharLoaded = (char) => {
        setIsLoading(true)
        setChar(char)
        setIsLoading(false)
        setIsError(false)
    }

    const onError = () => {
        setIsLoading(false)
        setIsError(true)
    }

    const getRandomChar = () => {
        setIsError(false)
        setIsLoading(true)
        marvelService
            .getCharacter(id)
            .then(onCharLoaded)
            .catch(onError)
    }

    useEffect(() => getRandomChar(), [id])

    const content = !(isLoading || isError) ? <View char={char} /> : null
    const loading = isLoading ? <Spinner /> : null
    const error = isError ? <ErrorMesage /> : null

    const styleFix = isError ? { margin: "0 auto" } : null


    return (
        <div className="char__info" style={styleFix}>
            {error || loading || content}
        </div>
    )
}

const View = ({ char: { name, description, thumbnail, homepage, wiki, comics } }) => {
    if (!description.length) {
        description = 'There is no description for this Character'
    }
    if (description.length > 210) {
        description = `${description.slice(0, 210)}...`
    }
    const styleFix = thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
        ? { objectFit: 'contain' }
        : null
    const comicsList = comics.map((item, index) => {
        if (index <= 12) {
            return (
                <li className="char__comics-item" key={index}>
                    {item.name}
                </li>
            )
        }

    })
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={styleFix} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicsList}
            </ul>
        </>
    )
}



export default CharInfo;