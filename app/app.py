import json
from jazzbirb_kr.app.route import route_user, route_content
from jazzbirb_kr.app.util.app_logger import logger
from flask import Flask, render_template, request, jsonify




# app = Flask(__name__)
app = Flask(__name__, static_folder='static')
app.register_blueprint(route_user.app_user)
app.register_blueprint(route_content.app_content)
app.config['JSON_SORT_KEYS'] = False







@app.route('/')
def home():
    logger.info('test')
    return render_template('home.html', data='/')








if __name__=="__main__":
    app.run(host='0.0.0.0', port=9000, debug=True)

