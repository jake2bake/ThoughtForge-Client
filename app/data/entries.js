import {fetchWithResponse, fetchWithoutResponse} from './fetcher'

export function getEntries() {
    let url = 'entries'
    return fetchWithResponse(url, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
}

export function getMyEntries() {
    let url = 'entries/myentries'
    return fetchWithResponse(url, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
}

export function getEntryById(id) {
  return fetchWithResponse(`entries/${id}`, {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}

export function addEntry(entry) {
  return fetchWithResponse(`entries`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  })
}

export function editEntry(id, entry) {
  return fetchWithoutResponse(`entries/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  })
}

export function likeEntry(entryId) {
  return fetchWithoutResponse(`entries/${entryId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
  })
}

export function unLikeEntry(entryId) {
  return fetchWithoutResponse(`entries/${entryId}/like`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
  })
}

export function getLikedEntries() {
  return fetchWithResponse('entries/liked', {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  })
}

export function deleteEntry(id, entry) {
  return fetchWithoutResponse(`entries/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  })
}