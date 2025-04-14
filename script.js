// DOM elements
const container = document.querySelector('.container');
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const errorMessage = document.querySelector('.error-message');

const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key

// Event listener for search button
searchButton.addEventListener('click', () => {
    getWeatherData();
});

// Event listener for Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeatherData();
    }
});

// Function to get weather data
function getWeatherData() {
    const city = searchInput.value.trim();
    
    if (city === '') return;
    
    // Show a loading state or message (optional)
    errorMessage.style.display = 'none';
    weatherBox.style.display = 'none';
    weatherDetails.style.display = 'none';
    
    // API URL with city name and API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    console.log("Requesting weather for:", city);
    console.log("API URL (without key):", apiUrl.replace(apiKey, "API_KEY_HIDDEN"));
    
    // Fetch data from OpenWeather API
    fetch(apiUrl)
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('API key is invalid or not activated yet');
                } else if (response.status === 404) {
                    throw new Error('City not found');
                } else {
                    throw new Error(`API error: ${response.status}`);
                }
            }
            return response.json();
        })
        .then(data => {
            console.log("Weather data received:", data);
            // Hide error message if it was previously shown
            errorMessage.style.display = 'none';
            
            // Display weather information
            displayWeatherData(data);
        })
        .catch(error => {
            // Show error message
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
            errorMessage.style.display = 'block';
            
            // Update error message with more specific information
            const errorText = document.querySelector('.error-message p');
            errorText.textContent = error.message || 'City not found. Please try again with a valid city name.';
            
            console.error('Error:', error);
        });
}

// Function to display weather data
function displayWeatherData(data) {
    // Show weather elements
    weatherBox.style.display = 'block';
    weatherDetails.style.display = 'flex';
    
    // Location and date
    const locationElement = document.querySelector('.location');
    const dateElement = document.querySelector('.date');
    locationElement.textContent = `${data.name}, ${data.sys.country}`;
    
    // Current date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('en-US', options);
    
    // Weather icon
    const weatherIcon = document.querySelector('.weather-box img');
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    // Temperature
    const temperatureElement = document.querySelector('.temperature');
    const temperature = Math.round(data.main.temp);
    temperatureElement.textContent = `${temperature}°C`;
    
    // Weather description
    const descriptionElement = document.querySelector('.description');
    descriptionElement.textContent = data.weather[0].description;
    
    // Humidity
    const humidityElement = document.getElementById('humidity-value');
    humidityElement.textContent = `${data.main.humidity}%`;
    
    // Wind speed
    const windSpeedElement = document.getElementById('wind-speed');
    windSpeedElement.textContent = `${data.wind.speed} m/s`;
}
