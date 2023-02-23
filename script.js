const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const WEATHER_ICON_PREFIX_URL = 'https://openweathermap.org/img/w';
const API_KEY = '69518b1f8f16c35f8705550dc4161056';
// e un best practice sa salvam url-urile catre endpoint-uri in variabile
// const si cu all caps la nume

async function handleWeather() {
  const search = document.querySelector('.searchBar');
  const city = search.querySelector('.citySearch').value;
  const date = new Date().toLocaleTimeString('ro', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const loader = document.querySelector('.loading');

  document.querySelector(
    '.cityName',
  ).innerHTML = `Vremea in ${city.toUpperCase()} la ora ${date}`;
  search.style.top = '0';

  loader.classList.add('display');
  // await merge doar in functii async
  // const weather = await getWeather(city);
  // const forecast = await getForecast(city);

  // in felul asta pornim requesturile in acelasi timp
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  const [weather, forecast] = await Promise.all([
    getWeather(city),
    getForecast(city),
  ]);

  loader.classList.remove('display');
  if (weather.cod !== 200 || forecast.cod !== '200') {
    handleError(weather);
    return;
  }

  document.querySelector('.weather').style.opacity = 1;
  document.querySelector('.forecast').style.opacity = 1;

  showWeather(weather);
  showForecast(forecast);
}

async function getWeather(city) {
  const data = await fetch(
    `${WEATHER_URL}?appid=${API_KEY}&units=metric&q=${city}`,
  );
  // daca avem simboluri in query params putem folosi encodeURI()
  // `` - back ticks folosim pentru ca vrem sa scriem ceva dinamic,
  // ce e salvat in variabila de js, in url

  // daca folosim fetch e nevoie sa apelam .json() cu await
  return await data.json();
}

async function getForecast(city) {
  const data = await fetch(
    `${FORECAST_URL}?appid=${API_KEY}&units=metric&q=${city}`,
  );
  return await data.json();
}

function showWeather(weather) {
  const weatherIcon = document.querySelector('.weatherIcon');
  const degrees = document.querySelector('.degrees');
  const feelsLike = document.querySelector('.feelsLike');
  const tempMin = document.querySelector('.tempMin');
  const tempMax = document.querySelector('.tempMax');
  const wind = document.querySelector('.wind');
  const humidity = document.querySelector('.humidity');
  const pressure = document.querySelector('.pressure');

  weatherIcon.src = `${WEATHER_ICON_PREFIX_URL}/${weather.weather[0].icon}.png`;
  degrees.innerHTML = `${Math.round(weather.main.temp)} &#8451`;
  feelsLike.innerHTML = `Temperatura resimtita ${Math.round(
    weather.main.feels_like,
  )} &#8451`;
  tempMin.innerHTML = `Temperatura minima ${Math.round(
    weather.main.temp_min,
  )} &#8451`;
  tempMax.innerHTML = `Temperatura maxima ${Math.round(
    weather.main.temp_max,
  )} &#8451`;
  wind.innerHTML = `Viteza vantului ${weather.wind.speed} m/s`;
  humidity.innerHTML = `Umiditate ${weather.main.humidity} %`;
  pressure.innerHTML = `Presiunea atmosferica ${weather.main.pressure} bari`;
}

function showForecast(forecast) {
  let table = '';
  forecast.list.forEach((f) => {
    const hour = f.dt_txt.substring(11, 16);
    const year = f.dt_txt.substring(0, 4);
    const month = f.dt_txt.substring(5, 7);
    const day = f.dt_txt.substring(8, 10);
    const weekDay = new Date(Date.UTC(year, month - 1, day));
    table += `<div>${weekDay.toLocaleDateString('ro', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })} - ${hour}</div>`;
    table += `<div><img src="${WEATHER_ICON_PREFIX_URL}/${f.weather[0].icon}.png" /></div>`;
    table += `<div>${f.weather[0].description}</div>`;
    table += `<div>${Math.round(f.main.temp)} &#8451</div>`;
    // table += `<div>viteza vantului ${f.wind.speed}</div>`;
  });
  console.log(table);
  document.querySelector('.forecastTable').innerHTML = table;
}

function handleError({ cod, message }) {
  alert(`Ceva nu a mers bine: ${cod} - ${message}`);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleWeather();
  }
});
