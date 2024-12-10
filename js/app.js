let vatsimMarkers = {}; // Initiate empty markers object for vatsim markers
const themeButton = document.getElementById("light_dark_switch");

// Get the airport data from the GeoJson file
let displayAirports = () => {
    fetch('data/airports.geojson')
    .then(response => response.json())
    .then(data => {
        const AIRPORTS = data;
        console.log(AIRPORTS);
        L.geoJSON(AIRPORTS, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng).bindPopup(`
                    <b>${feature.properties.name}</b><br>
                    ${feature.properties.city}, ${feature.properties.country}<br>
                    IATA: ${feature.properties.iata}, ICAO: ${feature.properties.icao}
                `);
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));
}

// Define the map
let map = L.map('map', {
    // dragging: !L.Browser.mobile, // Dragging only with two fingers on mobile
    // fullscreenControl: {
    //     pseudoFullscreen: false // if true, fullscreen to page width and height
    // },
    zoom: 10,
    minZoom: 2.5,
    maxZoom: 20,
    maxBounds: [[-90, -180], [90, 180]],  // World bounds
    maxBoundsViscosity: 1.0
});

// Creating Layers
//const osmMapnik = new L.tileLayer.provider('OpenStreetMap.Mapnik');
const lightMaplayer = new L.tileLayer.provider('CartoDB.Positron');
const darkMaplayer = new L.tileLayer.provider('CartoDB.DarkMatter');
const satelliteMaplayer = new L.tileLayer.provider('Esri.WorldImagery');

const baseLayers = {
    "Light": lightMaplayer,
    "Dark": darkMaplayer,
    "Satellite": satelliteMaplayer
}

// Layercontrol
const layerControl = L.control.layers(baseLayers).addTo(map);
map.addLayer(lightMaplayer);

// Marker symbol for the simulator plane
// let simPlaneMarkerIcon = L.icon({
//     iconUrl: "images/plane.png",
//     iconSize: [30, 30],
//     iconAnchor: [15, 0],
//     popupAnchor: [0, 0]
// })

// Marker symbol for Vatsim planes
let vatsimMarkerIcon = L.icon({
    iconUrl: "images/plane-svgrepo-com-dark.svg",
    iconSize: [20, 20],
    iconAnchor: [15, 0],
    popupAnchor: [0, 0]
})

// Icon
// let simPlaneMarker = L.marker([0, 0], {icon: simPlaneMarkerIcon}).addTo(map);

// Declare the polyline
let polyLine;

// Define empty array for Polyline coordinates
let coordinatesArray = [];

// Polyline to map
polyLine = L.polyline(coordinatesArray, {color: "rgb(234,232,255)", weight: 2}).addTo(map);

// HTML elements
latitudePara = document.getElementById("latitude");
longitudePara = document.getElementById("longitude");
altitudePara = document.getElementById("altitude");
altitudeAboveGroundPara = document.getElementById("altitude_above_ground");
airspeedPara = document.getElementById("airspeed");
headingPara = document.getElementById("heading");
verticalSpeedPara = document.getElementById("vertical_speed");
fuelPara = document.getElementById("fuel");

// Plane data initialisation
let timestemp = Date()
let latitude = 0;
let longitude = 0;
let altitude = 0;
let altitudeAboveGround = 0;
let airspeed = 0;
let heading = 0;
let verticalSpeed = 0;
let centerAircraft;
let fuelTotalQty = 0;
let fuelTotalCpc = 0;

// Altitude chart element
const chartCanvas = document.getElementById("altitude_chart");

// Arrays for the alt. chart
let dataArray = [];
let altitudeArray = [];
let altitudeAboveGroundArray = [];
let airspeedArray = [];
let verticalSpeedArray = [];
let timestampArray = [];

