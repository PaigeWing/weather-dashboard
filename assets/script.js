var citySearchHistory = [];
var weatherApiUrl =
  "https://api.openweathermap.org/data/2.5/weather?id=524901&appid=3ca3ddd51d254660450284e7e2b87763";
// "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";
var weatherApiKey = "3ca3ddd51d254660450284e7e2b87763";

//DOM elements
var searchForm = document.getElementById("search-form");
var searchInput = document.getElementById("search-input");
var searchSubmit = document.getElementById("search-submit");
// var searchHistory = document.getElementById("history-container");
var todayInfo = document.getElementById("today-content");
var forecastInfo = document.getElementById("forecast-container");

//Display CURRENT weather from OpenWeather API
function displayCurrentWeatherAPI(city, weather) {
  var date = dayjs().format("M/D/YYYY");

  //Variables to use later in displaying
  var temp = weather.main.temp;
  var humidity = weather.main.humidity;
  var wind = weather.main.speed;

  //Variables for making current weather card
  var weatherCard = document.createElement("div");
  weatherCard.setAttribute("class", "card");

  // var cardBody = document.createElement("div");
  var heading = document.createElement("h2");
  heading.setAttribute("class", "heading");
  heading.textContent = `${city} , ${date}`;

  var tempEl = document.createElement("p");
  tempEl.setAttribute("class", "temp");
  tempEl.textContent = `${temp}`;

  var windEl = document.createElement("p");
  windEl.setAttribute("class", "wind");
  windEl.textContent = `${wind}`;

  var humidityEl = document.createElement("p");
  humidityEl.setAttribute("class", "humidity");
  humidityEl.textContent = `${humidity}`;

  weatherCard.append(heading, tempEl, windEl, humidityEl);
  todayInfo.innerHTML = "";
  todayInfo.append(weatherCard);
}

//Display forecast in card
function displayForecastCard(forecast) {
  //Variables to use later in displaying
  var temp = forecast.main.temp;
  var humidity = forecast.main.humidity;
  var wind = forecast.main.speed;

  //Variables for making forecast cards
  var section = document.createElement("div");
  section.classList.add("column-section");

  var forecastCard = document.createElement("div");
  forecastCard.classList.add("card");

  var heading = document.createElement("h3");
  heading.classList.add("heading");
  heading.textContent = dayjs(forecast.dt_txt).format("M/D/YYYY");

  var tempEl = document.createElement("p");
  tempEl.classList.add("temp");
  tempEl.textContent = `${temp} °F`;

  var windEl = document.createElement("p");
  windEl.classList.add("wind");
  windEl.textContent = `${wind} MPH`;

  var humidityEl = document.createElement("p");
  humidityEl.classList.add("humidity");
  humidityEl.textContent = `${humidity} %`;

  section.append("forecastCard");
  forecastCard.append("heading", "tempEl", "windEl", "humidityEl");
}

//Display Forecast on page
function displayForecast(dayForecast) {
  for (var i = 0; i < dayForecast.length; i++) {
    displayForecastCard(dayForecast[i]);
  }
}

//Calling weather and forecast functions to show on page
function showItems(city, data) {
  displayCurrentWeatherAPI(city);
  displayForecast(data);
}

//Fetches weather for search location
function fetchWeather(location) {
  var { lat } = location;
  var { lon } = location;
  var city = location.name;

  var apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      renderItems(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}

function fetchCoordinates(search) {
  var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert("Location not found");
      } else {
        fetchWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

//City search submission
function searchForm(event) {
  event.preventDefault();
  var search = searchInput.value.trim();

  if (!searchInput.value) {
    alert("Please enter a city");
    return;
  }

  fetchCoordinates(search);
  searchInput.value = "";
}

searchForm.addEventListener("submit", searchForm);
