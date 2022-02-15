from flask import request, jsonify, Blueprint, current_app
from jazzbirb_kr.app.models.models_content_read import ContentReader
from jazzbirb_kr.app.util.app_logger import logger

app_content_reader = Blueprint('content_read', __name__, url_prefix='/')

@app_content_reader.route('/getMarker', methods=['POST'])
def get_marker():
    req = request.json

    x_min = float(req.get('boudndary_condition').get("x_min"))
    x_max = float(req.get('boudndary_condition').get("x_max"))
    y_min = float(req.get('boudndary_condition').get("y_min"))
    y_max = float(req.get('boudndary_condition').get("y_max"))
    content_id_list = req.get('content_id_list', [])

    logger.info("%s, %s, %s, %s", x_min, x_max, y_min, y_max)


    ret = ContentReader().select_bounds(x_min, x_max, y_min, y_max, content_id_list)

    # current_app.logger.info(content_id_list)
    # current_app.logger.info("response rows count: %s"%(len(ret.get("raw_data"))))
    # current_app.logger.info("response size in bytes:%s MB"%(sys.getsizeof(ret.get("raw_data"))/1024/1024))


    return jsonify(ret)



@app_content_reader.route("/getContentsMeta", methods=['POST'])
def get_contents_meta():
    req = request.json

    # COMMON
    limit = int(req.get("row_per_page", 100))
    current_page = int(req.get("current_page", 1))
    skip = (current_page - 1) * limit

    # BOUNDS
    boundary_condition = req.get("boudndary_condition")


    if boundary_condition:
        x_min = float(boundary_condition.get("x_min"))
        x_max = float(boundary_condition.get("x_max"))
        y_min = float(boundary_condition.get("y_min"))
        y_max = float(boundary_condition.get("y_max"))
        ret = ContentReader().get_contents_meta(x_min, x_max, y_min, y_max, limit=limit, skip=skip)
    else:
        species = req.get('species')
        months = req.get('months')
        ret = ContentReader().get_contents_meta(species=species, limit=limit, skip=skip, months=months)

    print(ret)

    return jsonify(ret)


@app_content_reader.route('/getBirds', methods=['POST'])
def get_birds():
    ret = ContentReader().get_birds()
    # logger.info(ret)
    return jsonify({"data":ret})

