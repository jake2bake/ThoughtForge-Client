import {fetchWithResponse, fetchWithoutResponse} from './fetcher'

export function getSubmissions() {
    let url = 'submissions'
    return fetchWithResponse(url, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
}

export function getSubmissionById(id) {
  return fetchWithResponse(`submissions/${id}`, {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}

export function addSubmission(submission) {
  return fetchWithResponse(`submissions`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submission)
  })
}

export function editSubmission(id, submission) {
  return fetchWithoutResponse(`submissions/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submission)
  })
}