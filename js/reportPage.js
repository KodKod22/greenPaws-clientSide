function getPageTitle() {
    const aKeyValue = window.location.search.substring(1).split('&');
    const newPageTitle = aKeyValue[0].split("=")[1];

    let oldPageTitle = document.getElementsByClassName("breadcrumb")[0];
    oldPageTitle.children[0].innerText = newPageTitle;

    let pageRoadTrial = document.getElementsByClassName("breadcrumb")[1];
    let pagePosition = document.createElement("li");
    pagePosition.classList.add("breadcrumb-item", "active");
    let pagePositionTitle = document.createElement("a");
    pagePositionTitle.href = "graph.html?pageTitle=activity";
    pagePositionTitle.innerText = newPageTitle;

    pagePosition.appendChild(pagePositionTitle);
    pageRoadTrial.appendChild(pagePosition);
}
async function deleteRequest(requestId){
    try{
        const response = await fetch(`http://localhost:8081/api/requests/deleteRequest/${requestId}`,{
            method:"DELETE",

        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message);
        }
        alert("Request deleted successfully.");
        location.reload();
    } catch (err) {
        console.error("Delete request error:", err.message);
        alert("Failed to delete request: " + err.message);
    }
}
function changeCardColor(item,reportCard,cardData){
    if (item == "new")
        {
            reportCard.style.backgroundColor = "#A8D5BA"
            cardData.innerText = "status: " + item;
        }else if(item == "close")
        {
            reportCard.style.backgroundColor ="#D3D3D3"
            cardData.innerText = "status: " + item;
        }else if(item == "progressive"){
            reportCard.style.backgroundColor = "#FFBF00"
            cardData.innerText = "status: " + item;
        }
}
function setCardData(key,reportCard,cardData,product){
    switch (key) {
            case "status":
                cardData = document.createElement("span");
                changeCardColor(product[key], reportCard, cardData);        
                reportCard.appendChild(cardData);
                break;
            case "street":
                cardData = document.createElement("span");
                cardData.innerText = "Location: " + product[key];
                cardData.style.display = "flex";
                reportCard.appendChild(cardData);
                break;
            case "createat":
                cardData = document.createElement("span");
                cardData.innerText = "Date: " + product[key];
                reportCard.appendChild(cardData);
                break;
            case "requestid":
                reportCard.setAttribute("Report_ID", product[key]);
                break;
            default:
                break; 
        }
}
function createReportCard(product) {
    const ulFrag = document.createDocumentFragment();
    const reportCard = document.createElement("div");
    reportCard.classList.add("reportCard");
    ulFrag.appendChild(reportCard);

    for (const key in product) {
        let cardData;
        setCardData(key,reportCard,cardData,product)
        
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("icon-trash");

    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const requestId = reportCard.getAttribute("Report_ID");
        deleteRequest(requestId); 
    });

    reportCard.appendChild(deleteBtn);

    if (product.adminResponds) {
        const iconWrapper = document.createElement("div");
        iconWrapper.classList.add("icon-bell");
        reportCard.appendChild(iconWrapper);
    }
    

    reportCard.addEventListener("click", () => {
        const modalBody = document.getElementById("reportModalBody");

        modalBody.innerHTML = "";

        const description = document.createElement("p");
        description.innerText = "Report description:" + (product.description || "No description");

        const adminResponse = document.createElement("p");
        adminResponse.innerText = "Manger responds: " + (product.adminResponds || "No manger response");

        modalBody.appendChild(description);
        modalBody.appendChild(adminResponse);

        modalBody.appendChild(description);
        modalBody.appendChild(adminResponse);

        const modal = new bootstrap.Modal(document.getElementById("reportModal"));
        modal.show();
    });
    
    return ulFrag;
}
function  initializeReportPage(data) {
    const listContiner = document.getElementsByClassName("listContiner")[0];

    for (const product of data) {
        const reportCard = createReportCard(product);
        listContiner.appendChild(reportCard);
    }

    document.getElementById("warraper").appendChild(listContiner);
}
async function getUserRequestFromServer(){
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const userId = userData.userId;
  try {
    const response = await fetch(`http://localhost:8081/api/requests/${userId}`, {
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

    initializeReportPage(data);
  } catch (error) {
    console.error("Request fetch error:", error.message);
    alert("Failed to load request data: " + error.message);
  }
}
window.onload = () =>{
    getPageTitle();
    getUserRequestFromServer();
    document.querySelector(".btn-close").addEventListener("click",()=>{
        document.activeElement.blur();
    })
}