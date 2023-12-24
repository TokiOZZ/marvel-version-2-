
class MarvelService {

    _apiBase = 'https://gateway.marvel.com:443/v1/public/'
    _apiKey = 'apikey=e90b29ea09c8f6eff79ce8ea062aca5d'

    getResource = async (url) => {
        let res = await fetch(url)

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }

        return await res.json()
    }

    getAllCharacters = () => {
        return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`)
    }
    getCharacter = (id) => {
        return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`).then(res => this._transformData(res.data.results[0]))
    }

    _transformData = ({ id, name, description, thumbnail, urls, comics }) => {

        if (description.length === 0) {
            description = 'There`s no description for this Character'
        }
        if (description.length > 210) {
            description = `${description.slice(0, 210)}...`
        }
        return ({
            id: id,
            name: name,
            description: description,
            thumbnail: `${thumbnail.path}.${thumbnail.extension}`,
            home: urls[0].url,
            wiki: urls[1].url,
            comics: comics.items

        })
    }
}

export default MarvelService