function userNavContainerCreator() {
    const Container = document.createElement("div");
    Container.id = "userNavContainer";
    const link1 = document.createElement("a");
    link1.href = "#";
    const link2 = document.createElement("a");
    link2.href = "#";
    const link3 = document.createElement("a");
    link3.href = "#";

    const linkTitle1 = document.createElement("span");
    linkTitle1.innerText = "reports";
    const linkTitle2 = document.createElement("span");
    linkTitle2.innerText = "locations";
    const linkTitle3 = document.createElement("span");
    linkTitle3.innerText = "activity"

    const svgString1 = document.createElement("div");
    svgString1.classList.add("chatDotsIcon");
    const svgString2 = document.createElement("div");
    svgString2.classList.add("recycleIcon");
    const svgString3 = document.createElement("div");
    svgString3.classList.add("activityIcon");

    link1.appendChild(svgString1);
    link1.appendChild(linkTitle1);

    link2.appendChild(svgString2);
    link2.appendChild(linkTitle2);

    link3.appendChild(svgString3);
    link3.appendChild(linkTitle3);

    Container.appendChild(link1);
    Container.appendChild(link2);
    Container.appendChild(link3);

    return Container;
}
function initializePage() {
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
    initializePage();
};