// Creating the altitude chart
/*

let chart = new Chart(chartCanvas, {
    type: "line",
    data: {
        labels: timestampArray,
        datasets: [{
            label: "Altitude Chart",
            data: dataArray,
            fill: false,
            borderColor: "rgb(255, 128, 0",
            tension: 0.1
            }, {
            label: "Altitude above ground Chart",
            data: dataArray,
            fill: false,
            borderColor: "rgb(255, 0, 0",
            tension: 0.1
            }, {
            label: "Airspeed",
            data: dataArray,
            fill: false,
            borderColor: "rgb(51, 153, 255",
            tension: 0.1
            }, {
            label: "Vertical Speed",
            data: dataArray,
            fill: false,
            borderColor: "rgb(153, 51, 255",
            tension: 0.1
            }
        ]
    },
    options: {}
});
*/

// Update our conenction label
updateConnectionLabel = (simConnected) => {
    if (simConnected == true) {
        $("#connection-label").removeClass();
        $("#connection-label").addClass("badge text-bg-success");
        $("#connection-label").text("Sim Connected")
    } else {
        $("#connection-label").removeClass();
        $("#connection-label").addClass("badge text-bg-danger");
        $("#connection-label").text("Sim Disconnected")
    }
}

// Getting plane data from the simulator by calling the server script
// Only works when running from the Flask server which has the backend Python script to fetch the data from Microsoft Flight Simulator
function getPlaneData() {
    console.log("Getting plane data...");
    $.getJSON("/get_plane_data", {}, function(data) {
        try {
            // Assign data to variables
            // Server time
            timestamp = data.timestamp;

            // Airdata
            latitude = data.latitude;
            longitude = data.longitude;
            altitude = data.altitude.toFixed(0);
            altitudeAboveGround = data.altitude_above_ground.toFixed(0);
            airspeed = data.airspeed.toFixed(0);
            heading = data.heading.toFixed(0);
            verticalSpeed = data.vertical_speed.toFixed(0);

            // Fuel
            fuelTotalCpc = data.fuel_total_capacity.toFixed(0);
            fuelTotalQty = data.fuel_total_quantity.toFixed(0);
            fuelPercentQty = (fuelTotalQty/fuelTotalCpc)*100;
            fuelPercentQty = fuelPercentQty.toFixed(0);
            //console.log("Fuel Percentage: " + fuelPercentQty);

            // Push to the array to display the chart
            timestampArray.push(timestamp);
            altitudeArray.push(altitude);
            altitudeAboveGroundArray.push(altitudeAboveGround);
            airspeedArray.push(airspeed);
            verticalSpeedArray.push(verticalSpeed);
            coordinatesArray.push([data.latitude, data.longitude]);


            updateConnectionLabel(true); // It is not a real conneciton check. But if there is any kind of error in this block, we consider sim as not connected.
            updateUI();
            //updateChart();
            updateMap();
            setTimeout(getPlaneData, 1000);
        } catch(error) {
            //console.error(error);
            updateConnectionLabel(false);
            setTimeout(getPlaneData, 1000);
        }
    });
}

// Update the UI based on fetched data from the simulator
function updateUI() {
    console.log("Updating UI...");
    try {
        $("#lat").text(latitude.toFixed(2));
        $("#lon").text(longitude.toFixed(2));
        $("#alt").text(altitude);
        $("#ias").text(airspeed);
        $("#fuel").text(fuelPercentQty);
    } catch (error) {
        console.error(error);
    }
}

// Update the map
function updateMap() {
    console.log("Updating map...")
    let polyLineColor = "#000000";
    try {
        simPlaneMarker.slideTo([latitude, longitude], {duration: 1500}); // Update marker position
        simPlaneMarker.setRotationAngle(heading); // Update marker rotation angle
        if (centerAircraft == true) {
            map.panTo([latitude, longitude]);
        }
        map.removeLayer(polyLine);
        theme = getCurrentTheme();
        if (theme == "light") {
            polyLineColor = "#18241e";
        } else if (theme == "dark") {
            polyLineColor = "#d5f0e3";
        }
        polyLine = L.polyline(coordinatesArray, {color: polyLineColor, weight: 2}).addTo(map);
    } catch (error) {
        console.error(error);
    }
}

// Update chart
function updateChart() {
    console.log("Updating chart...")
    try {
        chart.data.datasets[0].data = altitudeArray;
        chart.data.datasets[1].data = altitudeAboveGroundArray;
        chart.data.datasets[2].data = airspeedArray;
        chart.data.datasets[3].data = verticalSpeedArray;
        chart.update();
    } catch (error) {
        console.error(error);
    }
}

