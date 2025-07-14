let map;
const pendingMarkers = [];
function getPageTitle() {
    const aKeyValue = window.location.search.substring(1).split('&');
    const newPageTitle = aKeyValue[0].split("=")[1];

    let oldPageTitle = document.getElementsByClassName("breadcrumb")[0];
    oldPageTitle.children[0].innerText = newPageTitle;

    let pageRoadTrial = document.getElementsByClassName("breadcrumb")[1];
    let pagePosition = document.createElement("li");
    pagePosition.classList.add("breadcrumb-item", "active");
    let pagePositionTitle = document.createElement("a");
    pagePositionTitle.href = "listPage.html?pageTitle=Locations";
    pagePositionTitle.innerText = newPageTitle;

    pagePosition.appendChild(pagePositionTitle);
    pageRoadTrial.appendChild(pagePosition);
}
function populateAnimalFood(){
    const animalOptions = ['Dog food','Cat food','Cat and dog food'];
    const select = document.getElementById("animalFood");
    animalOptions.forEach(optionText =>{
        const opt = document.createElement("option");
        opt.value = optionText;
        opt.innerText = optionText;
        select.appendChild(opt);
    })
}
function populateStatus(){
    const statusOptions = ['active','inactive'];
    const select = document.getElementById("status");
    statusOptions.forEach(optionText =>{
        const opt = document.createElement("option");
        opt.value = optionText;
        opt.innerText = optionText;
        select.appendChild(opt);
    })
}
async function getNewLocationData(){
    
    const city = document.getElementById("cityName").value;
    
    const street = document.getElementById("streetName").value;
    const animalFood = document.getElementById("animalFood").value;
    const status = document.getElementById("status").value;
    
    const newLocation = {
        city: city,
        streetName: street,
        animalFood: animalFood,
        status: status
    };
    try{
        const response = await fetch("http://localhost:8081/api/locations/newLocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({newLocation})
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }

    alert("The new location has been submitted successfully.");
    location.reload();
    }catch(error){
         console.error("Form send error:", error.message);
        alert("Failed to send From: " + error.message);
    }
}
function setAddLocationModel() {
    const modalBody = document.getElementById("addLocationModalBody");
    modalBody.innerHTML = "";

    const form = document.createElement("form");
    form.id = "addLocationForm";
    form.className = "row g-3 needs-validation";
    form.noValidate = true;

    const citySection = document.createElement("section");
    citySection.className = "col-md-6";
    citySection.innerHTML = `
        <label for="cityName" class="form-label">City</label>
        <input type="text" class="form-control" id="cityName" name="city" required>
    `;
    form.appendChild(citySection);

    const streetSection = document.createElement("section");
    streetSection.className = "col-md-6";
    streetSection.innerHTML = `
        <label for="streetName" class="form-label">Street</label>
        <input type="text" class="form-control" id="streetName" name="street" required>
    `;
    form.appendChild(streetSection);
        
    const foodSection = document.createElement("section");
    foodSection.className = "col-md-6";
    foodSection.innerHTML = `
        <label for="animalFood" class="form-label">Animal Food Type</label>
        <select class="form-select" id="animalFood" name="animalFood" required>
            <option selected disabled value="">Choose...</option>
        </select>
    `;
    form.appendChild(foodSection);

    const statusSection = document.createElement("section");
    statusSection.className = "col-md-6";
    statusSection.innerHTML = `
        <label for="status" class="form-label">Status</label>
        <select class="form-select" id="status" name="status" required>
            <option selected disabled value="">Choose...</option>
        </select>
    `;
    form.appendChild(statusSection);

    const submitSection = document.createElement("section");
    submitSection.className = "col-12";
    submitSection.innerHTML = `
        <button type="submit" class="btn btn-success">Add Location</button>
    `;
    form.appendChild(submitSection);

    modalBody.appendChild(form);

    populateAnimalFood();
    populateStatus();

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        await getNewLocationData();
    });
    const modal = new bootstrap.Modal(document.getElementById("addLocationModal"));
    modal.show();
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
        location.reload();
    } catch (err) {
        console.error("Delete request error:", err.message);
        alert("Failed to delete location: " + err.message);
    }

}
function createLocationCard(product) {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userType = userData.user_type;
    const ulFrag = document.createDocumentFragment();
    const locationCard = document.createElement("a");
    locationCard.href = `objectPage.html?locationId=${product.location_id}`;
    ulFrag.appendChild(locationCard);

    for (const key in product) {
        const cardData = document.createElement("span");
        if (key === "landmarks") {
            const [lat, lng] = product[key].split(',').map(Number);
            addLocationToMap(lat, lng, product);
            continue;
        }else{
            if (product[key] == "active")
            {
                cardData.classList.add("icon-active");
                cardData.style.color = "#38AD2E"
            }else if(product[key] == "inactive")
            {
                cardData.classList.add("icon-inactive");
                cardData.style.color = "#FF0000";
            }else{
                cardData.classList.add(`icon-${key.toLowerCase()}`);
            }
            cardData.innerText = product[key];
            if (key == "food_capacity") {
                cardData.innerText = product[key] +"%";
            }
            locationCard.appendChild(cardData);
        } 
        
    }
    if (userType === "admin") {
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("icon-trash");
        deleteBtn.classList.add("delete");

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            deleteLocation(product.location_id); 
        });

        locationCard.appendChild(deleteBtn);
       const addLocationBtn =   document.getElementById("addLocationBtn");
        addLocationBtn.style.display = "block";
        addLocationBtn.addEventListener("click",setAddLocationModel);
    }

    return ulFrag;
}
function  initializeListPage(data) {

    const listContainer = document.getElementsByClassName("listContainer")[0];

    for (const product of data) {
        const locationCard = createLocationCard(product);
        listContainer.appendChild(locationCard);
    }

    document.getElementById("wrapper").appendChild(listContainer);
}
function displayCategoryMenu(categoryButton) {
    const menu = document.getElementById("categoryMenu");
    const modalElement = document.getElementById("exampleModal");
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);

    if (window.innerWidth >= 375 && window.innerWidth <= 768) {
        categoryButton.setAttribute("data-bs-toggle", "modal");
        categoryButton.setAttribute("data-bs-target", "#exampleModal");

        modalInstance.show(); 
    } else {
       
        if (menu.style.display === "block") {
            menu.style.display = "none";
        } else {
            const Container = document.getElementsByClassName("listContainer")[0];
            let locationList = Container.getElementsByTagName("a");

            for (const location of locationList) {
                location.style.display = "flex";
            }
            menu.style.display = "block";
        }
         
    }
}

