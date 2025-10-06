const apiKey = "968f4919aaca76d8b4663f55bf8a2fa1"; // Your API key
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city name");

  getCurrentWeather(city);
  getForecast(city);
  getDailySummary(city);
});

// Fetch current weather
function getCurrentWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if(data.cod === "404") return alert("City not found");

      document.getElementById("cityName").innerText = `${data.name}, ${data.sys.country}`;
      document.getElementById("temp").innerText = `Temperature: ${data.main.temp} °C`;
      document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
      document.getElementById("wind").innerText = `Wind Speed: ${data.wind.speed} m/s`;
      document.getElementById("description").innerText = data.weather[0].description;
      document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

      // Dynamic background
      const weatherMain = data.weather[0].main.toLowerCase();
      const body = document.body;

      if(weatherMain.includes("cloud")) {
        body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
      } else if(weatherMain.includes("rain")) {
        body.style.background = "linear-gradient(to right, #4e54c8, #8f94fb)";
      } else if(weatherMain.includes("clear")) {
        body.style.background = "linear-gradient(to right, #fbc2eb, #a6c1ee)";
      } else if(weatherMain.includes("snow")) {
        body.style.background = "linear-gradient(to right, #e0eafc, #cfdef3)";
      } else {
        body.style.background = "linear-gradient(to right, #6dd5fa, #2980b9)";
      }
    })
    .catch(err => console.error(err));
}

// Fetch 3-hour forecast
function getForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const forecastDiv = document.getElementById("forecast");
      forecastDiv.innerHTML = "";

      data.list.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <p>${item.dt_txt}</p>
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="">
          <p>${item.main.temp} °C</p>
          <p>${item.weather[0].description}</p>
        `;
        forecastDiv.appendChild(card);
      });
    })
    .catch(err => console.error(err));
}

// Fetch 5-day daily summary
function getDailySummary(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const dailyDiv = document.getElementById("dailySummary");
      dailyDiv.innerHTML = "";

      for(let i = 0; i < data.list.length; i += 8) { // every 24 hours
        const item = data.list[i];
        const card = document.createElement("div");
        card.className = "card";
        const date = new Date(item.dt_txt);
        card.innerHTML = `
          <p>${date.toDateString()}</p>
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="">
          <p>${item.main.temp} °C</p>
          <p>${item.weather[0].description}</p>
        `;
        dailyDiv.appendChild(card);
      }
    })
    .catch(err => console.error(err));
}
