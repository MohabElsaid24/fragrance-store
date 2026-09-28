let firstName = document.getElementById("first-name")
let lastName = document.getElementById("last-name")
let email = document.getElementById("email")
let password = document.getElementById("password")
let registerBtn = document.getElementById("btn-register")
let headerlinks = document.getElementById("header-links")

headerlinks.style.display = "none"

registerBtn.addEventListener('click' , function(e){
    e.preventDefault()
    if(firstName.value == "" || lastName.value == "" || email.value == "" || password.value == ""){
        alert("please fill your all data")
    }else{
        let userData = {
            firstName:firstName.value,
            lastName:lastName.value,
            email:email.value, 
            password:password.value
        }
        let userDataString = JSON.stringify(userData)

        localStorage.setItem('user' , userDataString)
    }
    setTimeout(() => {
        window.location.href = "login.html"
    }, 1000);
})
