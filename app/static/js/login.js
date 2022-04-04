document.addEventListener("DOMContentLoaded", function(){

    toggle(document.getElementById("tab_menu_login"), 'login')

})

function toggle(span, div_id){
    console.log(span)

    spans = document.getElementsByClassName(span.className)

    for (_span of spans){
        console.log('@', _span)
        _span.style.borderBottom=''
    }

    span.style.borderBottom='3px solid red'

    divs = document.getElementsByClassName('tab')

    for (div of divs){
        div.style.display='none'
    }

    div = document.getElementById(div_id)
    div.style.display='flex'

}

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