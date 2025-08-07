const API_URL = 'http://localhost:8000';

const checkError = (res) => {
  if (!res.ok) throw Error(res.status);
  return res;
};

const checkErrorJson = (res) => checkError(res).json();

const catchError = (err) => {
  if (err.message === '401') {
    window.location.href = "/login";
    return;
  }

  if (err.message === '404') {
    console.warn("Resource not found (404)");
    return null; // ✅ return null instead of throwing
  }

  throw err; // only rethrow unknown errors
};


export const fetchWithResponse = (resource, options = {}) =>
  fetch(`${API_URL}/${resource}`, options)
    .then(checkErrorJson)
    .catch(catchError);

export const fetchWithoutResponse = (resource, options = {}) =>
  fetch(`${API_URL}/${resource}`, options)
    .then(checkError)
    .catch(catchError);