// Clear the chart by emptying the array and updating the chart
function clearChart() {
    console.log("Clearing chart...");
    try {
        timestampArray = [];
        altitudeArray = [];
        altitudeAboveGroundArray = [];
        airspeedArray = [];
        verticalSpeedArray = [];
        chart.data.labels = timestampArray;
        chart.data.datasets[0].data = altitudeArray;
        chart.data.datasets[1].data = altitudeAboveGroundArray;
        chart.data.datasets[2].data = airspeedArray;
        chart.data.datasets[3].data = verticalSpeedArray;
        chart.update();
    } catch (error) {
        console.error(error);
    }
}

// Fetching vatsim network data
function getVatsimNetworkData() {
    console.log("Getting Vatsim network data...")

    const url = "https://data.vatsim.net/v3/vatsim-data.json" // API endpoint
    fetch(url) // Creates the first promise
        .then(response => { // If the promise of response is resolved, return response.json() -> This is creating another promise
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => { // If the response.json() promise is resolved 
            console.log("Network data: ", data);
            updateVatsimNetworkData(data);
        })
        .catch(error => { // If an error occured at any point of the fetch operation, the promise will be rejected
            console.error(error);
        });
    setTimeout(getVatsimNetworkData, 10000);
}

let updateVatsimNetworkData = data => {
    // Start the timer for calculating the time it takes to update
    let startTime = new Date().getTime();

    // Update the pilots and the controllers element
    $("#online-pilots").text(" " + data.pilots.length);
    $("#online-controllers").text(" " + data.controllers.length);

    // Getting the timestamp
    const dateTimeStr = data.general.update_timestamp;
    // Create a mew Date object
    const dateObject = new Date(dateTimeStr);
    // Parse the time
    const time = dateObject.toISOString().split('T')[1].split('.')[0];
    // Update the time element
    $("#time").html(time + " UTC");

    // Create a set of current callsigns. 
    const currentCallsigns = new Set(data.pilots.map(pilot => pilot.callsign));
    let flight_plan, aircraft_short, departure, arrival;

    // Update existing markers or add new ones
    data.pilots.forEach((pilot, index) => {
        const { callsign, latitude, longitude, heading, altitude, transponder } = pilot;
        // console.log(index);
        try {
            // Assign variables within the try block
            flight_plan = pilot.flight_plan;
            if (flight_plan) {
                ({ aircraft_short, departure, arrival } = flight_plan);
            }
            // console.log(callsign);
            // console.log(flight_plan);        
        } catch (error) {
            console.log(error);
        } finally {
            if (vatsimMarkers[callsign]) {
                // Update position and heading if marker already exists
                vatsimMarkers[callsign].setLatLng([latitude, longitude]);
                vatsimMarkers[callsign].setRotationAngle(heading);
            } else {
                // Create and add new marker if it doesn't exist
                const newMarker = L.marker([latitude, longitude], { icon: vatsimMarkerIcon }).addTo(map);
                newMarker.setRotationAngle(heading);
                if (flight_plan) {
                    newMarker.bindPopup(
                        `<h5>${callsign}</h5>
                         <h6>${aircraft_short}</h6>
                         <p>${departure} > ${arrival}
                        `
                    );
                } else {
                    newMarker.bindPopup(
                        `<h5>No Flightplan...</h5>
                        `
                    );
                }
                // newMarker.on("mouseover", function() { this.openPopup(); });
                // newMarker.on("mouseout", function() { this.closePopup(); });
    
                vatsimMarkers[callsign] = newMarker;
            }
        }
    });
    // Remove markers that are no longer present in the new data
    Object.keys(vatsimMarkers).forEach(callsign => {
        if (!currentCallsigns.has(callsign)) {
            map.removeLayer(vatsimMarkers[callsign]);
            delete vatsimMarkers[callsign];
        }
    });
    let endTime = new Date().getTime();
    let duration = endTime - startTime;
    console.log("Update duration: ", duration, " ms");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

function getVatsimEvents() {
    console.log("getVatsimEvents");
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/' // To avoid cors issue during development
    const URL = 'https://my.vatsim.net/api/v2/events/latest';
    // fetch(PROXY_URL + URL)
    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was no ok ' + reponse.statusText)
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        updateVatsimEvents(data);

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation', error);
        })
}

