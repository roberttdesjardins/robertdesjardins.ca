const getShow = async (showToFind) => {
    const response = await fetch(`http://www.omdbapi.com/?apikey=e9aeaf84&t=${showToFind}`)
    if (response.status === 200) {
        return data = await response.json()
    } else {
        throw new Error("An error has taken place when getting show data")
    }
}

const getSeason = async (showToFind, seasonChosen) => {
    const response = await fetch(`http://www.omdbapi.com/?apikey=e9aeaf84&t=${showToFind}&Season=${seasonChosen}`)
    if (response.status === 200) {
        return data = await response.json()
    } else {
        throw new Error("An error has taken place when getting season data")
    }
}