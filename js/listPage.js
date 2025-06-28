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
    const ulFrag = document.createDocumentFragment();
    const locationCard = document.createElement("a");
    locationCard.href = `objectPage.html?locationId=${product.id}`;
    ulFrag.appendChild(locationCard);

    for (const key in product) {
        const cardData = document.createElement("span");
        if (key === "Landmarks") {
            addLocationToMap(product[key].longitude,product[key].latitude,product);
            
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

            locationCard.appendChild(cardData);
        } 
        
    }

    return ulFrag;
}
function  initializeListPage(data) {
    const listContiner = document.getElementsByClassName("listContiner")[0];

    for (const product of data.products) {
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
        
        const city = card.getElementsByClassName("icon-city")[0].innerText.toLowerCase();
        const street = card.getElementsByClassName("icon-street")[0].innerText.toLowerCase();
        
        const food = card.getElementsByClassName("icon-food")[0].innerText.toLowerCase();
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
        id,
        city,
        street,
        food,
        status,
        level
    } = product;
  const popupContent = `
    <a href="objectPage.html?locationId=${id}" style="color: black; text-decoration: none;">
        <strong>${city}, ${street}</strong><br/>
        <span><b>Food:</b> ${food}</span><br/>
        <span><b>Status:</b> <span style="color:${status === 'active' ? 'green' : 'red'}">${status}</span></span><br/>
        <span><b>Food level:</b> ${level}</span>
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
window.onload = () => {
    getPageTitle();
    
    fetch("data/locations.json")
        .then(Response => Response.json())
        .then(data => initializeListPage(data))
    document.getElementById("catgoryButton").addEventListener("click",(event) => {
        
        displayCategoryMenu(event.target);
    });
    document.querySelectorAll(".subMenu").forEach(btn => {
        btn.addEventListener("click", (event) => {
            searchByCategory(event.target.innerText.toLowerCase());
        });
    });
    document.getElementById("locationSourceBar").addEventListener("input",searchLocation);
    
    const clickableSpans = document.querySelectorAll(".clickableSpan");
    clickableSpans.forEach(span => {
        span.addEventListener('click', function() {

            clickableSpans.forEach(s => s.classList.remove("highlighted"));
            this.classList.toggle("highlighted");
            if (this.classList.contains('highlighted')) {
                localStorage.setItem("userChoice",this.innerText);
            }
        });
    });
    document.getElementsByClassName("btn-close")[0].addEventListener("click",()=> {
        document.activeElement.blur();
    })
    document.getElementById("closeButton").addEventListener("click",() => {
        const userChoice = localStorage.getItem("userChoice");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
            document.activeElement.blur();
        }
        if(userChoice === null){
            return;
        }
        searchByCategory(userChoice.toLowerCase());
    })

    const modalElement = document.getElementById("exampleModal");

    modalElement.addEventListener('hidden.bs.modal', () => {
        
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(b => b.remove());

        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');

    });
    document.getElementsByClassName("page-view-input")[0].addEventListener("click",()=>{
        changePageView();
    })
    
};
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