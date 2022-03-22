from jazzbirb_kr.app.util.mongo_connector import *
from jazzbirb_kr.app.util.boto3_connector import BirbBoto3
from jazzbirb_kr.app.util.app_logger import logger
from jazzbirb_kr.app.constant import *
import pandas as pd
import pymongo
from datetime import datetime, timedelta


birds_list = [x for x in mongo_db['bird'].find({}, {'_id': False})]
birds_dict = {x.get('bid'):x for x in birds_list}
presigned_url_dict = {}

class ContentReader:

    def __init__(self):
        self.collection_item = mongo_db['item']
        self.collection_post = mongo_db['post']
        self.collection_post_comment = mongo_db['post_comment']

    def _select_with_boundary_condition(self, x_min, x_max, y_min, y_max, limit=100, skip=0):
        '''

        only observe level 1~2 includes in results
        can not specify species with boundary condition

        '''

        ## observe level > 3 인 종들 제외

        query = { "x": { "$gt": x_min, "$lt": x_max },
                  "y": { "$gt": y_min, "$lt": y_max }}


        ret, has_next = select(collection=self.collection_item,
                          query=query,
                          sort_by="publish_date",
                          ascending=False,
                          limit=limit,
                          skip=skip)

        return ret, has_next

    def _select_without_boundary_condition(self, limit=100, skip=0, species=[], months=[], ):


        ## observe level > 3 인 종들에 대해서 X,Y 정보 마스킹
        query = {}

        if len(species) > 0:
            query["species"] =  {"$in": species}

        ## MONTH 미구현 !

        ret, has_next = select(collection=self.collection_item,
                          query=query,
                          sort_by="publish_timestamp", #observe_date
                          ascending=False,
                          limit=limit,
                          skip=skip)

        return ret, has_next

    def _select_specific_user(self, user_id, limit=100, skip=0):


        ## observe level > 3 인 종들에 대해서 X,Y 정보 마스킹


        query = {}
        query["user_id"] = {"$eq": user_id}

        ## MONTH 미구현 !
        logger.info('%s, %s, %s'%(user_id, limit, skip))
        logger.info('%s, %s, %s'%(user_id, limit, skip))
        ret, has_next = select(collection=self.collection_item,
                          query=query,
                          sort_by="publish_timestamp", #observe_date
                          ascending=False,
                          limit=limit,
                          skip=skip)

        return ret, has_next



    def _select_board(self, limit, skip):
        query = {}
        query["delete_yn"] = {"$eq": 0}
        ret, has_next = aggregate(self.collection_post,
                          query=query,
                          sort_by=["category_admin", "publish_timestamp"], #observe_date
                          ascending=[False, False],
                          limit=limit,
                          skip=skip,
                          lookups=[
                              {
                                  'collection': 'post_comment',  # COLLECTION TO JOIN
                                  'left_key': 'post_id',  # JOIN ON
                                  'right_key': 'post_id',  # JOIN ON
                                  'as': 'comment_count',
                                  'count': 'comment_count'
                              }
                          ])


        for row in ret:
            if row['category'] in CONST_SUPER_CATEGORY.keys():
                row['category_admin'] = CONST_SUPER_CATEGORY[row['category']]
                row['category'] = CONST_SUPER_CATEGORY[row['category']]
            else:
                row['category_admin'] = CONST_GENERAL_CATEGORY[row['category']]
                row['category'] = CONST_GENERAL_CATEGORY[row['category']]


        return ret, has_next

    def _select_post(self, post_id):
        query = {}
        query["post_id"] = {"$eq": post_id}
        ret = select(self.collection_post,
                                query = query,
                                sort_by="publish_timestamp")


        return ret

    def _select_item(self, post_id):
        query = {}
        query["post_id"] = {"$eq": post_id}
        ret, _ = select(self.collection_item,
                                query = query,
                                sort_by="item_id",
                                limit=999,
                                skip=0,
                                ascending=True)
        return ret

    def _select_comment(self, post_id):
        query = {}
        query["post_id"] = {"$eq": post_id}
        ret, has_next = select(self.collection_post_comment,
                                          query=query,
                                          sort_by="publist_timestamp",
                                          limit=999,
                                          skip=0,
                                          ascending=True)
        return ret

    def _add_view(self, post_id):
        query = {}
        query["post_id"] = {"$eq": post_id}
        ret = update_inc(self.collection_post,
                   query=query,
                   key='view',
                   value=1)

        return ret



    def get_item_by_post_id(self, post_id, user_id):
        items = self._select_item(post_id)

        # TODO: user_id validation: is it your post?

        for item in items:
            item['object_storage_url'] = self.get_presigned_url(item['object_key'])


        return items


    def get_birds(self):
        return {"birds_list":birds_list}

    def get_board(self, limit=100, skip=0, keyword=None, from_date=None, to_date=None):
        ret, has_next = self._select_board(limit, skip)
        return {"data": ret, "has_next": has_next}


    def get_post(self, post_id):


        post, _ = self._select_post(post_id)        # 실직적으로는 SELECT ONE
        items = self._select_item(post_id)          # 해당 포스트아이디에 해당하는 모든 아이템 (사진, 영상) 획득
        comments = self._select_comment(post_id)    # 해당 포스트아이디에 해당하는 모든 댓글 획득

        self._add_view(post_id)

        post = post[0]

        # 포스트에 이미지들을 presigned url로 교체
        for item in items:
            item['object_storage_url'] = self.get_presigned_url(item['object_key'])
            post['content'] = post['content'].replace(item['item_id'], self.get_presigned_url(item['object_key']))


        try:
            post['category'] = CONST_GENERAL_CATEGORY[post['category']]
        except:
            post['category'] = CONST_SUPER_CATEGORY[post['category']]

        post['comments'] = comments


        return {"data": {"post":post, "comments":comments}}


    def get_post_comment(self, post_id):
        # 해당 포스트아이디에 해당하는 모든 댓글 획득, 댓글작성시점에 댓글만 reflow 목적

        comments = self._select_comment(post_id)    # 해당 포스트아이디에 해당하는 모든 아이템 (사진, 영상) 획득
        return {"data": {"comments":comments}}

    def get_contents_meta(self, x_min=0, x_max=0, y_min=0, y_max=0, species=[], months=[], user_id=None, limit=100, skip=0):



        logger.info("limit: %s, skip: %s"%(limit, skip))

        if 0 not in [x_min, x_max, y_min, y_max]:
            ret, has_next = self._select_with_boundary_condition(x_min, x_max, y_min, y_max, limit, skip)
        elif user_id is not None:
            ret, has_next = self._select_specific_user(user_id, limit, skip)
        else:
            ret, has_next = self._select_without_boundary_condition( limit, skip, species, months)



        # POST PROCESSING
        for each in ret:
            if each.get('species') is not None:
                each['species'] = [birds_dict.get(x).get("species_kr") for x in each['species']]

            each['object_storage_url']=self.get_presigned_url(each['object_key'])

        logger.info("rawdata size: %s, has next: %s"%(len(ret), has_next))

        return {"data": ret, "has_next": has_next}


    def get_presigned_url(self, object_key):
        '''

        매번 요청할때마다 새롭게 URL을 발급받는게 아니고
        발급받은 URL이 있으면 그거 쓰고, 없으면 새로 발급!

        결국에는 presigned url을 db또는 별도 api 서버로 관리하는게 좋아보임, bulk로 가져올 수 있어야함

        https://stackoverflow.com/questions/57734298/how-can-i-provide-shared-state-to-my-flask-app-with-multiple-workers-without-dep

        참조해서 동일 노드 worker간 presigned_url_dict 를 share 하도록 구현해보자

        :param object_key:라
        :return:
        '''


        presigned_url = presigned_url_dict.get(object_key)

        # IN MEMORY
        if presigned_url is not None and datetime.now() < presigned_url.get('expire_at'):
            return presigned_url.get('url')

        #
        else:
            print("url re-generated...")
            url = BirbBoto3().create_presigned_url(object_key)
            expire_at = datetime.now() + timedelta(hours=24)
            presigned_url_dict[object_key] = {"url": url, "expire_at":expire_at}
            return BirbBoto3().create_presigned_url(object_key)
