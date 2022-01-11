var cityFormEl = document.querySelector("#city-form");
var cityButtonsEl = document.querySelector("#city-buttons");
var cityInputEl = document.querySelector("#cityname");
var cityContainerEl = document.querySelector("#city-container");
var citySearchTerm = document.querySelector("#city-search-term");


const apiKey = "5ae2e3f221c38a28845f05b60883896f56d632d8f8d31b794af77353";


const pageLength = 5; // number of objects per page

let lon; // place longitude
let lat; // place latitude

let offset = 0; // offset from first object in the list
let count; // total objects count

// var getCityHistory = JSON.parse(localStorage.getItem("cityArr")) || [];
// //console.log(typeof getCityHistory);
// for (i = 0; i < getCityHistory.length; i++) {
//   var cityBtn = document.createElement("button");
//   cityBtn.innerHTML = getCityHistory[i];
//   cityBtn.setAttribute("data-city", getCityHistory[i]);
//   cityBtn.classList = "btn";
//   cityButtonsEl.appendChild(cityBtn);
// }

var formSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var cityName = cityInputEl.value.trim();

  if (cityName) {
    getCityData(cityName);
    // var cityBtn = document.createElement("button");
    // cityBtn.innerHTML = cityname;
    // cityBtn.setAttribute("data-city", cityname);
    // cityBtn.classList = "btn";
    // cityButtonsEl.appendChild(cityBtn);

    localStoring(cityName);
    // clear old content
    //cityContainerEl.textContent = "";
    cityInputEl.value = "";

  } else {  
    $(document).ready(function(){
      // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
      $('.modal-trigger').modal();
    });    
  }
};

/* 
$(document).ready(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal-trigger').leanModal();
}); */




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
  //var lat, lon;
  fetch(apiUrl1).then(function (response1) {
    // request was successful
    if (response1.ok) {
      response1.json().then(function (data1) {
        lat = data1.lat;
        lon = data1.lon;
        firstLoad();

        // var apiUrl2 =
        //   "https://api.opentripmap.com/0.1/en/places/radius?radius=1600&lon=" +
        //   lon +
        //   "&lat=" +
        //   lat +
        //   "&kinds=historic&apikey=5ae2e3f221c38a28845f05b60883896f56d632d8f8d31b794af77353";

        // fetch(apiUrl2).then(function (response2) {
        //   // request was successful
        //   if (response2.ok) {
        //     response2.json().then(function (data2) {
        //       displayCity(data2, city);
        //     });
        //   } else {
        //     alert("Error: " + response2.statusText);
        //   }
        // });
      });
    } else {
      alert("Error: " + response1.statusText);
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

  // console.log(citydata.features);
  // citydata.features.sort((a, b) => parseInt(b.properties.rate) - parseInt(a.properties.rate));
  // console.log(citydata.features);

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

// Chris Backes -- grabs sotrage and places it in the webpage
function grabStorage() {
  console.log("hello");
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
    //event listener is added to each button that initiates get weather
    //commented this out because it is erroring - add it back later once figured out why.  This was created by Chris.
    // $(".btn-secondary").on("click", function () {
    //   getWeather($(this).text());
    // });
  }
}


function apiGet(method, query) {
  return new Promise(function(resolve, reject) {
    var otmAPI =
      "https://api.opentripmap.com/0.1/en/places/" +
      method +
      "?apikey=" +
      apiKey;
    if (query !== undefined) {
      otmAPI += "&" + query;
    }
    fetch(otmAPI)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(function(err) {
        console.log("Fetch Error :-S", err);
      });
  });
}

function firstLoad() {
  apiGet(
    "radius",
    `radius=1000&limit=${pageLength}&offset=${offset}&lon=${lon}&lat=${lat}&rate=2&format=count`
  ).then(function(data) {
    count = data.count;
    offset = 0;
    document.getElementById(
      "city-container"
    ).innerHTML += `<p>${count} objects with description in a 1km radius</p>`;
    loadList();
  });
}

function loadList() {
  apiGet(
    "radius",
    `radius=1000&limit=${pageLength}&offset=${offset}&lon=${lon}&lat=${lat}&rate=2&format=json`
  ).then(function(data) {
    let list = document.getElementById("list");
    list.innerHTML = "";
    data.forEach(item => list.appendChild(createListItem(item)));
    let nextBtn = document.getElementById("next_button");
    if (count < offset + pageLength) {
      nextBtn.style.visibility = "hidden";
    } else {
      nextBtn.style.visibility = "visible";
      nextBtn.innerText = `Next (${offset + pageLength} of ${count})`;
    }
  });
}


function createListItem(item) {
  let a = document.createElement("a");
  a.className = "list-group-item list-group-item-action";
  a.setAttribute("data-id", item.xid);
  a.innerHTML = `<h5 class="list-group-item-heading listStyle">${item.name}</h5>
            <p class="list-group-item-text">${item.kinds}</p>`;

  a.addEventListener("click", function() {
    document.querySelectorAll("#list a").forEach(function(item) {
      item.classList.remove("active");
    });
    this.classList.add("active");
    let xid = this.getAttribute("data-id");
    apiGet("xid/" + xid).then(data => onShowPOI(data));
  });
  return a;
}

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
}

document
.getElementById("next_button")
.addEventListener("click", function() {
  offset += pageLength;
  loadList();
});

cityFormEl.addEventListener("submit", formSubmitHandler);
cityButtonsEl.addEventListener("click", buttonClickHandler);
$(document).ready(grabStorage);


//added code that was copied and modified from from the API site https://opentripmap.io




// document
// .getElementById("city-form")
// .addEventListener("submit", function(event) {
//   let name = document.getElementById("cityname").value;
//   apiGet("geoname", "name=" + name).then(function(data) {
//     let message = "Name not found";
//     if (data.status == "OK") {
//       message = data.name + ", " + data.country;
//       lon = data.lon;
//       lat = data.lat;
//       firstLoad();
//     }
//     document.getElementById("city-container").innerHTML = `${message}`;
//   });
//   event.preventDefault();
// });


//Lando API Key = AIzaSyCoPP5u7-67QyAUK9Tn1vBie4c_xQBIg3M


 



$(document).ready(function(){
  $('.modal').modal();
})
