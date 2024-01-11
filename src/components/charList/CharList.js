import { useState, useEffect } from 'react';


import './charList.scss';
import Spinner from '../spinner/Spinner'
import ErrorMesage from '../error/ErrorMesage'

import MarvelService from '../../services/MarvelService';

const CharList = ({ onIdSet }) => {

    const [charList, setCharList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [selectedCharId, setSelectedCharId] = useState(null)
    const [offset, setOffset] = useState(210)
    const [newCharsLoading, setNewCharsLoading] = useState(false)
    const [charsEnded, setCharsEnded] = useState(false)

    const marvelService = new MarvelService()

    const onCharListLoaded = (newChars) => {
        let ended = false
        if (newChars.length < 9) {
            ended = true
        }
        console.log(newChars);
        setIsLoading(false)
        setNewCharsLoading(false)
        setCharList([...charList, ...newChars])
        setOffset(offset + 9)
        setCharsEnded(ended)

    }
    const onError = () => {
        setIsLoading(false)
        setIsError(true)
    }
    const getCharList = (offset) => {
        onCharListLoading()
        marvelService
            .getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)

    }
    const onCharListLoading = () => {
        setNewCharsLoading(true)
    }


    useEffect(() => getCharList(), [])

    const content = !(isLoading || isError)
        ? <View
            charList={charList}
            selectedCharId={selectedCharId}
            setSelectedCharId={setSelectedCharId}
            onIdSet={onIdSet} />
        : null
    const loading = isLoading ? <Spinner /> : null
    const error = isError ? <ErrorMesage /> : null
    return (
        <div className="char__list">
            {error || loading || content}
            <button
                className="button button__main button__long"
                onClick={() => getCharList(offset)}
                disabled={newCharsLoading}
                style={{ 'display': charsEnded ? 'none' : 'block' }}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

const View = ({ charList, selectedCharId, setSelectedCharId, onIdSet }) => {
    const onCharSelected = (e) => {
        const id = +e.currentTarget.attributes['data-id'].value
        setSelectedCharId(id)
        onIdSet(id)
    }

    const list = charList.map(({ name, thumbnail, id }) => {
        const classNames = id !== selectedCharId ? "char__item" : "char__item char__item_selected"

        const styleFix = thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
            ? { objectFit: 'unset' }
            : null
        return (
            <li className={classNames} key={id} onClick={onCharSelected} data-id={id}>
                <img src={thumbnail} alt={name} style={styleFix} />
                <div className="char__name">{name}</div>
            </li>
        )
    })


    return (
        <ul className="char__grid">
            {list}
        </ul>
    )
}

export default CharList;