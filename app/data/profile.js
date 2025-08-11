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