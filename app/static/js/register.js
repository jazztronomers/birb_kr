var flag_email_confirmed=false
var flag_user_name_dup_checked=false
var flag_password_confirmed=false
var flag_curr_pw_matches=false

function checkPasswordMatches(){

  if (document.getElementById('pw').value ==
    document.getElementById('pw_confirmation').value) {
    document.getElementById('confirmation_password_same').style.color = 'green';
    document.getElementById('confirmation_password_same').innerHTML = 'matching';


    button_update_password = document.getElementById('update_password')
    if (null!= button_update_password){
        button_update_password.disabled=""
    }
    flag_password_confirmed = true

  } else {
    document.getElementById('confirmation_password_same').style.color = 'red';
    document.getElementById('confirmation_password_same').innerHTML = 'not matching';

    button_update_password = document.getElementById('update_password')
    if (null!= button_update_password){
        button_update_password.disabled="disabled"
    }


    flag_password_confirmed =  false
  }
}


function validateEmailFormat(){

    email = document.getElementById("email").value
    var re = /\S+@\S+\.\S+/;

    var vali_result = re.test(String(email).toLowerCase())
    var button = document.getElementById('button_mail')

    if (true==vali_result) {
        button.disabled = "";
    }
    else{
        button.disabled = "disabled";
    }
}

function sendConfirmationCodeByEmail(){

    email = document.getElementById('email').value
    var req = new XMLHttpRequest()

    req.responseType = 'json';
    req.onreadystatechange = function()
    {
        if (req.readyState == 4)
        {
            if (req.status == 200){
                if(req.response.result == false){
                        alert(req.response.message)
                        return false
                }
                else {

                        setConfirmationTimer()
                        var button = document.getElementById('button_confirmation')
                        button.disabled = "";
                }
            }
        }
    }

    req.open('POST', '/getEmailConfirmationCode')
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.send('email="'+email+'"')
    alert('인증코드가 전송되었습니다, 메일을 확인하세요')
}



function setConfirmationTimer(element_id_timer_span='confirmationTimer', element_id_confirm_button='button_confirmation'){

    document.getElementById(element_id_timer_span).innerHTML = '02:00'
    startTimer();

    function startTimer() {
        var presentTime = document.getElementById(element_id_timer_span).innerHTML;
        var timeArray = presentTime.split(/[:]+/);
        var m = timeArray[0];
        var s = checkSecond((timeArray[1] - 1));
        if(s==59){
            m=m-1
        }

        if(document.getElementById(element_id_timer_span).innerHTML==''){
            var button = document.getElementById(element_id_confirm_button)
            button.disabled = "disabled";
            return true
        }

        else if(m<0){

            document.getElementById(element_id_timer_span).innerHTML = '인증코드가 만료되었습니다, 다시시도하세요'
            var button = document.getElementById(element_id_confirm_button)
            button.disabled = "disabled";
            return true
        }
        else if (m>=0){
            document.getElementById(element_id_timer_span).innerHTML = m + ":" + s;
            setTimeout(startTimer, 1000);
        }

    }
    function checkSecond(sec) {
        if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
        if (sec < 0) {sec = "59"};
        return sec;
    }
}

function checkConfirmationCodeMatches(email){

    confirmation_code = document.getElementById('emailconfirmationcode').value
    var req = new XMLHttpRequest()
    req.responseType = 'json';
    req.onreadystatechange = function()
    {
        if (req.readyState == 4)
        {
            if (req.status == 200){

                if(req.response.result == false)
                {
                    alert("입력된 인증코드가 일치하지 않습니다.")
                    return false
                }
                else {
                    alert("인증되었습니다.")
                    document.getElementById('confirmationTimer').innerHTML = ''
                    var button = document.getElementById('button_confirmation')
                    button.disabled = "disabled";
                    var button = document.getElementById('button_mail')
                    button.disabled = "disabled";

                    flag_email_confirmed = true
                    return true
                }
            }
        }
    }

    req.open('POST', '/checkEmailConfirmationCode')
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.send('confirmation_code='+confirmation_code)

}

function checkDupUserId(){


    flag_userid_dup_checked = false
    var user_id = document.getElementById('user_id').value
    var req = new XMLHttpRequest()
    req.responseType = 'json';
    req.onreadystatechange = function()
    {
        if (req.readyState == 4)
        {
            if (req.status == 200){

                if(req.response.result == false)
                {
                    alert("이미 존재하는 id 입니다")
                    flag_userid_dup_checked = false

                }
                else {
                    alert("사용가능한 id 입니다")

                    var button = document.getElementById('submit-btn')
                    if (null != button){
                        button.disabled = "";
                    }

                    flag_userid_dup_checked = true
                    return true
                }
            }
        }
    }

    req.open('POST', '/checkDupUserId')
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.send('user_id='+user_id)


}

