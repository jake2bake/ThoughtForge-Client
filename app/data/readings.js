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
  return fetchWithResponse(`gutendex/books/${id}/`, {
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



export function getGutendexSearch(searchQuery) {
  const encodedQuery = encodeURIComponent(searchQuery)
  console.log('Search query:', searchQuery)
  console.log('Encoded query:', encodedQuery)
  
  const url = `gutendex/books?q=${encodedQuery}`
  console.log('Full URL:', url)
  
  return fetchWithResponse(url, {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}

