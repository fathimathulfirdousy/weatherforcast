const mainbox = document.querySelector('.mainbox');
const search = document.querySelector('.searchbox button');
const weatherbox = document.querySelector('.weatherbox');
const weatherdetails = document.querySelector('.weatherdetails');
const error404 = document.querySelector('.notfound');
const forecastContainer = document.querySelector('.weather-card');

// Function to display current date
function displayCurrentDate() {
    const dateElement = document.createElement('div');
    dateElement.classList.add('current-date');
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    dateElement.innerHTML = `Today is ${formattedDate}`;
    mainbox.prepend(dateElement); // Add the date at the top of the mainbox
}

// Call the function to display the date when the page loads
displayCurrentDate();

search.addEventListener('click', () => {
    const APIKey = '018a15dac3b3d41c159a7fb52d48ef45';
    const city = document.querySelector('.searchbox input').value.trim();

    if (city === '') return;

    // Fetch current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {

            if (json.cod == '404') {
                mainbox.style.height = '400px';
                weatherbox.classList.remove('active');
                weatherdetails.classList.remove('active');
                error404.classList.add('active');
                
                forecastContainer.innerHTML = ''; // Clear previous forecasts
                const errorMessage = document.createElement('li');
                errorMessage.classList.add('card');
                errorMessage.innerHTML = `<h3>Oops! 5-day forecast not available.</h3>`;
                forecastContainer.appendChild(errorMessage);

                return;
            }

            mainbox.style.height = '500px';
            weatherbox.classList.add('active');
            weatherdetails.classList.add('active');
            error404.classList.remove('active');

            // Update the current weather data
            const image = document.querySelector('.weatherbox img');
            const temperature = document.querySelector('.weatherbox .temp');
            const description = document.querySelector('.weatherbox .desc');
            const humidity = document.querySelector('.weatherdetails .humidity span');
            const wind = document.querySelector('.weatherdetails .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'clear.png';
                    break;
                case 'Rain':
                    image.src = 'rain.png';
                    break;
                case 'Snow':
                    image.src = 'snow.png';
                    break;
                case 'Clouds':
                    image.src = 'cloud.png';
                    break;
                case 'Mist':
                    image.src = 'mist.png';
                    break;
                case 'Haze':
                    image.src = 'cloud.png';
                    break;
                default:
                    image.src = '404.png';
                    break;
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>℃</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${(json.wind.speed * 3.6).toFixed(1)}Km/h`;

            // Fetch the 5-day forecast
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`)
                .then(response => response.json())
                .then(forecastJson => {
                    if (forecastJson.cod === "404") {
                        forecastContainer.innerHTML = ''; // Clear previous forecasts
                        const errorMessage = document.createElement('li');
                        errorMessage.classList.add('card');
                        errorMessage.innerHTML = `<h3>Oops! 5-day forecast not available.</h3>`;
                        forecastContainer.appendChild(errorMessage);
                    } else {
                        updateForecast(forecastJson);
                    }
                });

        });
});

// Function to update the 5-day forecast
function updateForecast(forecastJson) {
    forecastContainer.innerHTML = ''; // Clear previous forecasts

    // Get forecasts for the same time each day (e.g., 12:00)
    const dailyForecasts = forecastJson.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString();
        const temp = day.main.temp;
        const weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        const description = day.weather[0].description;
        const windSpeed = (day.wind.speed * 3.6).toFixed(1); // Convert from m/s to km/h
        const humidity = day.main.humidity;

        // Create forecast card
        const forecastCard = `
            <li class="card">
                <h3>${date}</h3>
                <img src="${weatherIcon}" alt="weather-icon">
                <h4>Temperature: ${temp}℃</h4>
                <h4>Wind: ${windSpeed} Km/h</h4>
                <h4>Humidity: ${humidity}%</h4>
            </li>
        `;

        // Append the forecast card to the container
        forecastContainer.innerHTML += forecastCard;
    });
}
