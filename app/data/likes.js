import {fetchWithResponse, fetchWithoutResponse} from "./fetcher"

export function getLikes() {
    let url = 'likes'
    return fetchWithResponse(url, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
}

export function addLike(like) {
  return fetchWithResponse(`likes`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(like)
  })
}
