// Variables for accessing elements on the page
var searchButtonEl = $("#searchButton");
var searchInputEl = $("#searchInput");
var searchedCitiesListEl = $("#searched-cities-list");

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
});