function checkInputContent(value,locationCards){
        if(value.trim() === "" || value.trim().length === 0){
        for(i = 0;i < locationCards.length; i++){
            
            locationCards[i].style.display="flex";
        }
    }
}
function changeLocationCardsDisplay(locationCards,value){
    
    for (const card of locationCards) {
        
        const city = card.getElementsByClassName("icon-city_name")[0].innerText.toLowerCase();
        const street = card.getElementsByClassName("icon-street")[0].innerText.toLowerCase();
        
        const food = card.getElementsByClassName("icon-animal_food")[0].innerText.toLowerCase();
        const isActive = card.querySelector(".icon-active") !== null;
        const isInactive = card.querySelector(".icon-inactive") !== null;
        
        if (city.includes(value) || street.includes(value) || food.includes(value) || (value === "active" && isActive) || (value === "inactive" && isInactive)) {
            card.style.display = "flex";
        }else{    
            card.style.display = "none";
        }
    }
}
function searchByCategory(value){
    const main = document.getElementsByClassName("listContainer")[0];
    let locationCards = main.getElementsByTagName("a");
    changeLocationCardsDisplay(locationCards,value);
}
function searchLocation() {
    let inputField = document.getElementById("locationSourceBar");
    const main = document.getElementsByClassName("listContainer")[0];
    let locationCards = main.getElementsByTagName("a");

    let value = inputField.value.toLowerCase();
    checkInputContent(value,locationCards);
    changeLocationCardsDisplay(locationCards,value);
    
}
function addLocationToMap(lat, lng, product) {
    if (!map) {
        pendingMarkers.push({ lat, lng, product });
        return;
    }
    const {
        location_id,
        city_name,
        street,
        animal_food,
        status,
        food_capacity
    } = product;
  const popupContent = `
    <a href="objectPage.html?locationId=${location_id}" style="color: black; text-decoration: none;">
        <strong>${city_name}, ${street}</strong><br/>
        <span><b>Food:</b> ${animal_food}</span><br/>
        <span><b>Status:</b> <span style="color:${status === 'active' ? 'green' : 'red'}">${status}</span></span><br/>
        <span><b>Food level:</b> ${food_capacity}</span>
    </a>`;

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(popupContent)
}
function createMap(){
    if (map) return;
    map = L.map('map').setView([32.19261402429747, 34.87351857279742], 14); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
    }).addTo(map);

   pendingMarkers.forEach(m => addLocationToMap(m.lat, m.lng, m.product));
}
function changePageView(){
    const main = document.getElementsByClassName("listContainer")[0];
    const viewButton = document.getElementsByClassName("page-view-input")[0];
    const map = document.getElementById("map");
    
    if(main.style.display === "none"){
        viewButton.classList.remove("icon-list");
        viewButton.classList.add("icon-map");
        viewButton.innerText = "map view"
        main.style.display = "flex";
        map.style.display = "none";
    }else{
        viewButton.classList.remove("icon-map");
        viewButton.classList.add("icon-list");
        viewButton.innerText = "list view"
        main.style.display = "none";
        map.style.display = "block";
        createMap()
    }
}

