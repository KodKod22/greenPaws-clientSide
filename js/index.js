function mangeLogin(e) {
    e.preventDefault();
    const loginForm = document.getElementById("login-form");
    const username = loginForm.username.value;
    const password = loginForm.password.value;
    
    fetch("https://greenpaws-serverside.onrender.com/api/users/user",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            user_name:username,
            user_password:password
        })
    })
    .then(Response => {
        if(!Response.ok){
            return Response.json().then(err => { throw new Error(err.message); });
        }
        return Response.json();
    })
    .then(data => {
        sessionStorage.setItem('userData',JSON.stringify(data));
         window.location.href = "homePage.html";
    })
    .catch(error => {
        console.error("Login error:", error.message);
        alert("Login failed: " + error.message);
    });
}

window.onload = () =>{
    
    document.getElementById("login-form-submit").addEventListener("click", (e) => mangeLogin(e));
}