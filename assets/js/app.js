// Variables for accessing elements on the page
var searchButtonEl = $("#searchButton");
var searchInputEl = $("#searchInput");
var searchedCitiesListEl = $("#searched-cities-list");
var todaysWeatherEl = $("#todays-weather");
var API_KEY = "";

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
            var icon = data.weather[0].icon;
            var iconDescription = data.weather[0].description;
            todaysWeatherEl.empty();
            var cityAndDateEl = $("<h1>");
            cityAndDateEl.text(city + " (" + todaysDate + ")");
            // Add the image to the icon for the weather
            // The link has a form: http://openweathermap.org/img/wn/10d@2x.png
            var weatherImageEl = $("<img>");
            weatherImageEl.attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
            weatherImageEl.attr("alt", iconDescription);
            cityAndDateEl.append(weatherImageEl);
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
            return fetch(requestUrl);
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var uvi = parseFloat(data.current.uvi);
            if (!isNaN(uvi)) {
                var uviEl = $("<div>");
                uviEl.text("UV Index: ");
                var uviValueEl = $("<span>");
                uviValueEl.text(uvi);
                /* Set the styling for the UV index value based on whether conditions are favorable, moderate, or severe */
                if (uvi <= 2) {
                    uviValueEl.addClass("favorable-uvi");
                } else if (uvi <= 5) {
                    uviValueEl.addClass("moderate-uvi");
                } else {
                    uviValueEl.addClass("severe-uvi");
                }
                uviValueEl.addClass("uvi");
                uviEl.append(uviValueEl);
                todaysWeatherEl.append(uviEl);
                todaysWeatherEl.show();
            } else {
                console.log("Unable to parse uvi value: " + data.current.uvi);
            }
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