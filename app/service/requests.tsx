export const getAnimeById = (id: string) => {
    let a = fetch(`https://api.jikan.moe/v4/anime/${id}`)
    .then(response => response.json());
    return a
};


export const getAnime = (arg: string) => {
  if (arg.length == 0) {
    return fetch(`https://api.jikan.moe/v4/anime`)
      .then(response => response.json());
  }
  else {

    return fetch(`https://api.jikan.moe/v4/anime?${arg}`)
      .then(response => response.json());
  }
};