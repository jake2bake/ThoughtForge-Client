import {fetchWithResponse, fetchWithoutResponse} from './fetcher'

export function getCourses() {
    let url = 'courses'
    return fetchWithResponse(url, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
}

export function getCourseById(id) {
  return fetchWithResponse(`courses/${id}`, {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}