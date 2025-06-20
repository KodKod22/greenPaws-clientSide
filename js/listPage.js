
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
    locationCard.href = "objectPage.html";
    ulFrag.appendChild(locationCard);

    for (const key in product) {
        const cardData = document.createElement("span");

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
function displayCategoryMenu() {
    const menu = document.getElementById("catgoryMenu");

    if (menu.style.display === "block") {
      
        menu.style.display = "none"
    }else{
        const Container = document.getElementsByClassName("listContiner")[0];
        let locationList = Container.getElementsByTagName("a");
        
        for (const location of locationList) {
            location.style.display = "flex";
        }
        menu.style.display = "block"
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
    console.log(value);
    
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
    changeLocationCardsDisplay(locationCards,value.innerText.toLowerCase());
}
function searchLocation() {
    let inputField = document.getElementById("locationSourceBar");
    const main = document.getElementsByClassName("listContiner")[0];
    let locationCards = main.getElementsByTagName("a");

    let value = inputField.value.toLowerCase();
    checkInputContent(value,locationCards);
    changeLocationCardsDisplay(locationCards,value);
    
}

window.onload = () => {
    getPageTitle();
    fetch("data/locations.json")
        .then(Response => Response.json())
        .then(data => initializeListPage(data))
    document.getElementById("catgoryButton").addEventListener("click",displayCategoryMenu);
    document.getElementById("catgoryMenu").addEventListener("click",(event) => {
        searchByCategory(event.target);
    })
    document.getElementById("locationSourceBar").addEventListener("input",searchLocation);
    
};