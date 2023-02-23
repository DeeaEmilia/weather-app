// The API endpoints
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// The URL prefix for the weather icons
const WEATHER_ICON_PREFIX_URL = "./assets/weather-icons/";

// The API key for the OpenWeatherMap API
const API_KEY = "69518b1f8f16c35f8705550dc4161056";

//TODO This function handles the logic for fetching and displaying weather data
async function handleWeather() {
  // Get the user's search query from the input field
  const search = document.querySelector(".searchBar");
  const city = search.querySelector(".citySearch").value;
  // Format the current date and time for display
  const date = new Date();
  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  });
  const formattedDate = formatter.format(date);
  // Show a loading indicator and update the city name display
  const loader = document.querySelector(".loading");
  document.querySelector(
    ".cityName"
  ).innerHTML = `Weather in ${city.toUpperCase()} at ${formattedDate}`;
  search.style.top = "0";
  loader.classList.add("display");
  // Get the weather and forecast data for the specified city
  const [weather, forecast] = await Promise.all([
    getWeather(city),
    getForecast(city),
  ]);
  // Hide the loading indicator
  loader.classList.remove("display");
  // If the weather or forecast data is not available, show an error message and return
  if (weather.cod !== 200 || forecast.cod !== "200") {
    handleError(weather);
    return;
  }
  // Otherwise, display the weather and forecast data
  document.querySelector(".weather").style.opacity = 1;
  document.querySelector(".forecast").style.opacity = 1;
  showWeather(weather);
  showForecast(forecast);
}

//TODO This function retrieves the current weather data for the specified city
async function getWeather(city) {
  const data = await fetch(
    `${WEATHER_URL}?appid=${API_KEY}&units=metric&q=${city}`
  );
  return await data.json();
}

//TODO This function retrieves the weather forecast for the specified city
async function getForecast(city) {
  const data = await fetch(
    `${FORECAST_URL}?appid=${API_KEY}&units=metric&q=${city}`
  );
  return await data.json();
}

//TODO This function displays the weather data for the specified city
function showWeather(weather) {
  const weatherIcon = document.querySelector(".weatherIcon");
  const degrees = document.querySelector(".degrees");
  const feelsLike = document.querySelector(".feelsLike");
  const tempMin = document.querySelector(".tempMin");
  const tempMax = document.querySelector(".tempMax");
  const wind = document.querySelector(".wind");
  const humidity = document.querySelector(".humidity");
  const pressure = document.querySelector(".pressure");

  weatherIcon.src = getWeatherIconUrl(weather.weather[0].icon);
  degrees.innerHTML = `${Math.round(weather.main.temp)} &#8451`;
  feelsLike.innerHTML = `Feels like ${Math.round(
    weather.main.feels_like
  )} &#8451`;
  tempMin.innerHTML = `Min temp ${Math.round(weather.main.temp_min)} &#8451`;
  tempMax.innerHTML = `Max temp ${Math.round(weather.main.temp_max)} &#8451`;
  wind.innerHTML = `Wind speed: ${weather.wind.speed} m/s`;
  humidity.innerHTML = `Humidity: ${weather.main.humidity}%`;
  pressure.innerHTML = `ATM: ${weather.main.pressure} hPa`;
}

//TODO This function returns the URL for the weather icon with the specified icon code
function getWeatherIconUrl(iconCode) {
  return `./assets/weather-icons/${iconCode}.png`;
}

//TODO This function displays the weather forecast for the specified city
function showForecast(forecast) {
  let table = "";
  forecast.list.forEach((f) => {
    // Parse the date and time information from the forecast data
    const hour = f.dt_txt.substring(11, 16);
    const year = f.dt_txt.substring(0, 4);
    const month = f.dt_txt.substring(5, 7);
    const day = f.dt_txt.substring(8, 10);
    const weekDay = new Date(Date.UTC(year, month - 1, day));
    table += `<div>${weekDay.toLocaleDateString("en", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })} - ${hour}</div>`;
    // Add the forecast data to the table
    table += `<div><img src="${getWeatherIconUrl(f.weather[0].icon)}" /></div>`;
    table += `<div>${f.weather[0].description}</div>`;
    table += `<div>${Math.round(f.main.temp)} &#8451</div>`;
  });
  document.querySelector(".forecastTable").innerHTML = table;
}

//TODO This function displays an error message if there was a problem retrieving the weather data
function handleError({ cod, message }) {
  alert(`Something went wrong: ${cod} - ${message}`);
}

//TODO Handle the "Enter" key press event to trigger the weather search
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleWeather();
  }
});
