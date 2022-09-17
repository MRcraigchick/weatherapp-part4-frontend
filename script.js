window.onload = async () => {
  const localWeather = await getLocalWeatherData();
  console.log(localWeather);
  document.querySelector('#currentPos').innerHTML += `
			<div class="cityContainer">
				<p id="currentPosName">${localWeather.currentPosWeather.cityName}</p>
				<p id="currentPosDescription">${localWeather.currentPosWeather.description}</p>
				<img class="weatherIcon" src="images/${localWeather.currentPosWeather.main}.png"/>
				<div class="temperature">
					<p id="currentPosTempMin">${localWeather.currentPosWeather.tempMin}°C</p>
					<span>-</span>
					<p id="currentPosTempMax">${localWeather.currentPosWeather.tempMax}°C</p>
				</div>
				<button class="deleteCity" id="${localWeather.currentPosWeather.cityName}">Delete</button>
			</div>
					`;
  updateDeleteCityEventListener();
  document.querySelector('#cityNameInput').value = '';
};
async function getLocalWeatherData() {
  console.log('hez');
  const res = await fetch('https://weatherapp-part4-backend.vercel.app/weather');
  const data = res.json();
  return data;
}

function updateDeleteCityEventListener() {
  for (let i = 0; i < document.querySelectorAll('.deleteCity').length; i++) {
    document.querySelectorAll('.deleteCity')[i].addEventListener('click', function () {
      fetch(`http://localhost:3000/weather/${this.id}`, { method: 'DELETE' })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            this.parentNode.remove();
          }
        });
    });
  }
}

document.querySelector('#addCity').addEventListener('click', function () {
  const cityName = document.querySelector('#cityNameInput').value;

  fetch('http://localhost:3000/weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cityName }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.result) {
        document.querySelector('#cityList').innerHTML += `
			<div class="cityContainer">
				<p class="name">${data.weather.cityName}</p>
				<p class="description">${data.weather.description}</p>
				<img class="weatherIcon" src="images/${data.weather.main}.png"/>
				<div class="temperature">
					<p class="tempMin">${data.weather.tempMin}°C</p>
					<span>-</span>
					<p class="tempMax">${data.weather.tempMax}°C</p>
				</div>
				<button class="deleteCity" id="${data.weather.cityName}">Delete</button>
			</div>
					`;
        updateDeleteCityEventListener();
        document.querySelector('#cityNameInput').value = '';
      }
    });
});
