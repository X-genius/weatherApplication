/**
 * Declare Variable
 */
const wrapper = document.querySelector('.wrapper');
const inputPartInWrapper = wrapper.querySelector('.input-part');
const informationText = inputPartInWrapper.querySelector('.info-txt');
const inputValue = inputPartInWrapper.querySelector('input');
const locationOnButton = inputPartInWrapper.querySelector('button');
const weatherIcon = document.querySelector('.weather-part img');
const backArrow = wrapper.querySelector('header i');
const firstString = '6444c984d63bb9474';
const secondString = 'db0cf4ae2f6058b';
const key =  firstString + secondString;

/**
 * Enter Some input in input field
 */

inputValue.addEventListener('keypress', (event) => {
  if (event.key === 'Enter' && inputValue.value !== '') {
    requestToWeatherAPI(inputValue.value);
    inputValue.blur();
  }
});

/**
 * Click Button and find location
 */
locationOnButton.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(OnSuccess, OnError);
  } else {
    alert('Your browser not find out your current location...');
  }
});

/**
 * Back Arrow Button
 */
backArrow.addEventListener('click', () => {
  wrapper.classList.remove('active');
});

/**
 * Integrate Weather API
 */

const requestToWeatherAPI = (cityName) => {
  const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${key}`;
  fetchData(weatherAPI);
};

const OnSuccess = (position) => {
  const { latitude, longitude } = position.coords;
  const latLongAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}`;
  fetchData(latLongAPI);
};

const OnError = (error) => {
  informationText.innerHTML = error.message;
  informationText.classList.add('error');
};

/**
 * Fetch Data
 */

const fetchData = (api) => {
  informationText.innerHTML = 'Getting Weather Details....';
  informationText.classList.add('pending');
  fetch(api).then((response) => {
    response.json().then((result) => {
      weatherDetails(result);
    });
  });
};

/**
 * Weather Information
 */

const weatherDetails = (information) => {
  if (information.cod === '404') {
    informationText.classList.replace('pending', 'error');
    informationText.innerHTML = `${inputValue.value} isn't a valid city name`;
  } else {
    const city = information.name;
    const country = information.sys.country;
    const { description, id } = information.weather[0];
    const { feels_like, humidity, temp } = information.main;

    if (id === 800) {
      weatherIcon.src = '/images/Weather Icons/clear.svg';
    } else if (id >= 200 && id <= 232) {
      weatherIcon.src = '/images/Weather Icons/storm.svg';
    } else if (id >= 600 && id <= 622) {
      weatherIcon.src = '/images/Weather Icons/snow.svg';
    } else if (id >= 701 && id <= 781) {
      weatherIcon.src = '/images/Weather Icons/haze.svg';
    } else if (id >= 801 && id <= 804) {
      weatherIcon.src = '/images/Weather Icons/cloud.svg';
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      weatherIcon.src = '/images/Weather Icons/rain.svg';
    }

    wrapper.querySelector('.weather-part .temp .numb').innerHTML =
      Math.ceil(temp);
    wrapper.querySelector('.weather-part .weather').innerHTML = description;
    wrapper.querySelector(
      '.weather-part .location span'
    ).innerHTML = `${city}, ${country}`;
    wrapper.querySelector(
      '.weather-part .bottom-details .details .temp .numb-2'
    ).innerHTML = Math.ceil(feels_like);
    wrapper.querySelector(
      '.weather-part .bottom-details .humidity .details span'
    ).innerHTML = `${humidity}%`;

    setTimeout(() => {
      informationText.classList.remove('pending', 'error');
      informationText.innerHTML = '';
      inputValue.value = '';
      wrapper.classList.add('active');
    }, 800);
  }
};
