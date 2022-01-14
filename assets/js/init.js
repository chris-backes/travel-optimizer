var cityFormEl = document.querySelector("#city-form");
var cityButtonsEl = document.querySelector("#city-buttons");
var cityInputEl = document.querySelector("#cityname");
var cityContainerEl = document.querySelector("#city-container");
var citySearchTerm = document.querySelector("#city-search-term");

const apiKey = "5ae2e3f221c38a28845f05b60883896f56d632d8f8d31b794af77353";
const pageLength = 10; // number of objects per page
let offset = 0; // offset from first object in the list
let count; // total objects count

let latCity;
let lonCity;

// Code provided from mapbox documentation
mapboxgl.accessToken =
  "pk.eyJ1Ijoib2xvcGV6OTIwODQiLCJhIjoiY2t5NnI2MDlqMG42ZTJvcWkybGtobW92ZyJ9.07gsbcPupXhcC_7Wf4_BGg";
let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/olopez92084/cky6s06631d4p15o1kb7ut2qq", //style URL
  center: [-73.98, 40.76], // starting position
  zoom: 13, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
// Initialize the GeolocateControl.
const geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: true,
});
// Add the control to the map.
map.addControl(geolocate);

// Set marker options.
const marker = new mapboxgl.Marker({
  color: "red",
  draggable: false,
})
  .setLngLat([-73.98, 40.76])
  .addTo(map);

//initiates the series of processes which run once the search is run on the webpage. If a text is entered in the input field, a search is performed
var formSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var cityName = cityInputEl.value.trim();
  if (/[0-9]/.test(cityName)) {
    $("#modal-error").modal("open");
    return;
  }

  if (cityName) {
    getCityData(cityName);
    localStoring(cityName);

    cityInputEl.value = "";
  } else {
    //$(document).ready(function () {
    $("#modal").modal("open");
  }
};

