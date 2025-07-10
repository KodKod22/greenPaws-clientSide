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
function setGraph(xValues, yValues) {
  
  const ctx = document.getElementById("myChart");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        label: "my monthly recycle activity",
        backgroundColor: "green",
        data: yValues
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'linear',
          beginAtZero: true,
          min: 0,
          suggestedMin: 0,
          suggestedMax: 25,
          ticks: {
            stepSize: 5
          },
        }
      }
    }
  });
}

async function getDataFromServer(){
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const userId = userData.userId;
  try {
    const response = await fetch(`http://localhost:8081/api/users/userRecycleStats?userId=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }

    const data = await response.json();

    let xValues = data.map((entry) => entry.street);
    let yValues = data.map((entry) => Number(entry.total_bottles));

    setGraph(xValues, yValues);
  } catch (error) {
    console.error("Graph fetch error:", error.message);
    alert("Failed to load graph data: " + error.message);
  }
}
async function getAllLocationsDataServer(){
  try {
    const response = await fetch(`http://localhost:8081/api/statistics/locationsStats`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }

    const data = await response.json();

    let xValues = data.map((entry) => entry.street);
    let yValues = data.map((entry) => Number(entry.total_bottles));

    setGraph(xValues, yValues);
  } catch (error) {
    console.error("Graph fetch error:", error.message);
    alert("Failed to load graph data: " + error.message);
  }
}
function setPageView(){
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userType = userData.userType;
    
    if (userType === "admin") {
        getAllLocationsDataServer();
    }else{
        getDataFromServer();
    }
}
window.onload = () =>{
    getPageTitle();
    setPageView();
}

