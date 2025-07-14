   function setupSidebar(){
        const toggleBtn = document.querySelectorAll(".search-toggle")[0];
        const searchBox = document.querySelectorAll(".search-container")[0];

        toggleBtn.addEventListener("click", function () {
            searchBox.classList.toggle("active");
        });
   }
function highlightCurrentSidebarLink() {
    const currentPath = window.location.pathname.split("/").pop(); 
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (!href) return;

        const linkPath = href.split("/").pop().split("?")[0];
        if (currentPath === linkPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}
   function  setupSearchToggle() {
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
   }   
function setUserProfile(){
      const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (userData && userData.image_trace) {
            const profilePic = document.querySelector('.profilePlaceHolder img');
            profilePic.src = userData.image_trace; 
            const profileUserName = document.querySelector('.profilePlaceHolder span');
            profileUserName.innerText = userData.user_name;
            
        } else {
            console.error('No profile image found or userData is not set.'); 
        }
}
function setAdminSideBar(sideBar){
    let adminSideBarHtml = `
            <nav class="nav flex-column nav-pills">
                <section id="toggleSidebar">
                    <svg id="toggleIcon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                    </svg>
                </section>
                <a class="nav-link" aria-current="page" href="homePage.html">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
                    </svg>
                    <span>home</span>
                </a>
                <a class="nav-link" href="listPage.html?pageTitle=Locations">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-recycle" viewBox="0 0 16 16">
                        <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.5.5 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244z"/>
                    </svg>
                    <span>locations</span>
                </a>
                <a class="nav-link" href="addLocation.html?pageTitle=Add%20location%20from">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                    <span>add location</span>
                </a>
                <a class="nav-link" href="graphPage.html?pageTitle=Statistics">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-activity" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2"/>
                    </svg>
                    <span>statistics</span>
                </a>
                <a class="nav-link" href="reportPage.html?pageTitle=Notifications">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
                        <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/>
                    </svg>
                    <span>notifications</span>
                </a>
            </nav>
            <section id="profileContainer" class="dropup-center dropup">
                <section class="btn profilePlaceHolder" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="">
                    <span></span>
                </section>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">setting</a></li>
                    <li><a class="dropdown-item" href="index.html">log out</a></li>
                </ul>
            </section>`
    sideBar.innerHTML = adminSideBarHtml;
    highlightCurrentSidebarLink();
}
function setUserSideBar(sideBar){
    let sideBarHtml = `
            <nav class="nav flex-column nav-pills">
                <section id="toggleSidebar">
                    <svg id="toggleIcon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                    </svg>
                </section>
                <a class="nav-link" aria-current="page" href="homePage.html">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
                    </svg>
                    <span>home</span>
                </a>
                <a class="nav-link" href="listPage.html?pageTitle=Locations">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-recycle" viewBox="0 0 16 16">
                        <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.5.5 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244z"/>
                    </svg>
                    <span>locations</span>
                </a>
                <a class="nav-link" href="graphPage.html?pageTitle=activity">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-activity" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2"/>
                    </svg>
                    <span>activity</span>
                </a>
                <a class="nav-link" href="reportPage.html?pageTitle=Reports">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
                        <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/>
                    </svg>
                    <span>reports</span>
                </a>
            </nav>
            <section id="profileContainer" class="dropup-center dropup">
                <section class="btn profilePlaceHolder" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="">
                    <span></span>
                </section>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">setting</a></li>
                    <li><a class="dropdown-item" href="index.html">log out</a></li>
                </ul>
            </section>`
    sideBar.innerHTML = sideBarHtml;
    highlightCurrentSidebarLink();
}
function changeSidebar(){
    const sideBar = document.getElementById("asideBar");
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userType = userData.user_type;
    
    if (userType === "admin") {
        setAdminSideBar(sideBar);
    }else{
        setUserSideBar(sideBar);
    }
}
async function sendSearchInput(searchValue) {
    const [city, streetName] = searchValue.split(",").map(s => s.toLowerCase().trim());
    if (city == undefined || streetName == undefined) {
        alert("Enter city and street");
        return;
    }

    try {
        const response = await fetch(`https://greenpaws-serverside.onrender.com/api/locations/location?city=${encodeURIComponent(city)}&streetName=${encodeURIComponent(streetName)}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            alert("No results found.");
            return;
        }

        const locationId = data[0].location_id;
        window.location.href = `objectPage.html?locationId=${locationId}`;
    } catch (error) {
        console.error("Request fetch error:", error.message);
        alert("Failed to load request data: " + error.message);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    changeSidebar();
    setupSidebar();
    setupSearchToggle();
    setUserProfile();
    const searchInput = document.querySelector(".search-input");

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); 
            const searchValue = searchInput.value.trim();
            if (searchValue !== "") {
                sendSearchInput(searchValue);
            }
        }
    });
});

    