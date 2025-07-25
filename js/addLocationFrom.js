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
async function getNewLocationData(event){
    event.preventDefault();
    const city = document.getElementById("cityName").value;
    const street = document.getElementById("streetName").value;
    const animalFood = document.getElementById("animalFood").value;
    const status = document.getElementById("status").value;
    
    const newLocation = {
        city: city,
        streetName: street,
        animalFood: animalFood,
        status: status
    };
    try{
        const response = await fetch("https://greenpaws-serverside.onrender.com/api/locations/newLocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({newLocation})
    });
    if (!response.ok) {
        if (response.status === 409) {
            alert("The location is all ready in the data base.");
            location.reload();
            return;
        }
        if(response.status === 400){
            alert("City or location spelling error.");
            location.reload();
            return;
        }
      const err = await response.json();
      throw new Error(err.message);
    }

    alert("The new location has been submitted successfully.");
    location.reload();
    }catch(error){
         console.error("Form send error:", error.message);
        alert("Failed to send From: " + error.message);
    }
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
    const animalOptions = ['active','inactive'];
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
    document.querySelector(".btn.btn-success").addEventListener("click",(event) =>{
        getNewLocationData(event)})
};