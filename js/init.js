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

  for (i = 0; i < citydata.features.length; i++) {
    var historic_places = citydata.features[i].properties.name; 
    var cityLst = document.createElement("li");

    cityLst.textContent = historic_places;
    cityLstEl.appendChild(cityLst);
  
  }
 cityContainer.appendChild(cityLstEl);
 
};


// var $el1;
// var $el2;

// setInterval(function() {
//  		$el1 = $('.bg-container.active');
//     $el2 = $('.bg-container:not(.active');
//     $el1.removeClass('active');
//     $el2.addClass('active');
//   }, 2000);

// add event listeners to form and button container
cityFormEl.addEventListener("submit", formSubmitHandler);
cityButtonsEl.addEventListener("click", buttonClickHandler);
