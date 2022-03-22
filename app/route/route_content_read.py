from flask import request, session, jsonify, Blueprint, current_app
from jazzbirb_kr.app.models.models_content_read import ContentReader
from jazzbirb_kr.app.util.app_logger import logger
from jazzbirb_kr.app.constant import *


app_content_reader = Blueprint('content_read', __name__, url_prefix='/')


@app_content_reader.route("/getContentsMeta", methods=['POST'])
def get_contents_meta():
    req = request.json

    # COMMON
    limit = int(req.get("row_per_page", 100))
    current_page = int(req.get("current_page", 1))
    user_id = req.get("user_id")
    skip = (current_page - 1) * limit

    logger.info("limit: %s, current_page:%s, skip: %s" % (limit, current_page, skip))

    # BOUNDS
    boundary_condition = req.get("boudndary_condition")

    if boundary_condition:
        x_min = float(boundary_condition.get("x_min"))
        x_max = float(boundary_condition.get("x_max"))
        y_min = float(boundary_condition.get("y_min"))
        y_max = float(boundary_condition.get("y_max"))
        ret = ContentReader().get_contents_meta(x_min, x_max, y_min, y_max, limit=limit, skip=skip)

    elif user_id is not None:
        ret = ContentReader().get_contents_meta(limit=limit, skip=skip, user_id=user_id)
    else:
        species = req.get('species')
        months = req.get('months')
        ret = ContentReader().get_contents_meta(species=species, limit=limit, skip=skip, months=months)


    return jsonify(ret)


@app_content_reader.route("/getBoard", methods=['POST'])
def get_board():
    '''

    게시판 리스트 획득

    :return:
    '''
    limit = int(request.json.get("row_per_page", 100))
    current_page = int(request.json.get("current_page", 1))
    skip = (current_page - 1) * limit                    ## 현재페이지 이전의 데이터 개수만큼 스킵한다는 의미


    ret = ContentReader().get_board(limit=limit, skip=skip)

    print(ret)


    return jsonify(ret)


@app_content_reader.route("/getPost", methods=['POST'])
def get_post():
    '''

    특정 포스트 획득

    :return:
    '''
    post_id = request.json.get("post_id")
    ret = ContentReader().get_post(post_id=post_id)
    logger.info(ret)
    return jsonify(ret)

@app_content_reader.route("/getPostComment", methods=['POST'])
def get_post_comment():
    '''

    특정 포스트 획득

    :return:
    '''
    post_id = request.json.get("post_id")
    ret = ContentReader().get_post_comment(post_id=post_id)
    return jsonify(ret)

@app_content_reader.route("/getItemByPostId", methods=['POST'])
def get_item_by_post_id():
    '''

    특정 포스트 획득

    :return:
    '''
    if session.get('loggedin'):
        user_id = session.get("user_id")
        post_id = request.json.get("post_id")
        ret = ContentReader().get_item_by_post_id(post_id=post_id, user_id=user_id)
    return jsonify({"data":ret})


@app_content_reader.route("/getItemByItemIdList", methods=['POST'])
def get_item_by_item_id():
    '''

    특정 포스트 획득

    :return:
    '''
    if session.get('loggedin'):
        user_id = session.get("user_id")
        post_id = request.json.get("post_id")
        ret = ContentReader().get_item_by_post_id(post_id=post_id, user_id=user_id)


    return jsonify({"data":ret})




@app_content_reader.route('/getConst', methods=['POST'])
def get_const():

    if session.get('loggedin'):

        if session.get('user_lv') == 's':
            category = {**CONST_GENERAL_CATEGORY, **CONST_SUPER_CATEGORY}
        else:
            category = CONST_GENERAL_CATEGORY

        option = CONST_GENERAL_OPTION
        bird = ContentReader().get_birds()
        return jsonify({"result": True,
                        "data": {
                                    "bird":bird,
                                    "category":category,
                                    "option":option
                                 }
                        })


    else:
        return jsonify({'result': False, 'code': 401, 'message': 'Unauthorized request'})


