import {fetchWithResponse, fetchwWithoutResponse} from './fetcher'


export function getReadings() {
    let url = 'readings'
    return fetchWithResponse(url, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
}

export function getGutendex(id) {
  return fetchWithResponse(`gutendex/books/${id}`, {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}

export function getGutendexText(textUrl) {
  const encodedUrl = encodeURIComponent(textUrl)
  
  return fetchWithResponse(`gutendex/text/?url=${encodedUrl}`,
    {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`
      }
    }
  )
}

// ...existing code...

export function getGutendexSearch(searchQuery) {
  const encodedQuery = encodeURIComponent(searchQuery)
  return fetchWithResponse(`gutendex/books/search/?q=${encodedQuery}`, {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}

