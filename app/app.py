from jazzbirb_kr.app.route import route_user, route_content_read, route_content_write
from jazzbirb_kr.app.config.config import FLASK_SECRET_KEY, FLASK_PORT
from jazzbirb_kr.app.util.app_logger import logger
from jazzbirb_kr.app.util.mongo_connector import mongo_client, mongo_db
from flask import Flask, render_template, redirect
from flask import session            # SESSION STORED ON CLIENT SIDE
# from flask_session import Session  # SESSION STORED ON SERVER SIDE
from datetime import timedelta



# DEV ONLY =============================================
UPLOAD_FOLDER = '/workspace/jazzbirb_kr/test'

# ======================================================


# app = Flask(__name__)
app = Flask(__name__, static_folder='static')
app.register_blueprint(route_user.app_user)
app.register_blueprint(route_content_read.app_content_reader)
app.register_blueprint(route_content_write.app_content_writer)
app.config['JSON_SORT_KEYS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER # dev
app.config['SECRET_KEY'] = FLASK_SECRET_KEY
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=31)
# app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=5)


@app.route('/')
def render_home():
    if session.get('loggedin'):
        user_id = session.get("user_id")
        return render_template('home.html', route='gallery', user_id=user_id)
    else:
        return redirect('/login')

## ==================================================================
## CLIENT SIDE ROUTING
## 모두 render_home 으로 넘기고, route path를 인자로 포함시킨
## ==================================================================
@app.route('/gallery', methods=['GET'])
def render_gallery():
    if session.get('loggedin'):
        user_id = session.get("user_id")
        return render_template('home.html', route='gallery', user_id=user_id)
    else:
        return redirect('/login')
#
@app.route('/bird', methods=['GET'])
def render_bird():
    if session.get('loggedin'):
        user_id = session.get("user_id")
        return render_template('home.html', route='bird', user_id=user_id)
    else:
        return redirect('/login')

@app.route('/board', methods=['GET'])
def render_board():
    if session.get('loggedin'):
        user_id = session.get("user_id")
        return render_template('home.html', route='board', user_id=user_id)
    else:
        return redirect('/login')

@app.route('/profile', methods=['GET'])
def render_profile():
    if session.get('loggedin'):
        user_id = session.get("user_id")
        return render_template('home.html', route='profile', user_id=user_id)
    else:
        return redirect('/login')


@app.route('/about', methods=['GET'])
def render_about():
    if session.get('loggedin'):
        user_id = session.get("user_id")
        return render_template('home.html', route='about', user_id=user_id)
    else:
        return redirect('/login')


@app.route('/user/<user_id>', methods=['GET'])
def render_user(user_id):
    if session.get('loggedin'):
        user_id_logged_user = session.get("user_id")
        return render_template('home.html', route='user', route_param=user_id, user_id=user_id_logged_user)
    else:
        return redirect('/login')

@app.route('/post/<post_id>', methods=['GET'])
def render_post(post_id):
    if session.get('loggedin'):
        return render_template('home.html', route='post', route_param=post_id)
    else:
        return redirect('/login')


@app.route('/editor', methods=['GET'])
def render_editor():
    if session.get('loggedin'):
        user_id = session.get("user_id")
        return render_template('home.html', route='editor', user_id=user_id)
    else:
        return redirect('/login')

@app.route('/meta', methods=['GET'])
def render_meta_without_input():
    if session.get('loggedin'):
        return render_template('home.html', route='meta')
    else:
        return redirect('/login')

@app.route('/meta/<post_id>', methods=['GET'])
def render_meta(post_id):
    if session.get('loggedin'):
        return render_template('home.html', route='meta', route_param=post_id)
    else:
        return redirect('/login')

@app.route('/map', methods=['GET'])
def render_map():
    if session.get('loggedin'):

        user_id = session.get("user_id")
        return render_template('home.html', route='map', user_id=user_id)
    else:
        return redirect('/login')


## ==================================================================
## SERVER SIDE ROUTING
## ==================================================================
@app.route('/login', methods=['GET'])
def render_login():
    return render_template('login.html')

@app.route('/register', methods=['GET'])
def render_register():
    return render_template('register.html')







if __name__=="__main__":
    app.run(host='0.0.0.0', port=FLASK_PORT, debug=True)

