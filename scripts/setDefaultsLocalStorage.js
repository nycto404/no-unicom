// Setting default local storage items when not deinfed or first page visit
if (!localStorage.getItem("theme") || !localStorage.getItem("showAirdata") || !localStorage.getItem("showMap") || !localStorage.getItem("showChart") || !localStorage.getItem("showVatsimData") || !localStorage.getItem("mapZoomLevel") || !localStorage.getItem("centerAircraft")) {
    console.log("Setting up localstorage for UI elements...")
    localStorage.setItem("theme", "light");
    localStorage.setItem("centerAircraft", "true");
    localStorage.setItem("showAirdata", "true");
    localStorage.setItem("showMap", "true");
    localStorage.setItem("showChart", "true");
    localStorage.setItem("showVatsimData", "true");
    localStorage.setItem("mapZoomLevel", 3);
    localStorage.setItem("mapView", JSON.stringify([0,0]));
}