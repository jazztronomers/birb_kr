document.addEventListener("DOMContentLoaded", function(){
    const loginBtn = document.getElementById('login');
    const signupBtn = document.getElementById('signup');

    loginBtn.addEventListener('click', (e) => {
        let parent = e.target.parentNode.parentNode;
        Array.from(e.target.parentNode.parentNode.classList).find((element) => {
            if(element !== "slide-up") {
                parent.classList.add('slide-up')
            }else{
                signupBtn.parentNode.classList.add('slide-up')
                parent.classList.remove('slide-up')
            }
        });
    });

    signupBtn.addEventListener('click', (e) => {
        let parent = e.target.parentNode;
        Array.from(e.target.parentNode.classList).find((element) => {
            if(element !== "slide-up") {
                parent.classList.add('slide-up')
            }else{
                loginBtn.parentNode.parentNode.classList.add('slide-up')
                parent.classList.remove('slide-up')
            }
        });
    });

    loginBtn.click()

});


function login(){

    console.log(" * login triggered....", event.key)
    if(event.type === 'keydown' && event.key === undefined){
        console.log("[BUG?] ubuntu chromium bug!", event.key, event.type)
        return true
    }

    else if(event.key === 'Enter' || null == event.key) {

        let req = new XMLHttpRequest()
        req.responseType = 'json';
        req.onreadystatechange = function()
        {
            if (req.readyState == 4)
            {
                if (req.status == 200){

                    if(req.response.result == false)
                    {
                        alert(req.response.message)
                    }
                    else {

                        window.location = "/";
                    }
                }
            }
        }

        req.open('POST', '/login.do')
        req.setRequestHeader("Content-type", "application/json")


        let email = document.getElementById('login_email').value
        let pw = SHA256(document.getElementById('login_pw').value)
        let keep_login = document.getElementById('keep_login').checked

        data = JSON.stringify({'email':email, "pw": pw, "keep_login": keep_login})
        req.send(data)


//        // let auto_login_checked = document.getElementById('auto_login').checked
//
//        console.log(" * login...?", event, is_auto)
//
//        if (is_auto == true){
//            req.send('email='+localStorage.getItem('jazzstock_auto_login_email')+'&pw='+localStorage.getItem('jazzstock_auto_login_pw'))
//        }
//        else {
//            pw = SHA256(document.getElementById('pw').value)
//            req.send('email='+email+'&pw='+pw)
//        }
    }
}