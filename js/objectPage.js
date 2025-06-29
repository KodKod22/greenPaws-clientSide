function setPageTitle(product){
    let oldPageTitle = document.getElementsByClassName("breadcrumb")[0];
    oldPageTitle.children[0].innerText = product.street + " st " + product.city;

    let pageRoadTrial = document.getElementsByClassName("breadcrumb")[1];
    let pagePosition = document.createElement("li");
    pagePosition.classList.add("breadcrumb-item", "active");
    let pagePositionTitle = document.createElement("a");
    pagePositionTitle.href = "listPage.html?pageTitle=Locations";
    pagePositionTitle.innerText = product.street + " st " + product.city;

    pagePosition.appendChild(pagePositionTitle);
    pageRoadTrial.appendChild(pagePosition);
}

function getObjectId() {
    const aKeyValue = window.location.search.substring(1).split('&');
    const objectId = aKeyValue[0].split("=")[1];
    return objectId;
}
function setUserInterface(){
    
    const buttonsContainer = document.createElement("section");
    buttonsContainer.classList.add("buttonsContainer");

    const addBottlesBt = document.createElement("button");
    const reportBottlesBt = document.createElement("button");
    addBottlesBt.textContent = "Add bottles"
    addBottlesBt.classList.add("icon-addBottles");
    addBottlesBt.setAttribute("data-bs-toggle","modal");
    addBottlesBt.setAttribute("data-bs-target","#addBottelsModal")

    reportBottlesBt.textContent = "report"
    reportBottlesBt.classList.add("icon-report");
    reportBottlesBt.setAttribute("data-bs-toggle","modal");
    reportBottlesBt.setAttribute("data-bs-target","#reportModal");
    

    buttonsContainer.appendChild(addBottlesBt);
    buttonsContainer.appendChild(reportBottlesBt);
    return buttonsContainer;
}
function createLocationDataContainer(product) {
    const locationDataContainer = document.createElement("section");
    
    locationDataContainer.classList.add("locationDataContainer");

    for (const key in product) {
        if (key === "city" || key === "Landmarks") {
            continue;
        }
        let dataLine = document.createElement("span");
        switch (key) {
            case "id":
              dataLine.innerText = "container id: " + product[key];
              dataLine.classList.add("icon-id");
            break;
            case "street":
                dataLine.innerText = product[key] + " street " + product["city"];
                dataLine.classList.add("icon-street");
            break;
            case "food":
                dataLine.innerText = product[key];
                dataLine.classList.add("icon-food");
            break;
            case "status":
                dataLine.innerText = product[key];
                if (product[key] == "active")
                {
                    dataLine.classList.add("icon-active");
                    dataLine.style.color = "#38AD2E"
                }else if(product[key] == "inactive")
                {
                    dataLine.classList.add("icon-inactive");
                    dataLine.style.color = "#FF0000";
                }
            break;
            case "level":
                dataLine.innerText = "food level: " + product[key];
                dataLine.classList.add("icon-level");
            break;
        }
        locationDataContainer.appendChild(dataLine);
    }
    locationDataContainer.appendChild(setUserInterface());
    return locationDataContainer;
}
function createMap(landmarks){

   const map = L.map('objectMap').setView([landmarks.longitude,landmarks.latitude], 20); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
    }).addTo(map);

   L.marker([landmarks.longitude,landmarks.latitude])
    .addTo(map)
    
    return map;
}
function setLocationData(product) {
    
    const pageHeadLine = document.createElement("h1");
    pageHeadLine.innerText = product.street + " street"
    const mainPageContainer = document.createElement("section");
    mainPageContainer.classList.add("mainPageContainer");
    mainPageContainer.appendChild(createLocationDataContainer(product));
    const mapSection = document.createElement("section");
    mapSection.id = "objectMap";
    
    mainPageContainer.appendChild(mapSection);

    document.getElementById("warraper").appendChild(pageHeadLine);
    document.getElementById("warraper").appendChild(mainPageContainer);

    createMap(product.Landmarks);
}
function loadPageObject(data) {
    let locationId = getObjectId();
    for (const product of data.products) {
        if (product.id == locationId ) {
            setPageTitle(product);
            setLocationData(product);
            break;
        }    
    }
    
}
window.onload = () => {
    fetch("data/locations.json")
        .then(Response => Response.json())
        .then(data => loadPageObject(data))
   
}