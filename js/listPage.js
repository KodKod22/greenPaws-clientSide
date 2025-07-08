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
function createLocationCard(product) {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userType = userData.userType;
    const ulFrag = document.createDocumentFragment();
    const locationCard = document.createElement("a");
    locationCard.href = `objectPage.html?locationId=${product.locationsid}`;
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
            if (key == "foodcapacity") {
                cardData.innerText = product[key] +"%";
            }
            locationCard.appendChild(cardData);
        } 
        
    }
    if (userType === "admin") {
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("icon-trash");

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            deleteLocation(product.locationsid); 
        });

        locationCard.appendChild(deleteBtn);
    }

    return ulFrag;
}
function  initializeListPage(data) {

    const listContiner = document.getElementsByClassName("listContiner")[0];

    for (const product of data) {
        const locationCard = createLocationCard(product);
        listContiner.appendChild(locationCard);
    }

    document.getElementById("warraper").appendChild(listContiner);
}
function displayCategoryMenu(catgoryButton) {
    const menu = document.getElementById("catgoryMenu");
    const modalElement = document.getElementById("exampleModal");
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);

    if (window.innerWidth >= 375 && window.innerWidth <= 768) {
        catgoryButton.setAttribute("data-bs-toggle", "modal");
        catgoryButton.setAttribute("data-bs-target", "#exampleModal");

        modalInstance.show(); 
    } else {
       
        if (menu.style.display === "block") {
            menu.style.display = "none";
        } else {
            const Container = document.getElementsByClassName("listContiner")[0];
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
        
        const city = card.getElementsByClassName("icon-cityname")[0].innerText.toLowerCase();
        const street = card.getElementsByClassName("icon-street")[0].innerText.toLowerCase();
        
        const food = card.getElementsByClassName("icon-animelfood")[0].innerText.toLowerCase();
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
    const main = document.getElementsByClassName("listContiner")[0];
    let locationCards = main.getElementsByTagName("a");
    changeLocationCardsDisplay(locationCards,value);
}
function searchLocation() {
    let inputField = document.getElementById("locationSourceBar");
    const main = document.getElementsByClassName("listContiner")[0];
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
        locationsid,
        cityname,
        street,
        animelfood,
        status,
        foodcapacity
    } = product;
  const popupContent = `
    <a href="objectPage.html?locationId=${locationsid}" style="color: black; text-decoration: none;">
        <strong>${cityname}, ${street}</strong><br/>
        <span><b>Food:</b> ${animelfood}</span><br/>
        <span><b>Status:</b> <span style="color:${status === 'active' ? 'green' : 'red'}">${status}</span></span><br/>
        <span><b>Food level:</b> ${foodcapacity}</span>
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
    const main = document.getElementsByClassName("listContiner")[0];
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
    const categoryButton = document.getElementById("catgoryButton");
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
    const menu = document.getElementById("catgoryMenu");
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