// Update the events on the page
// Also only works when running the application from the Flask server due to CORS issues undortunately :(
function updateVatsimEvents(data) {
    console.log("Updating events...")
    console.log(data)

    const eventContainer = document.getElementById("vatsim-events-container");
    const numberOfEvents = data.data.length;
    console.log("Number of events: ", numberOfEvents);
    console.log(eventContainer);
    
    for (let event = 0; event < numberOfEvents; event++) { // Do for every event
        startTime = data.data[event]["start_time"];
        endTime = data.data[event]["end_time"];
        formattedStartTime = new Date(data.data[event]["start_time"]).toLocaleString("de-CH", {timezone: "UTC", timeZoneName: "short"});
        formattedEndTime = new Date(data.data[event]["end_time"]).toLocaleString("de-CH", {timezone: "UTC", timeZoneName: "short"});
        let [live, startingSoon, timeDifference] = isEventLive(startTime, endTime); // Check if event is live or starting soon

        let eventItem = document.createElement("div");
        let eventHeader = document.createElement("h6");
        let eventImage = document.createElement("img");
        let eventTime = document.createElement("h6");
        let startingIn = document.createElement("h6");
        let eventDescription = document.createElement("p");

        eventHeader.textContent = data.data[event]["name"] + "   ";
        eventImage.src = data.data[event]["banner"];
        eventTime.textContent = formattedStartTime + " - " + formattedEndTime;
        startingIn.textContent = "Event starts in " + timeDifference + " minutes";
        eventDescription.textContent = data.data[event]["description"];

        eventContainer.appendChild(eventItem);
        eventItem.appendChild(eventHeader);
        eventItem.appendChild(eventImage);
        eventItem.appendChild(eventTime);
        eventItem.appendChild(startingIn);
        eventItem.appendChild(eventDescription);

        if (live == true) {
            console.log("Event is live...");
            let liveBadge = document.createElement("span");
            liveBadge.classList.add("badge", "rounded-pill", "text-bg-danger");
            liveBadge.textContent = "LIVE";
            eventHeader.appendChild(liveBadge);
            startingIn.textContent = "Event is live!";
        } else if (startingSoon == true) {
            console.log("Event is starting soon...");
            let startingSoonBadge = document.createElement("span");
            startingSoonBadge.classList.add("badge", "rounded-pill", "text-bg-primary");
            startingSoonBadge.textContent = "STARTING SOON";
            eventHeader.appendChild(startingSoonBadge);
        }
    }
}

