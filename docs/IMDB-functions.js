// CREATING OVERALL SHOW CHART
// Fetches data for each season and returns an array with each seasons name and average rating
const generateShowData = async (showToFind, showData) => {
    let seasonArr = []

    for (let i = 0; i < showData.totalSeasons; i++) {
        await getSeason(showToFind, i + 1).then((seasonData) => {
            let avgRating = getAverageSeasonRating(seasonData)
            seasonArr.push({
                seasonNumber: i+1,
                rating: avgRating
            })
        }).catch((error) => {
            console.log(`Error: ${error}`)
        })
    }
    return seasonArr
}

// Adds data to the chart for overall season ratings for each season
const generateShowGraph = (seasonArr) => {
    seasonArr.forEach((season) => {
        addData(myChart, `Season ${season.seasonNumber}`, season.rating, 0)
    })
    generateShowTrendLine(seasonArr)
}


// Returns the average rating of all episodes in a season
function getAverageSeasonRating(season) {
    let totalRating = 0
    let numberOfEpisodesWithRatings = 0
    season.Episodes.forEach((episode) => {
        if (!isNaN(episode.imdbRating)) {
            totalRating += Number(episode.imdbRating)
            numberOfEpisodesWithRatings++
        } 
    })
    return totalRating / numberOfEpisodesWithRatings
}


// CREATING SEASON CHART and DOM
// Creates the DOM for seasons and their checkboxes
const renderSeasonsDom = (showToFind, showData) => {
    seasonsEl.textContent = ""
    for (let i = 0; i < showData.totalSeasons; i++) {
        seasonsEl.appendChild(generateSeasonDom(i+1, showToFind, showData))
    }
}
// Get the DOM elements for each season in a show
const generateSeasonDom = (element, showToFind, showData) => {
    let seasonEl = document.createElement("div")

    let seasonCheck = document.createElement("input")
    seasonCheck.setAttribute("type", "checkbox")
    seasonCheck.addEventListener("change", (e) => {
        if (e.target.checked) {
            UnSelectAllExcept(element-1)
            let seasonChosen = element
            getSeason(showToFind, seasonChosen).then((seasonData) => {
                removeAllData(myChart)
                generateSeasonData(seasonData)
                generateSeasonTrendLine(seasonData)
            }).catch((error) => {
                console.log(`Error: ${error}`)
            })
        } else {
            removeAllData(myChart)
            generateShowData(showToFind, showData).then((result) => {
                generateShowGraph(result)
            })
        }
    })

    let seasonText = document.createElement("span")
    seasonText.textContent = `Season ${element}`
    let space = document.createElement("span")
    space.textContent = ' '

    seasonEl.appendChild(seasonCheck)
    seasonEl.appendChild(space)
    seasonEl.appendChild(seasonText)
    return seasonEl
}
// Adds individual episode data to the chart
function generateSeasonData(season) {
    season.Episodes.forEach(element => {
        addData(myChart, `${element.Title}`, element.imdbRating, 0)
    })
}
// Unselects all children in seasonsEl except the checkbox which was just checked
function UnSelectAllExcept(int) {
    let items = seasonsEl.children
    for (let i = 0; i < items.length; i++) {
        if (int !== i){
            items[i].children[0].checked = false
        }
    }
}	



// TRENDLINE FUNCTIONS
// Adds data to the chart for show trendline
function generateShowTrendLine(listOfSeasons) {
    let trendLineData = getTrendLineDataPoints(listOfSeasons)
    for (let i = 0; i < trendLineData.numberOfPoints; i++) {
        let y = trendLineData.offset + (trendLineData.slope * (i + 1))
        addData(myChart, "", y, 1)
    }
}
// Adds data to the chart for an individual season trendline
function generateSeasonTrendLine(season) {
    let episodeArr = []
    season.Episodes.forEach((episode) => {
        episodeArr.push({
            rating: Number(episode.imdbRating)
        })
    })
    let trendLineData = getTrendLineDataPoints(episodeArr)
    for (let i = 0; i < trendLineData.numberOfPoints; i++) {
        let y = trendLineData.offset + (trendLineData.slope * (i + 1))
        addData(myChart, "", y, 1)
    }
}
// Creates the trendline data based on list of objects' ratings
// Returns an object with the number of points, the slope and the Y-intercept 
function getTrendLineDataPoints(dataArr) {
    let sumXY = 0
    let sumX = 0
    let sumXsqr = 0
    let sumY = 0
    for (let i = 0; i < dataArr.length; i++) {
        if (isNaN(dataArr[i].rating)) {
            dataArr.splice(i, 1)
        } else {
            sumXY += (dataArr[i].rating * (i + 1))
            sumX += (i + 1)
            sumY += dataArr[i].rating
            
            sumXsqr += ((i + 1) * (i + 1))
        }
    }

    let slope = ((dataArr.length * sumXY) - (sumX * sumY)) / (dataArr.length * sumXsqr - (sumX * sumX))
    let offset = (sumY - (slope * sumX)) / dataArr.length
    return {
        numberOfPoints: dataArr.length,
        slope: slope,
        offset: offset
    }
}


// CHART MODIFICATION
function addData(chart, label, data, dataset) {
    if (label !== ""){
        chart.data.labels.push(label);
    }
    chart.data.datasets[dataset].data.push(data)
    chart.update();
}
function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
function removeAllData(chart) {
    while(chart.data.labels.length) {
        removeData(chart)
    }
}