function getCardsDataFromServer(){
    fetch("http://localhost:8081/api/locations/Locations")
        .then(Response => Response.json())
        .then(data => initializeListPage(data))
        .catch(error => {
            console.error("Fetch error:", error);
        });
}
window.onload = () => {
    getPageTitle();
    getCardsDataFromServer();
    setupEventListeners();
};

function setupEventListeners() {
    const modalElement = document.getElementById("exampleModal");
    const closeButton = document.getElementById("closeButton");
    const categoryButton = document.getElementById("categoryButton");
    const searchBar = document.getElementById("locationSourceBar");
    const closeModalBtn = document.getElementsByClassName("btn-close")[0];
    const viewInput = document.getElementsByClassName("page-view-input")[0];
    const clickableSpans = document.querySelectorAll(".clickableSpan");
    
    categoryButton.addEventListener("click", e => displayCategoryMenu(e.target));
    searchBar.addEventListener("input", searchLocation);
    viewInput.addEventListener("click", changePageView);
    
    document.querySelectorAll(".subMenu").forEach(btn =>
        btn.addEventListener("click", e => searchByCategory(e.target.innerText.toLowerCase()))
    );

    clickableSpans.forEach(span => {
        span.addEventListener("click", () => {
            clickableSpans.forEach(s => s.classList.remove("highlighted"));
            span.classList.toggle("highlighted");
            if (span.classList.contains("highlighted")) {
                localStorage.setItem("userChoice", span.innerText);
            }
        });
    });

    closeModalBtn.addEventListener("click", () => document.activeElement.blur());

    closeButton.addEventListener("click", () => {
        const userChoice = localStorage.getItem("userChoice");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
        document.activeElement.blur();
        if (userChoice) searchByCategory(userChoice.toLowerCase());
    });

    modalElement.addEventListener("hidden.bs.modal", () => {
        document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("padding-right");
    });
}

let wasSmallScreen = window.innerWidth <= 768;

let isMenuOpenManually = false;

window.addEventListener("resize", () => {
    const menu = document.getElementById("categoryMenu");
    const CategoryText = document.getElementById("CategoryText");
    const modalElement = document.getElementById("exampleModal");

    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalElement);
    }

    const isSmallScreen = window.innerWidth <= 768;

    if (isSmallScreen && !wasSmallScreen) {
        
        CategoryText.setAttribute("data-bs-toggle", "modal");
        CategoryText.setAttribute("data-bs-target", "#exampleModal");

        if (menu.style.display === "block") {
            modalInstance.show();
        }

        menu.style.display = "none";
        
    }

    if (!isSmallScreen && wasSmallScreen) {
    
        if (modalInstance._isShown) {
            modalInstance.hide();
            document.activeElement.blur();
        }

        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');

   
        CategoryText.removeAttribute("data-bs-toggle");
        CategoryText.removeAttribute("data-bs-target");

        localStorage.removeItem("userChoice");
        document.querySelectorAll(".clickableSpan").forEach(span => {
            span.classList.remove("highlighted");
        });

        menu.style.display = isMenuOpenManually ? "block" : "none";
    }

    wasSmallScreen = isSmallScreen;
});