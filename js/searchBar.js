   document.addEventListener("DOMContentLoaded", function () {
        const toggleBtn = document.querySelector(".search-toggle");
        const searchBox = document.querySelector(".search-container");

        toggleBtn.addEventListener("click", function () {
            searchBox.classList.toggle("active");
        });
    });
    document.addEventListener("DOMContentLoaded",function(){
        const sidebar = document.getElementById("side-bar");
        const toggleSidebar = document.getElementById("toggleSidebar");

        toggleSidebar.addEventListener("click",function(){
            sidebar.classList.toggle("expanded");
        });
    });