function isEventLive(start_time, end_time) {
    const timestamp = new Date(); // Get the current timestamp
    const event_start = new Date(start_time); // Parse the format of start time ISO8601
    const event_end = new Date(end_time); // Parse the format of end time ISO8601

    //console.log(timestamp, event_start, event_end);

    let live = false;
    let startingSoon = false;

    timeDifference = ((event_start - timestamp) / 1000) / 60; // Time difference in miintues
    timeDifference = timeDifference.toFixed(0);

    if (timeDifference <= 60) {
        console.log("Event is starting soon!");
        startingSoon = true;
    }

    if (timestamp >= event_start && timestamp <= event_end) {
        //console.log("Event is live!");
        live = true;
    } else if (timestamp > event_end) {
        console.log("Event is over...")
    } else {
        console.log("Event has not started yet...")
    }
    return [live, startingSoon, timeDifference];
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Toggle UI element
function toggleUiElement(localstorage, element, button) {
    if (localStorage.getItem(localstorage) === "true") {
        $(element).hide(300);
        localStorage.setItem(localstorage, "false");
    } else if (localStorage.getItem(localstorage) === "false") {
        $(element).show(300);
        localStorage.setItem(localstorage, "true");
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Initialize the UI based on localstorage variables
function initializeUI() {
    console.log("Initializing UI...");

    centerAircraft = localStorage.getItem("centerAircraft");
    let showAirdata = localStorage.getItem("showAirdata");
    let showVatsimData = localStorage.getItem("showVatsimData");
    let mapZoomLevel = localStorage.getItem("mapZoomLevel");
    let mapView = JSON.parse(localStorage.getItem("mapView"));
    let showUserMenu = localStorage.getItem("showUserMenu");
    
    map.setView(mapView, mapZoomLevel);

    if (showAirdata === "true") {
        $(".aircraft-data-container").show();
        $("#toggle-aircraft-data-button").css({
            "background-color": "#4bff45"
        });
    } else if (showAirdata === "false") {
        $(".aircraft-data-container").hide();
        $("#toggle-aircraft-data-button").css({
            "background-color": "#ff5b45"
        });
    }

    if (showVatsimData === "true") {
        $(".vatsim-events-container").show();
        $("#toggle-vatsim-data-button").css({
            "background-color": "#4bff45"
        });
    } else if (showVatsimData === "false") {
        $(".vatsim-events-container").hide();
        $("#toggle-vatsim-data-button").css({
            "background-color": "#ff5b45"
        });
    }

    if (centerAircraft == "true") {
        $("#center-aircraft-toggle-button").css({
            "background-color": "#4bff45"
        });
    } else if (centerAircraft == "false") {
        $("#center-aircraft-toggle-button").css({
            "background-color": "#ff5b45"
        });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
function getCurrentTheme() {
    theme = localStorage.getItem("theme");
    console.log("Current theme is: ", theme);
    return theme;
}

// Choose map theme according to theme mode in localstorage
function setMsfsTheme(theme) {
    console.log("Setting theme...")
    if (theme == "light") {
        console.log("Switching to light")
        map.removeLayer(darkMaplayer);
        map.addLayer(lightMaplayer);
        $(".aircraft-data-container").css({
            "background-color": "rgba(255, 255, 255, 0.781)"            
        });
        $(".vatsim-events-container").css({
            "background-color": "rgba(255, 255, 255, 0.781)"            
        });

    } else if (theme == "dark") {
        console.log("Switching map to dark")
        map.removeLayer(lightMaplayer);
        map.addLayer(darkMaplayer);
        $(".aircraft-data-container").css({
            "background-color": "rgba(0, 0, 0, 0.781)"            
        });
        $(".vatsim-events-container").css({
            "background-color": "rgba(0, 0, 0, 0.781)"            
        });
    }
}

saveCurrentMapView = () => {
    console.log("Saving Map View...");
    let mapCenter = map.getCenter();
    let mapView = [mapCenter.lat, mapCenter.lng];
    let mapZoomLevel = map.getZoom();

    localStorage.setItem("mapView", JSON.stringify(mapView));
    localStorage.setItem("mapZoomLevel", mapZoomLevel);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
// UI button handling
$(document).ready(function() { 
    $("#center-aircraft-toggle-button").click(function() {
        console.log(centerAircraft);
        if (centerAircraft == "true") {
            centerAircraft = "false";
            localStorage.setItem("centerAircraft", false);
            $("#center-aircraft-toggle-button").css({
                "backgroundColor": "#ff5b45"
            });
        } else {
            centerAircraft = "true";
            localStorage.setItem("centerAircraft", true);
            $("#center-aircraft-toggle-button").css({
                "backgroundColor": "#4bff45"
            });
        }
    });
    
    $("#toggle-aircraft-data-button").click(function() {
        console.log("toggle airdata");
        toggleUiElement("showAirdata", ".aircraft-data-container", "#toggle-aircraft-data-button");
        }
    );

    $("#toggle-vatsim-data-button").click(function() {
        toggleUiElement("showVatsimData", ".vatsim-events-container", "#toggle-vatsim-data-button");
    });

    $(".burger-button").click(function() {
        $(".user-menu").fadeToggle(300);
        $("#burger-button-icon").toggleClass("fa-x")

    });
})

themeButton.addEventListener("click", function() {
    setMsfsTheme(getCurrentTheme())
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
// First initialize
// displayAirports()
setMsfsTheme(getCurrentTheme());
initializeUI();
getVatsimEvents(); 
// getPlaneData();
getVatsimNetworkData()
setInterval(saveCurrentMapView, 5000);