function checkDupUserName(){

    var user_name = document.getElementById('user_name').value

    if (false){
        alert("기존 닉네임과 일치합니다")
    }

    else {

        var req = new XMLHttpRequest()
        req.responseType = 'json';
        req.onreadystatechange = function()
        {
            if (req.readyState == 4)
            {
                if (req.status == 200){

                    if(req.response.result == false)
                    {
                        alert("이미 존재하는 닉네임입니다")
                        var button = document.getElementById('update_username')
                        button.disabled = "disabled"
                        flag_username_dup_checked = false

                    }
                    else {
                        alert("사용가능한 닉네임입니다")
                        var button = document.getElementById('update_username')
                        if (null != button){
                            button.disabled = "";
                        }

                        var button = document.getElementById('button_register')
                        if (null != button){
                            button.disabled = "";
                        }



                        flag_username_dup_checked = true
                        return true
                    }
                }
            }
        }

        req.open('POST', '/checkDupuserName')
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        req.send('user_name='+user_name)
    }

}



function updateUsername(){



    var username = document.getElementById('username').value
    if ( username == username_origin ){
        alert("닉네임을 변경되지 않았거나, 중복체크되지 않았습니다.")
    }
    else if (flag_username_dup_checked == false){
        alert("중복체크해주세요.")
    }

    else {

        var req = new XMLHttpRequest()
        req.responseType = 'json';
        req.onreadystatechange = function()
        {
            if (req.readyState == 4)
            {
                if (req.status == 200){

                    if(req.response.result == false)
                    {
                        alert("알수 없는 에러가 발생하였습니다, 다시 시도해주세요")
                        flag_username_dup_checked = false
                    }
                    else {
                        alert("닉네임이 변경되었습니다")

                        username_origin = username
                        var button = document.getElementById('button_check_username_dup')
                        button.disabled = "disabled";

                        var button = document.getElementById('update_username')
                        button.disabled = "disabled";



                        return true
                    }
                }
            }
        }

        req.open('POST', '/updateUsername')
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        req.send('username='+username)
    }
}


function updatePassword(){



    var req = new XMLHttpRequest()
    req.responseType = 'json';
    req.onreadystatechange = function()
    {
        if (req.readyState == 4)
        {
            if (req.status == 200){

                if(req.response.result == false)
                {
                    alert("알수 없는 에러가 발생하였습니다, 다시 시도해주세요")
                }
                else {
                    alert("비밀번호가 변경되었습니다, 재접속해주세요.")
                    window.location = "/logout";

                    return true
                }
            }
        }
    }



    var pw = SHA256(document.getElementById('pw').value)

    req.open('POST', '/updatePassword')
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.send('password='+pw)

}



function checkCurrentPassword(){

    var curr_pw = SHA256(document.getElementById('curr_pw').value)
    var req = new XMLHttpRequest()
    req.responseType = 'json';
    req.onreadystatechange = function()
    {
        if (req.readyState == 4)
        {
            if (req.status == 200){

                if(req.response.result == false)
                {
                    alert("기존 비밀번호와 일치하지 않습니다")
                    flag_curr_pw_matches = false
                }
                else {
                    alert("기존 비밀번호와 일치합니다")
                    flag_curr_pw_matches = true
                    var button = document.getElementById('button_check_username_dup')
                    button.disabled = "";

                    var field = document.getElementById('username')
                    field.disabled = "";


                    var field = document.getElementById('pw')
                    field.disabled = "";


                    var field = document.getElementById('pw_confirmation')
                    field.disabled = "";



                }
            }
        }
    }

    req.open('POST', '/checkCurrentPassword')
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.send('curr_pw='+curr_pw)

}






function doRegister(){



    if(flag_email_confirmed==false){
        alert("email인증을 해주세요")
        return false
    }
    if(flag_userid_dup_checked==false){
        alert("아이디 중복체크가 되지 않았습니다.")
        return false
    }


    if(flag_username_dup_checked==false){
        alert("닉네임 중복체크가 되지 않았습니다.")
        return false
    }

    if(flag_password_confirmed==false){
        alert("비밀번호가 일치하지 않습니다")
        return false
    }

    var email = document.getElementById('email').value
    var user_name = document.getElementById('user_name').value
    var pw = SHA256(document.getElementById('pw').value)
    var req = new XMLHttpRequest()
    req.responseType = 'json';
    req.onreadystatechange = function()
    {
        if (req.readyState == 4)
        {
            if (req.status == 200){

                console.log(req.response)
                if(req.response.result == false)
                {
                    alert(req.response.message)
                }
                else {

                    alert("가입되었습니다")
                    window.location = "/";
                }
            }
        }
    }

    req.open('POST', '/registerForm')
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.send('email='+email+'&user_id='+user_id+'&user_name='+user_name+'&pw='+pw )

}
