function getPageTitle() {
    const aKeyValue = window.location.search.substring(1).split('&');
    const newPageTitle = aKeyValue[0].split("=")[1];

    let oldPageTitle = document.getElementsByClassName("breadcrumb")[0];
    oldPageTitle.children[0].innerText = newPageTitle;

    let pageRoadTrial = document.getElementsByClassName("breadcrumb")[1];
    let pagePosition = document.createElement("li");
    pagePosition.classList.add("breadcrumb-item");
    let pagePositionTitle = document.createElement("a");
    pagePositionTitle.href = "listPage.html?pageTitle=Locations";
    pagePositionTitle.innerText = newPageTitle;

    pagePosition.appendChild(pagePositionTitle);
    pageRoadTrial.appendChild(pagePosition);
}


window.onload = () => {
    getPageTitle();
    
};