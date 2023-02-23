const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const WEATHER_ICON_PREFIX_URL = "./assets/weather-icons/";
const API_KEY = "69518b1f8f16c35f8705550dc4161056";

async function handleWeather() {
  const search = document.querySelector(".searchBar");
  const city = search.querySelector(".citySearch").value;

  const date = new Date();
  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  });
  const formattedDate = formatter.format(date);

  const loader = document.querySelector(".loading");

  document.querySelector(
    ".cityName"
  ).innerHTML = `Weather in ${city.toUpperCase()} at ${formattedDate}`;
  search.style.top = "0";
  loader.classList.add("display");
  const [weather, forecast] = await Promise.all([
    getWeather(city),
    getForecast(city),
  ]);

  loader.classList.remove("display");
  if (weather.cod !== 200 || forecast.cod !== "200") {
    handleError(weather);
    return;
  }

  document.querySelector(".weather").style.opacity = 1;
  document.querySelector(".forecast").style.opacity = 1;

  showWeather(weather);
  showForecast(forecast);
}

async function getWeather(city) {
  const data = await fetch(
    `${WEATHER_URL}?appid=${API_KEY}&units=metric&q=${city}`
  );
  return await data.json();
}

async function getForecast(city) {
  const data = await fetch(
    `${FORECAST_URL}?appid=${API_KEY}&units=metric&q=${city}`
  );
  return await data.json();
}

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

function getWeatherIconUrl(iconCode) {
  return `./assets/weather-icons/${iconCode}.png`;
}

function showForecast(forecast) {
  let table = "";
  forecast.list.forEach((f) => {
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
    table += `<div><img src="${getWeatherIconUrl(f.weather[0].icon)}" /></div>`;
    table += `<div>${f.weather[0].description}</div>`;
    table += `<div>${Math.round(f.main.temp)} &#8451</div>`;
  });
  document.querySelector(".forecastTable").innerHTML = table;
}

function handleError({ cod, message }) {
  alert(`Something went wrong: ${cod} - ${message}`);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleWeather();
  }
});
