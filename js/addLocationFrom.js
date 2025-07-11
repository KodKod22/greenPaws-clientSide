function getPageTitle() {
    const aKeyValue = window.location.search.substring(1).split('&');
    const newPageTitle = decodeURIComponent(aKeyValue[0].split("=")[1]);

    let oldPageTitle = document.getElementsByClassName("breadcrumb")[0];
    oldPageTitle.children[0].innerText = newPageTitle;

    let pageRoadTrial = document.getElementsByClassName("breadcrumb")[1];
    let pagePosition = document.createElement("li");
    pagePosition.classList.add("breadcrumb-item", "active");
    let pagePositionTitle = document.createElement("a");
    pagePositionTitle.href="addLocation.html?pageTitle=Add%20location%20from";
    pagePositionTitle.innerText = newPageTitle;

    pagePosition.appendChild(pagePositionTitle);
    pageRoadTrial.appendChild(pagePosition);
}
function getNewLocationData(){
    
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
    const animalOptions = ['Active','Inactive'];
    const select = document.getElementById("status");
    animalOptions.forEach(optionText =>{
        const opt = document.createElement("option");
        opt.value = optionText;
        opt.innerText = optionText;
        select.appendChild(opt);
    })
}
window.onload = () => {
    getPageTitle();
    populateAnimalFood();
    populateStatus();
    document.querySelector("btn btn-success").addEventListener("click",getNewLocationData)
};