from jazzbirb_kr.app.route import route_user, route_content_read, route_content_write
from jazzbirb_kr.app.config.config import FLASK_SECRET_KEY
from jazzbirb_kr.app.util.app_logger import logger
from flask import Flask, render_template, redirect, session, url_for, request

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

# def do_baz():
#     messages = json.dumps({"main":"Condition failed on page baz"})
#     session['messages'] = messages
#     return redirect(url_for('.do_foo', messages=messages))
#
# @app.route('/foo')
# def do_foo():
#     messages = request.args['messages']  # counterpart for url_for()
#     messages = session['messages']       # counterpart for session
#     return render_template("foo.html", messages=json.loads(messages))

@app.route('/')
def render_home():

    route = request.args.get("route", 'gallery')
    route_params = request.args.get("route_params")
    logger.info('logged in? %s'%(session))
    print('@@', route, route_params)

    if session.get('loggedin'):
        return render_template('home.html', route=route, route_params=route_params)
    else:
        return redirect('/login')

## ==================================================================
## CLIENT SIDE ROUTING
## 모두 render_home 으로 넘기고, route path를 인자로 포함시킨
## ==================================================================
@app.route('/gallery', methods=['GET'])
def render_gallery():
    return redirect(url_for('.render_home', route="gallery"))

@app.route('/bird', methods=['GET'])
def render_bird():
    return redirect(url_for('.render_home', route="bird"))

@app.route('/board', methods=['GET'])
def render_board():
    return redirect(url_for('.render_home', route="board"))

@app.route('/profile', methods=['GET'])
def render_profile():
    return redirect(url_for('.render_home', route="profile"))

@app.route('/about', methods=['GET'])
def render_about():
    return redirect(url_for('.render_home', route="about"))

@app.route('/user/<user_id>', methods=['GET'])
def render_user(user_id):
    return redirect(url_for('.render_home', route="user", route_params=user_id))

@app.route('/post', methods=['GET'])
def render_post():
    return redirect(url_for('.render_home'))


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
    app.run(host='0.0.0.0', port=9000, debug=True)

