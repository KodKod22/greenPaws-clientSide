
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
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}
window.onload = () => {
    getPageTitle();
    fetch("data/locations.json")
        .then(Response => Response.json())
        .then(data => initializeListPage(data))
    document.getElementById("catgoryButton").addEventListener("click",displayCategoryMenu);
};