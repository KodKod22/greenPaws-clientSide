function userNavContainerCreator() {
    const Container = document.createElement("div");
    Container.id = "userNavContainer";
    const reportsLink = document.createElement("a");
    reportsLink.href = "#";
    const locationsLink = document.createElement("a");
    locationsLink.href = `listPage.html?pageTitle=Locations`;
    const activityLink = document.createElement("a");
    activityLink.href = "#";

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
function initializeHomePage() {
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

window.onload = () => {
    initializeHomePage();
};