import {fetchWithResponse, fetchwWithoutResponse} from './fetcher'


export function getReadings() {
    let url = 'readings'
    return fetchWithResponse(url, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
}
