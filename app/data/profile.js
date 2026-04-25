import fetchWithResponse from "./fetcher"

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

// Add this function to your auth.js file
// export function updateUserProfile(profileData) {
//   return fetchWithResponse('auth/user/', {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Token ${localStorage.getItem('token')}`
//     },
//     body: JSON.stringify(profileData)
//   })
// }