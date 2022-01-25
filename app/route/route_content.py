from flask import request, jsonify, Blueprint, current_app
from jazzbirb_net.app.models.models_content import Content


app_content = Blueprint('content', __name__, url_prefix='/')



## get_marker
## get_content_meta
@app_content.route('/getMarker', methods=['POST'])
def get_marker():
    req = request.json

    x_min = float(req.get('boudndary_condition').get("x_min"))
    x_max = float(req.get('boudndary_condition').get("x_max"))
    y_min = float(req.get('boudndary_condition').get("y_min"))
    y_max = float(req.get('boudndary_condition').get("y_max"))
    content_id_list = req.get('content_id_list', [])


    ret = Content().select_bounds(x_min, x_max, y_min, y_max, content_id_list)

    # current_app.logger.info(content_id_list)
    # current_app.logger.info("response rows count: %s"%(len(ret.get("raw_data"))))
    # current_app.logger.info("response size in bytes:%s MB"%(sys.getsizeof(ret.get("raw_data"))/1024/1024))


    return jsonify(ret)