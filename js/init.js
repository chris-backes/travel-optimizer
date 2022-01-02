var cityFormEl = document.querySelector("#city-form");
var cityButtonsEl = document.querySelector("#city-buttons");
var cityInputEl = document.querySelector("#cityname");
var cityContainerEl = document.querySelector("#city-container");
var citySearchTerm = document.querySelector("#city-search-term");

var getCityHistory = JSON.parse(localStorage.getItem("cityArr")) || [];
//console.log(typeof getCityHistory);
for (i = 0; i < getCityHistory.length; i++) {
  var cityBtn = document.createElement("button");
  cityBtn.innerHTML = getCityHistory[i];
  cityBtn.setAttribute("data-city", getCityHistory[i]);
  cityBtn.classList = "btn";
  cityButtonsEl.appendChild(cityBtn);
}

var formSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var cityname = cityInputEl.value.trim();

  if (cityname) {
    getCityData(cityname);
    var cityBtn = document.createElement("button");
    cityBtn.innerHTML = cityname;
    cityBtn.setAttribute("data-city", cityname);
    cityBtn.classList = "btn";
    cityButtonsEl.appendChild(cityBtn);

    getCityHistory.push(cityname);

    localStorage.setItem("cityArr", JSON.stringify(getCityHistory));

    // clear old content
    //cityContainerEl.textContent = "";
    cityInputEl.value = "";
  } else {
    alert("Please enter a City name");
  }
};

var buttonClickHandler = function (event) {
  // get the city attribute from the clicked element
  var city = event.target.getAttribute("data-city");

  if (city) {
    getCity(city);

    // clear old content
    //cityContainerEl.textContent = "";
  }
};

var getCityData = function (city) {
  var city = cityInputEl.value.trim();

  if (city) {
    getCity(city);
  }
};

var getCity = function (city) {
  // format the github api url
  var apiUrl1 =
    "https://api.opentripmap.com/0.1/en/places/geoname?name=" +
    city +
    "&apikey=5ae2e3f221c38a28845f05b60883896f56d632d8f8d31b794af77353";

  // make a get request to url
  var lat, lon;
  fetch(apiUrl1).then(function (response1) {
    // request was successful
    if (response1.ok) {
      response1.json().then(function (data1) {
        lat = data1.lat;
        lon = data1.lon;

        var apiUrl2 =
          "https://api.opentripmap.com/0.1/en/places/radius?radius=1600&lon=" +
          lon +
          "&lat=" +
          lat +
          "&kinds=historic&apikey=5ae2e3f221c38a28845f05b60883896f56d632d8f8d31b794af77353";

        fetch(apiUrl2).then(function (response2) {
          // request was successful
          if (response2.ok) {
            response2.json().then(function (data2) {
              displayCity(data2, city);
            });
          } else {
            alert("Error: " + response2.statusText);
          }
        });
      });
    } else {
      alert("Error: " + response1.statusText);
    }
  });
};

var displayCity = function (citydata, searchTerm) {
  var cityContainer = document.querySelector("#city-container");
  cityContainer.innerHTML = '';
  // check if api returned any data
  if (!citydata) {
    cityContainerEl.textContent = "No city found.";
    return;
  }
  var date = moment().format("MM-DD-YYYY"); //how do I add the current date to the screen?
  citySearchTerm.textContent = searchTerm + "  " + date;

  // create a link for each historical site
  var cityLstEl = document.createElement("ul");

  // console.log(citydata.features);
  // citydata.features.sort((a, b) => parseInt(b.properties.rate) - parseInt(a.properties.rate));
  // console.log(citydata.features);


  for (i = 0; i < citydata.features.length; i++) {
    var historic_places = citydata.features[i].properties.name; 
    var cityLst = document.createElement("li");
    //cityLst.innerHTML = getCityHistory[i];
    //cityLst.setAttribute("data-city", historic_places);
    //cityLst.classList = "li";
    cityLst.textContent = historic_places;
    cityLstEl.appendChild(cityLst);
  
  }
 
 cityContainer.appendChild(cityLstEl);


  //var uv_Index = citydata.uvi; //still searching to find the UV index


  //weatherEl.classList = "list-item flex-row justify-space-between align-center";

//   var cityNameEl = document.querySelector("#city-container h2");
//   cityNameEl.textContent = searchTerm;
//   var temperatureEl = document.querySelector(
//     "#city-container .temperature span"
//   );
//   temperatureEl.textContent = Temp;

//   var windEl = document.querySelector("#city-container .wind span");
//   windEl.textContent = wind_speed;

//   var humidityEl = document.querySelector("#city-container .humidity span");
//   humidityEl.textContent = humidity;

//   var uviEl = document.querySelector("#city-container .uvi span");
//   uviEl.textContent = uvi;
//   //WORK ON THE UVI INDICATOR
//   var uviBox = document.querySelector("#uviBox");

//   if (parseInt(uvi) < 3) {
//     uviBox.classList = "good";
//     //cityButtonsEl.appendChild(uviBox);
//   }
//   if (parseInt(uvi) == 3) {
//     uviBox.classList = "okay";
//   }

//   if (parseInt(uvi) > 3) {
//     uviBox.classList = "bad";
//   }

//   // append container to the dom
//   cityContainerEl.appendChild(weatherEl);
//   /* // create a status element
//     var statusEl = document.createElement("span");
//     statusEl.classList = "flex-row align-center";

//     // check if current repo has issues or not
//     if (repos[i].open_issues_count > 0) {
//       statusEl.innerHTML =
//         "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
//     } else {
//       statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
//     } */

//   //MB attempt at displaying 5 day forecast

//   // create variables for temperature

  
};

// add event listeners to form and button container
cityFormEl.addEventListener("submit", formSubmitHandler);
cityButtonsEl.addEventListener("click", buttonClickHandler);
