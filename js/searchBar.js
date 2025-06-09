   document.addEventListener("DOMContentLoaded", function () {
        const toggleBtn = document.querySelector(".search-toggle");
        const searchBox = document.querySelector(".search-container");

        toggleBtn.addEventListener("click", function () {
            searchBox.classList.toggle("active");
        });
        });