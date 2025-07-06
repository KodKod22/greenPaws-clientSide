function setPageTitle(product){
    let oldPageTitle = document.getElementsByClassName("breadcrumb")[0];
    oldPageTitle.children[0].innerText = product.street + " st " + product.cityname;

    let pageRoadTrial = document.getElementsByClassName("breadcrumb")[1];
    let pagePosition = document.createElement("li");
    pagePosition.classList.add("breadcrumb-item", "active");
    let pagePositionTitle = document.createElement("a");
    pagePositionTitle.href = "listPage.html?pageTitle=Locations";
    pagePositionTitle.innerText = product.street + " st " + product.cityname;

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
        if (key === "cityname" || key === "landmarks") {
            continue;
        }
        let dataLine = document.createElement("span");
        switch (key) {
            case "locationsid":
              dataLine.innerText = "container id: " + product[key];
              dataLine.classList.add("icon-locationsid");
            break;
            case "street":
                dataLine.innerText = product[key] + " street " + product["cityname"];
                dataLine.classList.add("icon-street");
            break;
            case "animelfood":
                dataLine.innerText = product[key];
                dataLine.classList.add("icon-animelfood");
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
            case "foodcapacity":
                dataLine.innerText = "food level: " + product[key]+"%";
                dataLine.classList.add("icon-foodcapacity");
            break;
        }
        locationDataContainer.appendChild(dataLine);
    }
    locationDataContainer.appendChild(setUserInterface());
    return locationDataContainer;
}
function createMap(landmarks) {
    const [lat, lng] = landmarks.split(',').map(Number);

    const map = L.map('objectMap').setView([lat, lng], 20);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map);

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
    
    createMap(product.landmarks);
}
function loadPageObject() {
    let locationId = getObjectId();
    fetch(`http://localhost:8081/api/locations/${locationId}`)
        .then(Response => Response.json())
        .then(data => {
            const location = data[0];
            setPageTitle(location);
            setLocationData(location);
        })
}
function sendToServerNumBottles(){
    const bottlesValue = document.getElementById("bottles").value;
    const locationIdText = document.querySelector(".icon-locationsid").innerText;
    const locationId = locationIdText.split(":")[1].trim();
     const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userId = userData.userId;
    fetch("http://localhost:8081/api/locations/addBottles",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            userID:userId,
            locationId:locationId, 
            bottleCount:bottlesValue
        })
    })
     .then(async response => {
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message);
        }
        return response.json();
    })
    .then(data => {
        alert("Number of bottles added successfully!");
        location.reload();
    })
    .catch(error => {
        console.error("Error:", error.message);
        alert("Failed to add bottles: " + error.message);
    });
}
async function sendToServerReport(data) {
    console.log("Sending data to server:", data);
    try{
        const response = await fetch("http://localhost:8081/api/requests/addRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: data.userId,
            locationId: Number(data.locationId),
            description: data.description.trim()
        })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }

    alert("Report submitted successfully.");
    }catch(error){
         console.error("Report send error:", error.message);
        alert("Failed to send report: " + error.message);
    }
}
function  getDataToSend(locationId){
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const userId = userData?.userId;

    const selectedRadio = document.querySelector('input[name="exampleRadios"]:checked');
    const otherText =  document.getElementById("other").value.trim();
    let description = "";

    if (selectedRadio) {
        description = selectedRadio.nextElementSibling.innerText;
    }

    if (otherText !== "") {
        description = otherText;
    }
    const data ={
        userId:userId,
        locationId:Number(locationId),
        description
    }
    sendToServerReport(data)
}
window.onload = () => {
    loadPageObject();
    document.getElementById("addBottelsBtn").addEventListener("click",sendToServerNumBottles);
    document.getElementById("reportBtn").addEventListener("click",()=>{
         let locationId = getObjectId();
        getDataToSend(locationId);
    });
}