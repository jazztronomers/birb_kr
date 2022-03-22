from flask import request, jsonify, session, redirect, url_for, Blueprint
from jazzbirb_kr.app.models.models_user import User
from jazzbirb_kr.app.util.mail import send_mail
from jazzbirb_kr.app.util.app_logger import logger
from jazzbirb_kr.app.config.config import MAIL_APP_PW
import random
app_user = Blueprint('user', __name__, url_prefix='/')



@app_user.route('/login.do', methods=['POST'])
def login():
    if request.method == 'POST' and 'email' in request.form and 'pw' in request.form:

        email = request.form['email']
        pw = request.form['pw']

        user = User()
        response = user.login(email, pw)
        if response['result']:
            session['loggedin'] = True
            session['email'] = response['email']
            session['user_name'] = response['user_name']
            session['user_id'] = response['user_id']
            session['user_lv'] = response['user_lv']
            session['message'] = response["message"]
            result = True

        else:

            session['loggedin'] = False
            session['message'] = response["message"]
            result = False

        ret = {'result': result, "message":response['message']}
        logger.info(ret)
        return jsonify(ret)

    else:
        return jsonify({'result': False, 'code': 400, 'message': 'Bad request'})


@app_user.route('/logout', methods=['POST', 'GET'])
def logout():
    session.clear()
    return redirect(url_for("render_home"), code=302)



@app_user.route('/registerForm', methods=['POST'])
def register():
    if request.method == 'POST' and \
            'email' in request.form and \
            'pw' in request.form and \
            'user_name' in request.form:

        email = request.form['email']
        pw = request.form['pw']
        user_name = request.form['user_name']
        user_id = request.form['user_id']

        user = User()
        if not user.check_dup('user_name', user_name):
            return jsonify({'result': False})

        if not user.check_dup('user_id', user_id):
            return jsonify({'result': False})
        else:
            result = user.register(email, pw, user_name, user_id)
            return jsonify(result)
    else:
        return jsonify({'result': False, 'code': 400, 'message': 'Bad request'})









@app_user.route('/getEmailConfirmationCode', methods=['POST'])
def get_email_confirmation_code():
    if request.method == 'POST' and \
            'email' in request.form:
        email = request.form['email'].replace('"', '')

        user = User()
        email_dup = user.check_dup_email(email)
        if email_dup:
            return jsonify({'result': False, 'message': "이미 가입된 이메일주소입니다, 비밀번호를 잊으셨다면 관리자에 문의주세요"})

        else:

            confirmation_code = str(random.randint(0, 999999)).zfill(6)
            session['confirmation_code'] = str(confirmation_code).zfill(6)

            send_mail(from_mail='jazztronomers@gmail.com',
                      to_mail=email,
                      app_pw=MAIL_APP_PW,
                      code=confirmation_code)

            return jsonify({'result': True})

    else:
        return jsonify({'result': False, 'code': 400, 'message': 'Bad request'})


@app_user.route('/checkEmailConfirmationCode', methods=['POST'])
def check_email_confirmation_code():
    if request.method == 'POST' and \
            'confirmation_code' in request.form:
        confirmation_code_from_client = request.form['confirmation_code']
        confirmation_code_at_session = session.get('confirmation_code')

        if confirmation_code_from_client == confirmation_code_at_session:

            return jsonify({'result': True})

        else:
            return jsonify({'result': False})
    else:
        return jsonify({'result': False, 'code': 400, 'message': 'Bad request'})




@app_user.route('/checkDupuserName', methods=['POST'])
def check_dup_user_name():
    if request.method == 'POST' and \
            'user_name' in request.form:
        user_name = request.form['user_name']

        user = User()
        response = user.check_dup('user_name', user_name)  # BOOL
        return jsonify({'result': response})

    else:
        return jsonify({'result': False, 'code': 400, 'message': 'Bad request'})
    
@app_user.route('/checkDupUserId', methods=['POST'])
def check_dup_user_id():
    if request.method == 'POST' and \
            'user_id' in request.form:
        user_id = request.form['user_id']

        user = User()
        response = user.check_dup('user_id', user_id)  # BOOL
        return jsonify({'result': response})

    else:
        return jsonify({'result': False, 'code': 400, 'message': 'Bad request'})



@app_user.route('/checkCurrentPassword', methods=['POST'])
def check_current_password():
    if request.method == 'POST' and \
            'curr_pw' in request.form:

        usercode = session.get('usercode')
        curr_pw = request.form['curr_pw']
        user = User()
        response = user.check_curr_pw(usercode, curr_pw)  # BOOL
        return jsonify({'result': response})

    else:
        return jsonify({'result': False, 'code': 400, 'message': 'Bad request'})

@app_user.route('/getCollection.do', methods=['POST'])
def get_collection():
    if request.method == 'POST':
        user = User(session.get("email"))
        collection = user.get_collection()
        return jsonify({'result': True, 'data':collection})

    else:
        return jsonify({'result': False, 'code': 400, 'message': 'Bad request'})

@app_user.route('/setCollection.do', methods=['POST'])
def set_collection():
    if request.method == 'POST':



        collection = request.get_json().get("collection")
        user = User(session.get("email"))
        ret = user.set_collection(collection)


        print(ret)


        return jsonify({"result":True, "message":"Personal Bird collection updated sucessfully"})



    else:
        return jsonify({'result': False, 'code': 400, 'message': 'Bad request'})