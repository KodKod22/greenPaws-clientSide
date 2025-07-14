function setPageTitle(product){
    let oldPageTitle = document.getElementsByClassName("breadcrumb")[0];
    oldPageTitle.children[0].innerText = product.street + " st " + product.city_name;

    let pageRoadTrial = document.getElementsByClassName("breadcrumb")[1];
    let pagePosition = document.createElement("li");
    pagePosition.classList.add("breadcrumb-item", "active");
    let pagePositionTitle = document.createElement("a");
    pagePositionTitle.href = "listPage.html?pageTitle=Locations";
    pagePositionTitle.innerText = product.street + " st " + product.city_name;

    pagePosition.appendChild(pagePositionTitle);
    pageRoadTrial.appendChild(pagePosition);
}

function getObjectId() {
    const aKeyValue = window.location.search.substring(1).split('&');
    const objectId = aKeyValue[0].split("=")[1];
    return objectId;
}
function setLocationChart(locationChart){
    const ctx = document.getElementById("locationChart");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [locationChart.street],
      datasets: [{
        label: "The location recycle activity",
        backgroundColor: "green",
        data: locationChart.total_bottles
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'linear',
          beginAtZero: true,
          min: 0,
          ticks: {
            stepSize: 5
          },
        }
      }
    }
  });
}
async function getChartLocationData() {
    try {
        const locationId = getObjectId();
        const response = await fetch(`http://localhost:8081/api/statistics/locationStats/${locationId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch chart data");
        }
        const data = await response.json();
        const locationChart = data[0];
        setLocationChart(locationChart);
    } catch (error) {
        console.error("Error fetching chart data:", error.message);
    }
}
function setChartModel(){
    const modalBody = document.getElementById("modalBody");
    const modelHeader = document.getElementById("modalHeader");
    document.getElementById("modalFooter").innerHTML="";
    modelHeader.getElementsByTagName("h5")[0].innerText = "Location chart"
    const locationChart = document.createElement("canvas");
    locationChart.id = "locationChart";
    locationChart.width = 400;
    locationChart.height = 300;
    modalBody.innerHTML = "";

    modalBody.appendChild(locationChart);
    const modal = new bootstrap.Modal(document.getElementById("modal"));
    modal.show();
}
function setAddBottlesModel(){
    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = ""
    const modelHeader = document.getElementById("modalHeader");
    modelHeader.getElementsByTagName("h5")[0].innerText = "Location recycle station"
    const modalBtn = document.getElementById("modalBtn");
    modalBtn.setAttribute("data-model-type", "addBottles");
    const instruction = document.createElement("p");
    instruction.innerText = "Enter the total number of bottles";
    const label = document.createElement("label");
    label.htmlFor = "bottles";
    label.innerText = "Number of bottles:"

    const input = document.createElement("input");
    input.type = "text";
    input.id = "bottles"
    input.name = "bottles"

    modalBody.appendChild(instruction);
    modalBody.appendChild(label);
    modalBody.appendChild(input);
    const modal = new bootstrap.Modal(document.getElementById("modal"));
    modal.show();
}
function setReportModel(){
    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = ""
    const modelHeader = document.getElementById("modalHeader");
    modelHeader.getElementsByTagName("h5")[0].innerText = "complaint"
    const modalBtn = document.getElementById("modalBtn");
    modalBtn.setAttribute("data-model-type", "report");
    const instruction = document.createElement("p");
    instruction.innerText = "Enter the complaint";
    const label = document.createElement("label");
    label.htmlFor = "complaint";
    label.innerText = "complaint:"

    const input = document.createElement("input");
    input.type = "text";
    input.id = "complaint"
    input.name = "complaint"
    input.style.width = "250px";
    input.style.height = "35px";

    modalBody.appendChild(instruction);
    modalBody.appendChild(label);
    modalBody.appendChild(input);
    const modal = new bootstrap.Modal(document.getElementById("modal"));
    modal.show();
}
function setUserInterface(productStatus){
    
    const buttonsContainer = document.createElement("section");
    buttonsContainer.classList.add("buttonsContainer");

    const addBottlesBt = document.createElement("button");
    const reportBottlesBt = document.createElement("button");
    addBottlesBt.textContent = "Add bottles"
    addBottlesBt.classList.add("icon-addBottles");
    addBottlesBt.addEventListener("click",()=>{
        setAddBottlesModel()
    })

    reportBottlesBt.textContent = "complaint"
    reportBottlesBt.classList.add("icon-report");
    reportBottlesBt.addEventListener("click",()=>{
        setReportModel();
    })
    
    if (productStatus === "inactive") {
        addBottlesBt.disabled = true;
    }

    buttonsContainer.appendChild(addBottlesBt);
    buttonsContainer.appendChild(reportBottlesBt);
    return buttonsContainer;
}
async function deleteLocation(locationId){
      try{
        const response = await fetch(`http://localhost:8081/api/locations/removeLocation/${locationId}`,{
            method:"DELETE",

        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message);
        }
        alert("Location deleted successfully.");
        window.location.assign(document.referrer);
    } catch (err) {
        console.error("Delete request error:", err.message);
        alert("Failed to delete location: " + err.message);
    }
}
function setAdminInterface(){
    const buttonsContainer = document.createElement("section");
    buttonsContainer.classList.add("buttonsContainer");

    const deleteBt = document.createElement("button");
    const statisticsBt = document.createElement("button");
    deleteBt.textContent = "delete location"
    deleteBt.classList.add("icon-trash");
    deleteBt.addEventListener("click",()=>{
        deleteLocation(getObjectId());
    })

    statisticsBt.textContent = "statistics"
    statisticsBt.classList.add("statistics");
    statisticsBt.addEventListener("click",()=>{
        setChartModel();
        getChartLocationData();
    })
    

    buttonsContainer.appendChild(deleteBt);
    buttonsContainer.appendChild(statisticsBt);
    return buttonsContainer;
}
async function updateLocationOnServer(locationData){
    try{
     const response = await fetch(`http://localhost:8081/api/locations/updateLocation`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(locationData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update location");
    }

    const updatedLocation = await response.json();
    alert("Location updated successfully.");
    location.reload();
  } catch (err) {
    console.error("PUT request failed:", err.message);
    alert("Failed to update location: " + err.message);
  }
}
function updateLocation(){
    const locationId = getObjectId();
    const animalFoodValue = document.getElementById("inputAnimalFood").value.trim();
    const selectStatusValue = document.getElementById("selectStatus").value;
    const foodLevel = document.getElementById("inputFoodLevel").value.trim();

    const locationData = {
        locationId:locationId,
        animalFood:animalFoodValue || undefined,
        status:selectStatusValue,
        foodCapacity:foodLevel || undefined
    }
    updateLocationOnServer(locationData);
}
function changeTags(){
    const editBtn = document.querySelector(".editBt");
    const spanAnimalFood = document.querySelector(".icon-animal_food");
    const spanStatus = document.querySelector(".icon-active, .icon-inactive");
    const spanFoodLevel = document.querySelector(".icon-food_capacity")
    
    const inputAnimalFood = document.createElement("input");
    inputAnimalFood.placeholder = spanAnimalFood.innerText;
    inputAnimalFood.id = "inputAnimalFood";
    spanAnimalFood.replaceWith(inputAnimalFood);

     const selectStatus = document.createElement("select");
     selectStatus.id = "selectStatus";
    const options = ["active", "inactive"];

    options.forEach(status => {
        const option = document.createElement("option");
        option.value = status;
        option.text = status;
        if (spanStatus.innerText.toLowerCase() === status) {
            option.selected = true;
        }
        selectStatus.appendChild(option);
    });

    spanStatus.replaceWith(selectStatus);

    const inputFoodLevel = document.createElement("input");
    inputFoodLevel.placeholder = spanFoodLevel.innerText.split(":")[1].split("%")[0];
    inputFoodLevel.id = "inputFoodLevel"
    spanFoodLevel.replaceWith(inputFoodLevel);

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "save";
    saveBtn.classList.add("editBt");
    saveBtn.addEventListener("click",()=>{
        updateLocation();
    })
    editBtn.replaceWith(saveBtn);
}
function createLocationDataContainer(product) {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userType = userData.user_type;
    const locationDataContainer = document.createElement("section");
    
    locationDataContainer.classList.add("locationDataContainer");

    for (const key in product) {
        if (key === "city_name" || key === "landmarks") {
            continue;
        }
        let dataLine = document.createElement("span");
        switch (key) {
            case "location_id":
              dataLine.innerText = "container id: " + product[key];
              dataLine.classList.add("icon-location_id");
            break;
            case "street":
                dataLine.innerText = product[key] + " street " + product["city_name"];
                dataLine.classList.add("icon-street");
            break;
            case "animal_food":
                dataLine.innerText = product[key];
                dataLine.classList.add("icon-animal_food");
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
            case "food_capacity":
                dataLine.innerText = "food level: " + product[key]+"%";
                dataLine.classList.add("icon-food_capacity");
            break;
        }
        locationDataContainer.appendChild(dataLine);
    }
    if (userType === "admin") {
        
        const editBt = document.createElement("button");
        editBt.textContent = "edit";
        editBt.classList.add("icon-report");
        editBt.classList.add("editBt");
        editBt.addEventListener("click",()=>{
            changeTags();
        })
        locationDataContainer.appendChild(editBt);
        locationDataContainer.appendChild(setAdminInterface());
    }else{
        locationDataContainer.appendChild(setUserInterface(product["status"]));
    }
    
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

    document.getElementById("wrapper").appendChild(pageHeadLine);
    document.getElementById("wrapper").appendChild(mainPageContainer);
    
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
    
    const locationId = getObjectId();
    
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userId = userData.userId;
    
    fetch("http://localhost:8081/api/locations/addBottles",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            userId:Number(userId),
            locationId:Number(locationId), 
            bottleCount:Number(bottlesValue)
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

    const otherText =  document.getElementById("complaint").value.trim();
    let description = "";
    description = otherText;
    
    const data ={
        userId:userId,
        locationId:Number(locationId),
        description
    }
    sendToServerReport(data)
}
window.onload = () => {
    loadPageObject();


    document.getElementById("modalBtn").addEventListener("click", () => {
    const modalType = document.getElementById("modalBtn").getAttribute("data-model-type");

    switch(modalType) {
        case "addBottles":
            sendToServerNumBottles();
            document.activeElement.blur();
            break;
        case "report":
            const locationId = getObjectId();
            getDataToSend(locationId);
            document.activeElement.blur();
            break;
    }
        
    });
  
    document.querySelectorAll(".btn-close").forEach(element => {
        element.addEventListener("click", () => {
            document.activeElement.blur();
        });
    });  
}