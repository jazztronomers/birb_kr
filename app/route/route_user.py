from flask import request, jsonify, session, redirect, url_for, Blueprint

app_user = Blueprint('user', __name__, url_prefix='/')

@app_user.route('/login', methods=['POST'])
def login():
    if request.method == 'POST' and 'email' in request.form and 'pw' in request.form:
        pass

## login
## signup
## logout
## get_email_confirmation
## check_email_confirmation
## check_current_password