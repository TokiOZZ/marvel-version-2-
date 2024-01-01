import { useState, useEffect } from 'react';

import './randomChar.scss';
import Spinner from '../spinner/Spinner'
import ErrorMesage from '../error/ErrorMesage'
import mjolnir from '../../resources/img/mjolnir.png';

import MarvelService from '../../services/MarvelService';

const RandomChar = () => {
    const [char, setChar] = useState({
        name: null,
        description: null,
        thumbnail: null,
        homepage: null,
        wiki: null
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
        const randomId = Math.floor(Math.random() * (1011400 - 1011000 + 1) + 1011000)
        setIsLoading(true)
        marvelService
            .getCharacter(randomId)
            .then(onCharLoaded)
            .catch(onError)
    }

    useEffect(() => getRandomChar(), [])

    const content = !(isLoading || isError) ? <View char={char} /> : null
    const loading = isLoading ? <Spinner /> : null
    const error = isError ? <ErrorMesage /> : null
    return (
        <div className="randomchar">
            {error || loading || content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br />
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={getRandomChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
            </div>
        </div>
    )

}

const View = ({ char: { name, description, thumbnail, homepage, wiki } }) => {
    if (!description.length) {
        description = 'There is no description for this Character'
    }
    if (description.length > 210) {
        description = `${description.slice(0, 210)}...`
    }
    const styleFix = thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
        ? { objectFit: 'contain' }
        : null
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt={name} style={styleFix} className="randomchar__img" />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;