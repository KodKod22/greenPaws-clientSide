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
function setGraph() {
    const xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    const yValues = [55, 49, 44, 24, 15];
    
    const barColor = "green";
    const barColors = new Array(xValues.length).fill(barColor); 

  new Chart("myChart", {
  type: "bar",
  data: {
    labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    datasets: [{
        label: "my monthly recycle activity",
      backgroundColor: "green",
      data: [55, 49, 44, 24, 15]
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false, 
    scales: {
      y: { beginAtZero: true }
    }
  }
});

}
window.onload = () =>{
    getPageTitle();
    setGraph();
}

