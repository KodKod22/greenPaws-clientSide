   document.addEventListener("DOMContentLoaded", function () {
        const toggleBtn = document.querySelector(".search-toggle");
        const searchBox = document.querySelector(".search-container");

        toggleBtn.addEventListener("click", function () {
            searchBox.classList.toggle("active");
        });
    });
    document.addEventListener("DOMContentLoaded",function(){
        const sidebar = document.getElementById("asideBar");
        const toggleSidebar = document.getElementById("toggleSidebar");
        const toggleIcon = document.getElementById('toggleIcon');

        toggleSidebar.addEventListener("click",function(){
            sidebar.classList.toggle("expanded");
            if (window.innerWidth >= 375 || window.innerWidth <= 992) {
                if(sidebar.classList.contains('expanded')){
                    toggleIcon.innerHTML = `<path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="2"/>`;
                }
                else{
                    toggleIcon.innerHTML = `<path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>`
                }   
            }
        });
    });