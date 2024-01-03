localStorage.clear();


function findCity() {
    var cityName = titleCase($("#cityName")[0].value.trim());


    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";


    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {


                $("#city-name")[0].textContent = cityName + " (" + moment().format('M/D/YYYY') + ")";


                $("#city-list").append('<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' + cityName);


                const lat = data.coord.lat;
                const lon = data.coord.lon;


                var latLonPair = lat.toString() + " " + lon.toString();


                localStorage.setItem(cityName, latLonPair);


                apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";


                fetch(apiURL).then(function (newResponse) {
                    if (newResponse.ok) {
                        newResponse.json().then(function (newData) {
                            getCurrentWeather(newData);
                        })
                    }
                })
            })
        } else {
            alert("Cannot find city!");
        }
    })
}