var buttonClickHandler = function (event) {
  // get the city attribute from the clicked element
  var city = event.target.getAttribute("data-city");

  if (city) {
    getCity(city);
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

  // make a get request to url to return Lat and Lon
  fetch(apiUrl1).then(function (response1) {
    // request was successful
    if (response1.ok) {
      response1.json().then(function (data1) {
        latCity = data1.lat;
        lonCity = data1.lon;
        //inserts city name into the html page. some names in the api request are not capitalized
        if (data1.name.charAt(0) === data1.name.charAt(0).toLowerCase()) {
          $("#city-search-term").text(
            data1.name.charAt(0).toUpperCase() + data1.name.slice(1)
          );
        } else {
          $("#city-search-term").text(data1.name);
        }
        map.jumpTo({ center: [lonCity, latCity] });
        marker.setLngLat([lonCity, latCity]);
        firstLoad();
      });
    } else {
      $("#modal").modal("open");
    }
  });
};

var displayCity = function (citydata, searchTerm) {
  var cityContainer = document.querySelector("#city-container");
  cityContainer.innerHTML = "";
  // check if api returned any data
  if (!citydata) {
    cityContainerEl.textContent = "No city found.";
    return;
  }
  citySearchTerm.textContent =
    searchTerm + "  " + new Date().toLocaleDateString();

  // create a link for each historical site
  var cityLstEl = document.createElement("ul");
  cityContainer.appendChild(cityLstEl);

  for (i = 0; i < citydata.features.length; i++) {
    var historic_places = citydata.features[i].properties.name;
    var cityLst = document.createElement("li");
    cityLst.textContent = historic_places;
    cityLstEl.appendChild(cityLst);
  }
};

// Local Storage - Chris Backes
function localStoring(city) {
  let previousSearch = JSON.parse(localStorage.getItem("search-history"));
  let searchHistory = [];
  //loads search history, if any
  if (previousSearch) {
    for (let i = 0; i < previousSearch.length; i++) {
      searchHistory.push(previousSearch[i]);
    }
  }
  //capitalizes each word in the search if they are not already
  let newTerm = city.trim();
  if (newTerm.includes(" ")) {
    let newTermArray = newTerm.split(" ");
    for (let i = 0; i < newTermArray.length; i++) {
      newTermArray[i] =
        newTermArray[i][0].toUpperCase() + newTermArray[i].substr(1);
    }
    newTerm = newTermArray.join(" ");
  } else {
    newTerm = newTerm[0].toUpperCase() + newTerm.substr(1);
  }
  //checks to see if the search term is already in the array, then adds it to array if not in there
  if (!searchHistory.includes(newTerm)) {
    searchHistory.unshift(newTerm);
  }
  //search history maxes out at 8 terms
  if (searchHistory.length > 8) {
    searchHistory.pop();
  }
  //stores search history
  localStorage.setItem("search-history", JSON.stringify(searchHistory));
}

// Chris Backes -- grabs storage and places it in the webpage
function grabStorage() {
  //pulls info from local storage. that info is then displayed below the search bar
  let searchHistory = JSON.parse(localStorage.getItem("search-history"));
  if (searchHistory) {
    for (let i = 0; i < searchHistory.length; i++) {
      $("#city-buttons").append(
        "<button class='btn btn-secondary' data-city=" +
          searchHistory[i] +
          ">" +
          searchHistory[i] +
          "</button>"
      );
    }
  }
}
//Code utilized from the API website example and modified- MB- this is the first call to the API
function apiGet(method, query) {
  return new Promise(function (resolve, reject) {
    var otmAPI =
      "https://api.opentripmap.com/0.1/en/places/" +
      method +
      "?apikey=" +
      apiKey;
    if (query !== undefined) {
      otmAPI += "&" + query;
    }
    fetch(otmAPI)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(function (err) {
        $("#modal-error").modal("open");
      });
  });
}
//this function returns the count of POIs from the API call
function firstLoad() {
  apiGet(
    "radius",
    `radius=1000&limit=${pageLength}&offset=${offset}&lon=${lonCity}&lat=${latCity}&rate=2&format=count`
  ).then(function (data) {
    count = data.count;
    offset = 0;
    document.getElementById(
      "city-container"
    ).innerHTML = `<p>${count} objects with description in a 1 mile radius</p>`;
    loadList();
  });
}

//this API call will return List Data from the API with an offset and populate the text on the buttons
function loadList() {
  apiGet(
    "radius",
    `radius=1000&limit=${pageLength}&offset=${offset}&lon=${lonCity}&lat=${latCity}&rate=2&format=json`
  ).then(function (data) {
    let list = document.getElementById("list");
    list.innerHTML = "";
    data.forEach((item) => list.appendChild(createListItem(item)));
    let nextBtn = document.getElementById("next_button");
    if (count < offset + pageLength) {
      nextBtn.style.visibility = "hidden";
    } else {
      if (offset > -1) {
        nextBtn.style.visibility = "visible";
        nextBtn.innerText = `Next (${offset + pageLength} of ${count})`;
      } else {
        nextBtn.style.visibility = "visible";
        nextBtn.innerText = `Next (${"0"} of ${count})`;
      }
    }
  });
  let backBtn = document.getElementById("back_button");
  if (count < offset + pageLength) {
    backBtn.style.visibility = "hidden";
  } else {
    backBtn.style.visibility = "visible";
    backBtn.innerText = "Back";
  }
}

//borrowed from API website added class to modify cursor and create and on hover element. we also removed the p element which was lacking in any aesthetic quality
function createListItem(item) {
  let li = document.createElement("li");
  li.className = "list-group-item list-group-item-action";
  li.setAttribute("data-id", item.xid);
  li.innerHTML = `<h5 class="list-group-item-heading listStyle search-list">${item.name}</h5>`;

  li.addEventListener("click", function () {
    document.querySelectorAll("#list a").forEach(function (item) {
      item.classList.remove("active");
    });
    this.classList.add("active");
    let xid = this.getAttribute("data-id");
    apiGet("xid/" + xid).then((data) => onShowPOI(data));
  });
  return li;
}

//Obtain and sets inner HTML image and description from the wiki extract of the POI
function onShowPOI(data) {
  let poi = document.getElementById("poi");
  poi.innerHTML = "";
  if (data.preview) {
    poi.innerHTML += `<img src="${data.preview.source}">`;
  }
  poi.innerHTML += data.wikipedia_extracts
    ? data.wikipedia_extracts.html
    : data.info
    ? data.info.descr
    : "No description";

  poi.innerHTML += `<p><a target="_blank" href="${data.otm}">Show more at OpenTripMap</a></p>`;
  //sets map to Point of Interest and plants a marker
  map.jumpTo({
    center: [data.point.lon, data.point.lat],
    zoom: 17,
  });
  marker.setLngLat([data.point.lon, data.point.lat]);
}

document.getElementById("next_button").addEventListener("click", function () {
  offset += pageLength;
  loadList();
});
document.getElementById("back_button").addEventListener("click", function () {
  offset -= pageLength;
  loadList();
});

cityFormEl.addEventListener("submit", formSubmitHandler);
cityButtonsEl.addEventListener("click", buttonClickHandler);
$(document).ready(grabStorage);
$("#modal").modal();
$("#modal-error").modal();
