import { fetchWithResponse } from "./fetcher";

export function login({ username, password }) {
  return fetchWithResponse("login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
}


export function register(user) {
  return fetchWithResponse("register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}

export function getUserProfile() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.resolve(null);

  return fetchWithResponse("profile/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
}

export function getUsers() {
  return fetchWithResponse("users", {
    method: "GET",
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}



// ...existing functions...

export function updateUserProfile(profileData) {
  return fetchWithResponse('profile/', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(profileData)
  })
}
