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
            case "username":
                cardData = document.createElement("span");
                cardData.innerText = "User: " + product[key];
                reportCard.appendChild(cardData);
                break;
            default:
                break; 
        }
}
async function sendAdminResponse(requestId,updatedResponse,updatedStatus){
    console.log(requestId);
    try {
            const res = await fetch(`http://localhost:8081/api/requests/updateRequest`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    requestId: requestId,
                    status: updatedStatus,
                    adminResponds: updatedResponse
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Update failed");
            }

            alert("Update saved successfully.");
            window.location.reload();
        } catch (error) {
            console.error("Update error:", error.message);
            alert("Failed to update report: " + error.message);
        }
}
function setReportModel(userType,product,requestId){
     const modalBody = document.getElementById("reportModalBody");

        modalBody.innerHTML = "";

        const description = document.createElement("p");
        description.innerText = "Report description:" + (product.description || "No description");
         modalBody.appendChild(description);
        if (userType === "admin") {
            const responseLabel = document.createElement("label");
            responseLabel.innerText = "Manager response:";
            const responseInput = document.createElement("textarea");
            responseInput.id = "adminResponseInput";
            responseInput.classList.add("form-control");
            responseInput.rows = 4;
            responseInput.placeholder = "Enter your response here...";
            responseInput.value = product.adminResponds || "";

        // שדה סטטוס
            const statusLabel = document.createElement("label");
            statusLabel.classList.add("mt-3");
            statusLabel.innerText = "Change status:";
            const statusSelect = document.createElement("select");
            statusSelect.id = "statusSelect";
            statusSelect.classList.add("form-select");

            const statuses = ['new','close','progressive'];
            statuses.forEach(status => {
                const option = document.createElement("option");
                option.value = status;
                option.innerText = status.charAt(0).toUpperCase() + status.slice(1);
                if (product.status === status) {
                    option.selected = true;
                }
                statusSelect.appendChild(option);
            });

        modalBody.appendChild(responseLabel);
        modalBody.appendChild(responseInput);
        modalBody.appendChild(statusLabel);
        modalBody.appendChild(statusSelect);

        const saveButton = document.createElement("button");
        saveButton.classList.add("btn" ,"btn-success", "mt-3");
        saveButton.innerText = "Save Changes";
        saveButton.addEventListener("click", async () => {
            const updatedResponse = responseInput.value;
            const updatedStatus = statusSelect.value;
             sendAdminResponse(requestId, updatedResponse, updatedStatus); 
        });

        modalBody.appendChild(saveButton);
        } else {
            const adminResponse = document.createElement("p");
            adminResponse.innerText = "Manager response: " + (product.adminrespons || "No manager response");
            modalBody.appendChild(adminResponse);
        }

        const modal = new bootstrap.Modal(document.getElementById("reportModal"));
        modal.show();

}
function createReportCard(product) {
    const requestId = product.requestid;
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userType = userData.userType;
    
    const ulFrag = document.createDocumentFragment();
    const reportCard = document.createElement("div");
    reportCard.classList.add("reportCard");
    ulFrag.appendChild(reportCard);

    for (const key in product) {
        let cardData;
        setCardData(key,reportCard,cardData,product)
    }

    if (userType === "user") {
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("icon-trash");
        deleteBtn.classList.add("delete");

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            deleteRequest(requestId); 
        });

        reportCard.appendChild(deleteBtn);
        console.log(product.adminrespons);
        if (product.adminrespons) {
            
            const iconWrapper = document.createElement("div");
            iconWrapper.classList.add("icon-bell");
            reportCard.appendChild(iconWrapper);
        }
        
    }

    reportCard.addEventListener("click", () => {
        setReportModel(userType,product,requestId);
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
async function getRequestFromServer(){
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

    initializeReportPage(data);
  } catch (error) {
    console.error("Request fetch error:", error.message);
    alert("Failed to load request data: " + error.message);
  }
}
function setHomePage(){
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userType = userData.userType;
    
    if (userType === "admin") {
        getRequestFromServer();
        
    }else{
        getUserRequestFromServer();
    }
}
window.onload = () =>{
    getPageTitle();
    setHomePage();
    
    document.querySelector(".btn-close").addEventListener("click",()=>{
        document.activeElement.blur();
    })
}