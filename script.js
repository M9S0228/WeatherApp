const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sun-rise"),
    sunSet = document.querySelector(".sun-set"),
    humidity = document.querySelector(".humidity"),
    visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status"),
    weatherCards = document.querySelector("#weather-cards"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    searcForm = document.querySelector("#search"),
    search = document.querySelector("#query");



let currentCity = "";
let currentUnit = "c";
let hourlyWeek = "Week";

function getDateTime(){
    let now = new Date(),
    hour = now.getHours(), 
    minute = now.getMinutes();

    let days =[
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    
    hour = hour % 12;
    if(hour < 10){
        hour = "0" + hour;
    }
    if(minute < 10){
        minute = "0" + minute;
    }
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
} 

date.innerText = getDateTime();

setInterval(() =>{
    date.innerText = getDateTime();
}, 1000);

function getPublicIp(){
    fetch(`https://geolocation-db.com/json/`, {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        currentCity = data.currentCity;
        getWeatherData(data.city, currentUnit,hourlyWeek);
    });
}

getPublicIp();


function getWeatherData(city, unit, hourlyorWeek){
    const apiKey = "2TYXU246RS6ERJ6PV7CDG6EJR";
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
    {
        method: "GET",
    }
    )
    .then((response)=> response.json())
    .then((data)=>{
        let today = data.currentConditions;
        if(unit ==="c"){
            temp.innerText = today.temp;
        }
        else{
            temp.innerText = celciusToFahrenheit(today.temp);
        }
        currentLocation.innerText = data.resolvedAddress;
        condition.innerText = today.conditions;
        rain.innerText = "Perc - " + today.precip + "%";
        uvIndex.innerText = today.uvindex;
        windSpeed.innerText = today.windspeed;
        humidity.innerText = today.humidity + "%";
        visibility.innerText = today.visibility;
        airQuality.innerText = today.winddir;
        measureUvIndex(today.uvindex);
        updateHumidityStatus(today.humidity);
        updateVisibilityStatus(today.visibility);
        updateAirQualityStatus(today.winddir);
        sunRise.innerText = convertTimeTo12HourFormat(today.sunRise);
        sunSet.innerText = convertTimeTo12HourFormat(today.sunSet);
        mainIcon.src = getIcon(today.icon)
        changeBackground(today.icon);
        if(hourlyWeek === "hourly"){
            updateForecast(data.days[0].hours, unit, "day");
        }
        else{
            updateForecast(data.days, unit, "week");
        }
    })
    .catch((err) =>{
        alert("City not found");
    });
}

function changeBackground(condition){
    const body = document.querySelector("body");
    let bg ="";
    if(condition === "partly-cloudy-day"){
        bg = "fon/cloud.jpg"
    }
    else if(condition === "partly-cloudy-night"){
        bg = "fon/moon.jpg"
    }
    else if(condition === "rain"){
        bg = "fon/rain.jpg"
    }
    else if(condition === "clear-day"){
        bg = "fon/clear.jpg"
    }
    else if(condition === "clear-night"){
        bg = "fon/moon.jpg"
    }
    else{
        bg = "fon/clear.jpg"
    }
    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg})`;
}

function celciusToFahrenheit(temp){
    return ((temp*9)/5+32).toFixed(1);
}

function measureUvIndex(uvIndex){
    if(uvIndex <=2){
        uvText.innerText = "Low"
    }
    else if(uvIndex <=5){
        uvText.innerText = "Moderate"
    }
    else if(uvIndex <=7){
        uvText.innerText = "High"
    }
    else if(uvIndex <=10){
        uvText.innerText = "Very High"
    }
    else{
        uvText.innerText = "Extreme"
    }
}

function updateVisibilityStatus(visibility){
    if(visibility <= 0.3){
        visibilityStatus.innerText = "Dense Fog"
    }
    else if(visibility <= 0.16){
        visibilityStatus.innerText = "Moderate Fog"
    }
    else if(visibility <= 0.35){
        visibilityStatus.innerText = "Light Fog"
    }
    else if(visibility <= 1.33){
        visibilityStatus.innerText = "Very Light Fog"
    }
    else if(visibility <= 2.16){
        visibilityStatus.innerText = "Light Mist"
    }
    else if(visibility <= 5.4){
        visibilityStatus.innerText = "Very Light Mist"
    }
    else if(visibility <= 10.8){
        visibilityStatus.innerText = "Clear Air"
    }
    else{
        visibilityStatus.innerText = "Very Clear Air"
    }
}

function updateHumidityStatus(humidity){
    if(humidity <= 30){
        humidityStatus.innerText = "Low"
    }
    else if(humidity <= 60){
        humidityStatus.innerText = "Moderate"
    }
    else{
        humidityStatus.innerText = "High"
    }
}

function updateAirQualityStatus(airQuality){
    if(airQuality <= 50){
        airQualityStatus.innerText = "Good";
    }
    else if(airQuality <= 100){
        airQualityStatus.innerText = "Moderate";
    }
    else if(airQuality <= 150){
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
    }
    else if(airQuality <= 200){
        airQualityStatus.innerText = "Unhealthy";
    }
    else if(airQuality <= 250){
        airQualityStatus.innerText = "Very Unhealthy";
    }
    else{
        airQualityStatus.innerText = "Hazardous";
    }
}

function convertTimeTo12HourFormat(time){
    if (!time) {
        return "";
    }
    let parts = time.split(":");
    if (parts.length < 2) {
        return "";
    }
    let hour = parseInt(parts[0]);
    let minute = parseInt(parts[1]);
    if (isNaN(hour) || isNaN(minute)) {
        return "";
    }
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    hour = hour ? hour : 12;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}
// function convertTimeTo12HourFormat(time){
//     let hour = time.split(":")[0];
//     let minute = time.split(":")[1];
//     let ampm = hour >= 12 ? "pm" : "am";
//     hour = hour & 12;
//     hour = hour ? hour : 12;
//     hour = hour < 10 ? "0" + hour : hour;
//     minute = minute < 10 ? "0" + minute : minute;
//     let strTime = hour + ":" + minute + " " + ampm;
//     return strTime;
// }

function getIcon(condition){
    if(condition === "partly-cloudy-day"){
        return "icons/parCloud.png"
    }
    else if(condition === "partly-cloudy-night"){
        return "icons/parMoon.png"
    }
    else if(condition === "rain"){
        return "icons/rain.png"
    }
    else if(condition === "clear-day"){
        return "icons/clear.png"
    }
    else if(condition === "clear-night"){
        return "icons/moon.png"
    }
    else{
        return "icons/clear.png"
    }
}

function getDayName(date){
    let day = new Date(date);
    let days =[
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[day.getDay()];
}

function getHour(time){
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if(hour > 12){
        hour = hour - 12;
        return `${hour}:${min} PM`;
    }
    else{
        return `${hour}:${min} AM`
    }
}

function updateForecast(data, unit, type){
    weatherCards.innerHTML = "";
    let day = 0;
    let numCards = 0;
    if(type === "day"){
        numCards = 24;
    }
    else{
        numCards= 7
    }
    for (let i = 0; i< numCards; i++){
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHour(data[day].datetime);
        if(type ==="week") {
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if(unit ==="f"){
            dayTemp = celciusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if(unit ==="f"){
            tempUnit = "°F";
        }
        card.innerHTML = `
        <h2 class="day-name">${dayName}</h2>
        <div class="card-icon">
            <img src="${iconSrc}" alt="">
        </div>
        <div class="day-temp">
            <h2 class="temp">${dayTemp}</h2>
            <span class="temp">${tempUnit}</span>
        </div>
        `;
        weatherCards.appendChild(card);
        day++;

    }
}

fahrenheitBtn.addEventListener("click", ()=>{
    changeUnit("f");
});

celciusBtn.addEventListener("click", ()=>{
    changeUnit("c");
});

function changeUnit(unit){
    if(currentUnit !== unit){
        currentUnit = unit;
        if(tempUnit){
            tempUnit.forEach((elem) =>{
                elem.innerText = `${unit.toUpperCase()}`;
            });
        }
        if(unit === "c"){
            celciusBtn.classList.add("active");
            fahrenheitBtn.classList.remove("active");
        }
        else{
            celciusBtn.classList.remove("active");
            fahrenheitBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit,hourlyWeek);
    }
}

hourlyBtn.addEventListener("click", () =>{
    changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () =>{
    changeTimeSpan("week");
});

function changeTimeSpan(unit){
    if(hourlyWeek !== unit){
    hourlyWeek = unit;
    if(unit === "hourly"){
        hourlyBtn.classList.add("active");
        weekBtn.classList.remove("active");
    }
    else{
        hourlyBtn.classList.remove("active");
        weekBtn.classList.add("active");
    }
    getWeatherData(currentCity, currentUnit,hourlyWeek);
    }
}

searcForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if(location){
        currentCity = location;
        getWeatherData(currentCity, currentUnit,hourlyWeek);
    }
});

cities = [
    "Khmelnytskyi",
    "Kyiv",
    "Kharkiv",
    "Odesa",
    "Dnipro",
    "Donetsk",
    "Zaporizhzhia",
    "Vinnytsia",
    "Sevastopol",
    "Mariupol",
    "Kryvyi Rih",
    "Chernihiv",
    "Kherson",
    "Chernivtsi",
    "Rivne",
    "Ivano-Frankivsk",
]

var currentFocus;

search.addEventListener("input", function(e){
    removeSeggestions();
    var a, b, i, val = this.value;
    if(!val ){
        return false;
    }
    currentFocus = -1;
    a = document.createElement("ul");
    a.setAttribute("id","suggestions");
    this.parentNode.appendChild(a);

    for(i = 0; i<cities.length; i++){
        if(cities[i].substr(0,val.length).toUpperCase() === val.toUpperCase()){
            b = document.createElement("li");
            b.innerHTML = "<strong>" + cities[i].substr(0, val.length) + "</strong>";
            b.innerHTML += cities[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + cities[i]+"'>";
            b.addEventListener("click", function(e){
                search.value = this.getElementsByTagName("input")[0].value;
                removeSeggestions();
            });
            a.appendChild(b);
        }
    }
});

function removeSeggestions(){
    var x = document.getElementById("suggestions");
    if(x) x.parentNode.removeChild(x);
}

search.addEventListener("keydown", function (e){
    var x = document.getElementById("suggestions");
    if(x) x = x.getElementsByTagName("li");
    if(e.keyCode == 40){
        currentFocus++;
        addActive(x);
    }
    
    else if(e.keyCode ==38){
        currentFocus--;
        addActive(x);
    }
    if(e.keyCode ==13){
        e.preventDefault();
        if(currentFocus > -1){
            if(x) x[currentFocus].click();
        }
    }
});

function addActive(x){
    if(!x) return false;
    removeActive(x);
    if(currentFocus >= x.length) currentFocus = 0;
    if(currentFocus < 0 ) currentFocus = x.length -1;

    x[currentFocus].classList.add("active");

}

function removeActive(x){
    for(var i=0; i < x.length; i++){
        x[i].classList.remove("active");
    }
}

