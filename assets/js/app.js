// Variables for accessing elements on the page
var searchButtonEl = $("#searchButton");
var searchInputEl = $("#searchInput");
var searchedCitiesListEl = $("#searched-cities-list");
var todaysWeatherEl = $("#todays-weather");
var API_KEY = "3693a2a576a9f86b3d300687b396e588";

// List of already searched cities
var searchCitiesList = [];

// Function to normalize city names
// e.g. SAN FRANCISCO become San Francisco
function normalizeCityName(cityName) {
    // Convert all letters to lower case and split into words
    var normalized = cityName.toLowerCase().split(" ");
    // Capitalize first letter in each word
    for (var idx = 0; idx < normalized.length; idx++) {
        normalized[idx] = normalized[idx][0].toUpperCase() + normalized[idx].slice(1);
    }
    // Return as one string
    return normalized.join(" ");
}

// Display a list of already searched cities
function displaySearchedCities() {
    // Remove the old city list
    searchedCitiesListEl.empty();
    for (var idx = 0; idx < searchCitiesList.length; idx++) {
        var cityListEl = $("<li>");
        cityListEl.text(searchCitiesList[idx]);
        // Add the bootstrap class
        cityListEl.addClass("list-group-item");
        searchedCitiesListEl.append(cityListEl);
    }
}

// Get the weather for a city
function getWeatherForCity(city) {
    // Encode the URI to escape spaces in the city
    var requestUrl = encodeURI('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + API_KEY + '&units=imperial');

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var todaysDate = moment(data.dt, "X").format("MM-DD-YYYY");
            var icon = data.weather.icon;
            var iconDescription = data.weather.description;
            todaysWeatherEl.empty();
            var cityAndDateEl = $("<h1>");
            cityAndDateEl.text(city + " (" + todaysDate + ")");
            todaysWeatherEl.append(cityAndDateEl);
            var tempEl = $("<div>");
            tempEl.text("Temp: " + data.main.temp + "°F");
            todaysWeatherEl.append(tempEl);
            var windEl = $("<div>");
            windEl.text("Wind: " + data.wind.speed + " MPH");
            todaysWeatherEl.append(windEl);
            var humidityEl = $("<div>");
            humidityEl.text("Humidity: " + data.main.humidity + " %");
            todaysWeatherEl.append(humidityEl);
            // Show the card
            // Get the UV index and 5 day forecase
            requestUrl = encodeURI("https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=hourly&appid=" + API_KEY);
            console.log(requestUrl);
            return fetch(requestUrl);
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var uviEl = $("<div>");
            uviEl.text("UV Index: " + data.current.uvi);
            todaysWeatherEl.append(uviEl);
            todaysWeatherEl.show();
        });
}

// Click handler for the search button
searchButtonEl.on("click", function() {
    var city = searchInputEl.val();
    if (!city) {
        // No value entered for the city
        return;
    }
    city = normalizeCityName(city);

    if (searchCitiesList.indexOf(city) === -1) {
        // New city so add it to the search list
        searchCitiesList.push(city);
        // Keep the list in sorted order
        searchCitiesList.sort();
        // Display the list of cities
        displaySearchedCities();
    }

    // Clear the input field's value
    searchInputEl.val("");
    getWeatherForCity(city);
});