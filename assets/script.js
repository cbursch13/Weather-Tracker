//Clears local storage when page is loaded
localStorage.clear();

//Function to take the user searched city and pull weather data from Open Weather API 
function findCity() {
    //Stores input of city name in a variable triming spaces
    var cityName = titleCase($("#cityName")[0].value.trim());

    //Adds City name variable as an endpoint to Open Weather API
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

    //Function to run city name through API using current day and returning a string of city name and latitude/longitude
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                //Uses text content of city name id and adds current moment in time to city name variable
                $("#city-name")[0].textContent = cityName + " (" + moment().format('M/D/YYYY') + ")";

                //Appends searched city to page as a button
                $("#city-list").append('<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' + cityName);

                //Constants for coordinates from API
                const lat = data.coord.lat;
                const lon = data.coord.lon;

                //Variable that creates a string of latitude and longitude
                var latLonPair = lat.toString() + " " + lon.toString();

                //Adds city name and lat/long string to local storage for future reference
                localStorage.setItem(cityName, latLonPair);

                //Add latitude and longitude to end point of Open Weather API
                apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

                //Runs getCurrentWeather function if NewResponse function runs
                fetch(apiURL).then(function (newResponse) {
                    if (newResponse.ok) {
                        newResponse.json().then(function (newData) {
                            getCurrentWeather(newData);
                        })
                    }
                })
            })
        //Alerts user if city cannot be found in Open Weather API
        } else {
            alert("Cannot find city!");
        }
    })
}

//Adds coordinates arrays to end point of Open Weather API
function getListCity(coordinates) {
    apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&exclude=minutely,hourly&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

    //Runs getCurrentWeather function if response function runs
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                getCurrentWeather(data);
            })
        }
    })
}

//Get weather information and store in variable for future days of the week
function getFutureWeather(data) {
    for (var i = 0; i < 5; i++) {
        var futureWeather = {
            date: convertUnixTime(data, i),
            icon: "http://openweathermap.org/img/wn/" + data.daily[i + 1].weather[0].icon + "@2x.png",
            temp: data.daily[i + 1].temp.day.toFixed(1),
            humidity: data.daily[i + 1].humidity,
            wind_speed: data.daily[i + 1].wind_speed,
        }

        //Add weather information to the page for each id in the html file for each day of the week
        var currentSelector = "#day-" + i;
        $(currentSelector)[0].textContent = futureWeather.date;
        currentSelector = "#img-" + i;
        $(currentSelector)[0].src = futureWeather.icon;
        currentSelector = "#temp-" + i;
        $(currentSelector)[0].textContent = "Temp: " + futureWeather.temp + " \u2109";
        currentSelector = "#hum-" + i;
        $(currentSelector)[0].textContent = "Humidity: " + futureWeather.humidity + "%";
        currentSelector = "#wind-" + i;
        $(currentSelector)[0].textContent = "Wind Speed: " + futureWeather.wind_speed + " MPH";
    }
}
//Get weather information for current day
function getCurrentWeather(data) {
    $(".results-panel").addClass("visible");

//Add weather information for current day to page for each id from html file
    $("#currentIcon")[0].src = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
    $("#temperature")[0].textContent = "Temperature: " + data.current.temp.toFixed(1) + " \u2109";
    $("#humidity")[0].textContent = "Humidity: " + data.current.humidity + "% ";
    $("#wind-speed")[0].textContent = "Wind Speed: " + data.current.wind_speed.toFixed(1) + " MPH";

//Run getFutureWeather function
    getFutureWeather(data);
}

//Takes a string representing a city name as input and returns a new string where each word in the city name has its first letter capitalized, while the rest of the letters are in lowercase.
function titleCase(city) {
    var updatedCity = city.toLowerCase().split(" ");
    var returnedCity = "";
    for (var i = 0; i < updatedCity.length; i++) {
        updatedCity[i] = updatedCity[i][0].toUpperCase() + updatedCity[i].slice(1);
        returnedCity += " " + updatedCity[i];
    }
    return returnedCity;
}

//Changes unix time and converts into Javascript date object
function convertUnixTime(data, index) {
    const dateObject = new Date(data.daily[index + 1].dt * 1000);


    return (dateObject.toLocaleDateString());
}

//Runs find city search function when search button is clicked by user and doesnt refresh the page
$("#search-button").on("click", function (e) {
    e.preventDefault();


    findCity();


    $("form")[0].reset();
})

//Takes coordinates from local storage when city name button is clicked and runs get list city function to display weather of that city to the page
$(".city-list-box").on("click", ".city-name", function () {


    var coordinates = (localStorage.getItem($(this)[0].textContent)).split(" ");
    coordinates[0] = parseFloat(coordinates[0]);
    coordinates[1] = parseFloat(coordinates[1]);


    $("#city-name")[0].textContent = $(this)[0].textContent + " (" + moment().format('M/D/YYYY') + ")";


    getListCity(coordinates);
})
