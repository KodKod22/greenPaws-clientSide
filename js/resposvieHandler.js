   function setupSidebar(){
        const toggleBtn = document.querySelectorAll(".search-toggle")[0];
        const searchBox = document.querySelectorAll(".search-container")[0];

        toggleBtn.addEventListener("click", function () {
            searchBox.classList.toggle("active");
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
        console.log('Loaded user data:', userData); 
        if (userData && userData.profile) {
            const profilePic = document.querySelector('.profilePlaceHolder img');
            profilePic.src = userData.profile; 
            const profileUserName = document.querySelector('.profilePlaceHolder span');
            profileUserName.innerText = userData.userName;
            console.log('Profile picture updated to:', userData.profile);
        } else {
            console.error('No profile image found or userData is not set.'); 
        }
}
document.addEventListener("DOMContentLoaded", () => {
    setupSidebar();
    setupSearchToggle();
    setUserProfile();
});
    