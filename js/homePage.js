let map;
function userNavContainerCreator() {
    const Container = document.createElement("div");
    Container.id = "userNavContainer";
    const reportsLink = document.createElement("a");
    reportsLink.href = "reportPage.html?pageTitle=Reports";
    const locationsLink = document.createElement("a");
    locationsLink.href = `listPage.html?pageTitle=Locations`;
    const activityLink = document.createElement("a");
    activityLink.href = `graphPage.html?pageTitle=Activity`;

    const reportsTitle = document.createElement("span");
    reportsTitle.innerText = "reports";
    const locationsTitle = document.createElement("span");
    locationsTitle.innerText = "locations";
    const activityTitle = document.createElement("span");
    activityTitle.innerText = "activity"

    const svgChatDotsIcon = document.createElement("div");
    svgChatDotsIcon.classList.add("chatDotsIcon");
    const svgRecycleIcon = document.createElement("div");
    svgRecycleIcon.classList.add("recycleIcon");
    const svgActivityIcon = document.createElement("div");
    svgActivityIcon.classList.add("activityIcon");

    reportsLink.appendChild(svgChatDotsIcon);
    reportsLink.appendChild(reportsTitle);

    locationsLink.appendChild(svgRecycleIcon);
    locationsLink.appendChild(locationsTitle);

    activityLink.appendChild(svgActivityIcon);
    activityLink.appendChild(activityTitle);

    Container.appendChild(reportsLink);
    Container.appendChild(locationsLink);
    Container.appendChild(activityLink);

    return Container;
}
function initializeUserHomePage() {
    const warraper = document.getElementById("warraper");
    const pageTitle = document.createElement("h1");
    const dogAndCatImg = document.createElement("img");
    let userNavContainer = document.createElement("div");
    
    pageTitle.innerText = "Recycle Containers Feed Animals";
    dogAndCatImg.src = "images/STRAY-DOGS-CATSCo-Exist-with-People-in-Sri-Lanka.jpg";
    dogAndCatImg.title = "dog and Cat";
    dogAndCatImg.alt = "dog and Cat";
    userNavContainer = userNavContainerCreator();
    
    warraper.appendChild(pageTitle);
    warraper.appendChild(dogAndCatImg);
    warraper.appendChild(userNavContainer);
}
function createMap(){
    if (map) return;
    map = L.map('sectionMap').setView([32.19261402429747, 34.87351857279742], 14); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
    }).addTo(map);

}
function initializeAdminHomePage(){
    const warraper = document.getElementById("warraper");
    let userNavContainer = document.createElement("div");
    const infoContainer = document.createElement("section");
    infoContainer.classList.add("infoContainer");
    userNavContainer = userNavContainerCreator();
    const notificationsWrapper = document.createElement("div");
    const notificationsContainer = document.createElement("section");
    notificationsContainer.id = "notificationsContainer"
    const notificationHeadline = document.createElement("h2");
    notificationHeadline.innerText = "Notifications";
    notificationsWrapper.appendChild(notificationHeadline);
    notificationsWrapper.appendChild(notificationsContainer);

    const mapWrapper = document.createElement("div");
    const mapHeadline = document.createElement("h2");
    mapHeadline.innerText = "Locations Map"
    const mapSection = document.createElement("section");
    mapSection.id = "sectionMap";
    mapWrapper.appendChild(mapHeadline);
    mapWrapper.appendChild(mapSection);

    infoContainer.appendChild(notificationsWrapper);
    infoContainer.appendChild(mapWrapper);
    
    
    warraper.appendChild(infoContainer);
    warraper.appendChild(userNavContainer);
    createMap();
}
function setHomePage(){
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userType = userData.userType;
    
    if (userType === "admin") {
        initializeAdminHomePage();
    }else{
        initializeUserHomePage();
    }
}
window.onload = () => {
    setHomePage();
};