const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container")

const grantAccessContainer = document.querySelector(".grantLocation-container");
const searchForm = document.querySelector("[ data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initially needed tabs 

let currentTab = userTab;
const API_KEY = "a0f922aeebe140f7fe92805848e64a63";
currentTab.classList.add("current-tab");
getFromSessionStorage();


function switchTab(clickedTab) {

    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        // kya search wla form invisible h agr hai to make it visible 
        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        // main pehle search wle tab me tha ab your weather wle tab me aana hai 
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab your weather pe aa hi gye to display kro weather ki instanceof,to uske liye check kro coordinates sessionStorage me hain ki nahi 
            getFromSessionStorage();
        }
    }

}

userTab.addEventListener("click", () => {
    // pass clicked tab as input parameter 
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    // pass clicked tab as input parameter 
    switchTab(searchTab);
})


// check if coordinates are already there in session storage 
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        // agr local coordinates nhi mile 
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat,longi} = coordinates;
    //    make grantcontainer invisible  
    grantAccessContainer.classList.remove("active");
    //    make loader visible 
    loadingScreen.classList.add("active");

    // API Call 

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${longi}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }

    catch (err) {
        // handle the error
        console.log("Error Found", err);
        loadingScreen.classList.remove("active");

    }
}

function renderWeatherInfo(weatherInfo) {
    // sbse pehle elements fetch krne pdenge 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloudiness]");

    // fetch values from weather info and place in UI 
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = (`https://flagcdn.com/w320/${weatherInfo?.sys?.country.toLowerCase()}.png`);
    weatherIcon.src = (`https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`);
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    temp.innerText = weatherInfo?.main?.temp;
    windSpeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    clouds.innerText = weatherInfo?.clouds?.all;

};


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        console.log("no geolocation found");
        alert("no geolocation support available")
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        longi: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessbutton = document.querySelector("[data-grantAccess]");
grantAccessbutton.addEventListener("click", getLocation);


let searchInput = document.querySelector("[ data-searchInput]")
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (searchInput.value === "") {
        return;
    }

    fetchSearchWeatherInfo(searchInput.value);
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        // error
    }
}