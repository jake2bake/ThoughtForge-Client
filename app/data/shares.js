import { fetchWithResponse } from "./fetcher"

export function getShares() {
    let url = 'likes'
    return fetchWithResponse(url, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
}

export function addShare(share) {
  return fetchWithResponse(`shares`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(share)
  })
}
