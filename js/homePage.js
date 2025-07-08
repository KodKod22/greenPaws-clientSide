let map;
const pendingMarkers = [];
function userNavContainerCreator() {
    const Container = document.createElement("div");
    Container.id = "navContainer";
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
function adminNavContainerCreator(){
    const Container = document.createElement("div");
    Container.id = "navContainer";
    const addLocationLink = document.createElement("a");
    addLocationLink.href = "addLocation.html?pageTitle=Add new location";
    const locationsLink = document.createElement("a");
    locationsLink.href = `listPage.html?pageTitle=Locations`;
    const statisticsLink = document.createElement("a");
    statisticsLink.href = `graphPage.html?pageTitle=Statistics`;

    const addLocationTitle = document.createElement("span");
    addLocationTitle.innerText = "add Location";
    const locationsTitle = document.createElement("span");
    locationsTitle.innerText = "locations";
    const statisticsTitle = document.createElement("span");
    statisticsTitle.innerText = "statistics"

    const svgAddIcon = document.createElement("div");
    svgAddIcon.classList.add("addIcon");
    const svgRecycleIcon = document.createElement("div");
    svgRecycleIcon.classList.add("recycleIcon");
    const svgActivityIcon = document.createElement("div");
    svgActivityIcon.classList.add("activityIcon");

    addLocationLink.appendChild(svgAddIcon);
    addLocationLink.appendChild(addLocationTitle);

    locationsLink.appendChild(svgRecycleIcon);
    locationsLink.appendChild(locationsTitle);

    statisticsLink.appendChild(svgActivityIcon);
    statisticsLink.appendChild(statisticsTitle);

    Container.appendChild(addLocationLink);
    Container.appendChild(locationsLink);
    Container.appendChild(statisticsLink);

    return Container;

}
function renderRequests(reports){
    const container = document.getElementById("notificationsContainer");

    const list = document.createElement("ul");
    list.id = "notificationsList";

    const newReports = reports.filter(report => report.status === "new");
      if (newReports.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.innerText = "No new reports.";
        container.appendChild(emptyMsg);
        return;
    }

    newReports.forEach(report =>{
        const item = document.createElement("li");
        const title = document.createElement("h4");
        title.innerText = `${report.username} | ${report.street}`;
        const status = document.createElement("span");
        status.style.color = "#A8D5BA";
        status.innerText = report.status;
        const desc = document.createElement("span");
        desc.innerText = report.description.length > 100 
            ? report.description.slice(0, 100) + "..." 
            : report.description;

        item.appendChild(title);
        item.appendChild(status);
        item.appendChild(desc);

        list.appendChild(item);
    })
    container.appendChild(list);
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
    map = L.map('sectionMap').setView([32.19261402429747, 34.87351857279742], 14); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    pendingMarkers.forEach(m => addLocationToMap(m.lat, m.lng, m.product));
}
function initializeLocationPoints(data){
    data.forEach(location => {
         const [lat, lng] = location["landmarks"].split(',').map(Number);
            addLocationToMap(lat, lng, location);
    });
}
function getLocationsDataFromServer(){
    fetch("http://localhost:8081/api/locations/Locations")
        .then(Response => Response.json())
        .then(data => initializeLocationPoints(data))
        .catch(error => {
            console.error("Fetch error:", error);
        });
}
async function getReportFromServer(){
    
  try {
    const response = await fetch(`http://localhost:8081/api/requests/requests`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length === 0) {
      document.querySelector(".listContiner").innerText = "You don't have any reports yet.";
      return;
    }

    renderRequests(data);
  } catch (error) {
    console.error("Request fetch error:", error.message);
    alert("Failed to load request data: " + error.message);
  }
}
function initializeAdminHomePage(){
    const warraper = document.getElementById("warraper");
    let userNavContainer = document.createElement("div");
    const infoContainer = document.createElement("section");
    infoContainer.classList.add("infoContainer");
    userNavContainer = adminNavContainerCreator();
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
    getReportFromServer();
}
function setHomePage(){
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userType = userData.userType;
    
    if (userType === "admin") {
        initializeAdminHomePage();
        getLocationsDataFromServer();
    }else{
        initializeUserHomePage();
    }
}
window.onload = () => {
    setHomePage();
};