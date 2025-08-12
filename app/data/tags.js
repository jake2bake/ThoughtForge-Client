import { fetchWithResponse } from "./fetcher"

export function getTags() {
    let url = 'tags'
    return fetchWithResponse(url, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
}

export function getEntryTags() {
    let url = 'entryTags'
    return fetchWithResponse(url, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
}