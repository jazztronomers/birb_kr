from flask import request, jsonify, Blueprint, current_app
from jazzbirb_kr.app.models.models_content_read import ContentReader
from jazzbirb_kr.app.models.models_content_write import ContentWriter
from flask import request, redirect, url_for, session
from datetime import datetime
import json

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app_content_writer = Blueprint('content_write', __name__, url_prefix='/')





def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app_content_writer.route('/uploadFile', methods=['POST'])
def upload_file():
    if request.method == 'POST':

        start = datetime.now()

        email = session.get("email")
        images = [v for k,v in request.files.items()]
        metas = [json.loads(v) for k,v in request.form.items()]



        ContentWriter(email).write_images(images=images, metas=metas)

        return jsonify({"result": True, "message": "%s"%(datetime.now()-start)})

    else:
        return jsonify({'result': False, 'code': 400, 'message': 'Bad request'})