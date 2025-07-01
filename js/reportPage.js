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
function changeCardColor(item,reportCard,cardData){
    if (item == "new")
        {
            reportCard.style.backgroundColor = "#A8D5BA"
            cardData.innerText = "status: " + item;
        }else if(item == "close")
        {
            reportCard.style.backgroundColor ="#D3D3D3"
            cardData.innerText = "status: " + item;
        }else if(item == "progress"){
            reportCard.style.backgroundColor = "#FFBF00"
            cardData.innerText = "status: " + item;
        }
}

function createLocationCard(product) {
    const ulFrag = document.createDocumentFragment();
    const reportCard = document.createElement("a");
    reportCard.classList.add("reportCard");
    reportCard.href = "#";
    reportCard.setAttribute("data-bs-toggle", "modal");
    reportCard.setAttribute("data-bs-target", "#reportModal");
    ulFrag.appendChild(reportCard);

    for (const key in product) {
        let cardData;

        switch (key) {
            case "status":
                cardData = document.createElement("span");
                changeCardColor(product[key], reportCard, cardData);        
                reportCard.appendChild(cardData);
                break;
            case "location":
                cardData = document.createElement("span");
                cardData.innerText = "Location: " + product[key];
                cardData.style.display = "flex";
                reportCard.appendChild(cardData);
                break;
            case "createAt":
                cardData = document.createElement("span");
                cardData.innerText = "Date: " + product[key];
                reportCard.appendChild(cardData);
                break;
            case "id":
                reportCard.setAttribute("Report_ID", product[key]);
                break;
            default:
                break; 
        }
    }

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("icon-trash");

    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();  
        
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
    });
    
    return ulFrag;
}
function  initializeReportPage(data) {
    const listContiner = document.getElementsByClassName("listContiner")[0];

    for (const product of data.products) {
        const reportCard = createLocationCard(product);
        listContiner.appendChild(reportCard);
    }

    document.getElementById("warraper").appendChild(listContiner);
}
window.onload = () =>{
    getPageTitle();
    fetch("data/userReports.json")
        .then(Response => Response.json())
        .then(data => initializeReportPage(data))

    document.querySelector(".btn-close").addEventListener("click",()=>{
        document.activeElement.blur();
    })
}