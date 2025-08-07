import {fetchWithResponse, fetchwWithoutResponse} from './fetcher'

export function getTopics() {
    let url = 'topics'
    return fetchWithResponse(url, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
}