let email = document.getElementById("email")
let password = document.getElementById("password")
let loginBtn = document.getElementById("btn-login")
let headerlinks = document.getElementById("header-links")

headerlinks.style.display = "none"

loginBtn.addEventListener('click' , function(e){
    e.preventDefault()
    if(email.value == "" || password.value == ""){
        alert("please fill your all data")
    }
    else{
        let getitem = localStorage.getItem('user')

        if(getitem){
        localStorage.setItem('loggedin' , getitem)
        let getloggedin = localStorage.getItem('loggedin')
        let userdatastring = JSON.parse(getloggedin)


        if( userdatastring.email === email.value && userdatastring.password === password.value){
            setTimeout(() => {
                window.location.href = "index.html"
            }, 1000);
        }else{
            alert("the password or email is not correct")
        }
        }
        else{
            alert("No registered user found. Please register first! ")
        }
    }
})