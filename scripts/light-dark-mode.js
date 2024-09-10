const lightDarkSwitch = document.getElementById("light_dark_switch");
const lightDarkSwitchIcon = document.getElementById("light_dark_switch_icon");

function setTheme(themeName) {
    // Set theme
    console.log("Setting theme...");
    console.log(themeName);
    localStorage.setItem("theme", themeName);
    document.documentElement.setAttribute('data-bs-theme', themeName);
    if (themeName == "light") {
        lightDarkSwitch.className = "btn btn-dark";
        lightDarkSwitchIcon.className = "fa-solid fa-moon";
    } else if (themeName == "dark") {
        lightDarkSwitch.className = "btn btn-light";
        lightDarkSwitchIcon.className = "fa-solid fa-sun";
    }
}

function toggleTheme() {
    console.log("Toggling theme...");
    if (localStorage.getItem("theme") === "light") {
        localStorage.setItem("theme", "dark");
        setTheme("dark");
    } else if (localStorage.getItem("theme") === "dark") {
        localStorage.setItem("theme", "light");
        setTheme("light");
    }  
}

function setDefaults() {
    // If first time visit, set the deffault values to localstorage
    console.log("Setting defaults...")
    if (!localStorage.getItem("theme")) {
        console.log("Setting 'theme'...");
        localStorage.setItem("theme", "light");
    }
}

setDefaults();
setTheme(localStorage.getItem("theme"));