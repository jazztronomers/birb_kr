from jazzbirb_kr.app.util.mongo_connector import mongo_db, select as birb_mongo_select
from jazzbirb_kr.app.util.boto3_connector import BirbBoto3
from jazzbirb_kr.app.util.app_logger import logger
import pandas as pd
import pymongo
from datetime import datetime, timedelta


birds_list = [x for x in mongo_db['bird'].find({}, {'_id': False})]
birds_dict = {x.get('bid'):x for x in birds_list}
presigned_url_dict = {}

class ContentReader:

    def __init__(self):
        self.collection = mongo_db['content']

    def _select_with_boundary_condition(self, x_min, x_max, y_min, y_max, limit=100, skip=0):
        '''

        only observe level 1~2 includes in results
        can not specify species with boundary condition

        '''

        ## observe level > 3 인 종들 제외

        query = { "x": { "$gt": x_min, "$lt": x_max },
                  "y": { "$gt": y_min, "$lt": y_max }}


        ret, has_next = birb_mongo_select(collection=self.collection,
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

        ret, has_next = birb_mongo_select(collection=self.collection,
                          query=query,
                          sort_by="publish_timestamp", #observe_date
                          ascending=False,
                          limit=limit,
                          skip=skip)

        return ret, has_next


    def get_birds(self):
        return {"birds_list":birds_list}


    def get_contents_meta(self, x_min=0, x_max=0, y_min=0, y_max=0, species=[], months=[], limit=100, skip=0):

        if 0 not in [x_min, x_max, y_min, y_max]:
            ret, has_next = self._select_with_boundary_condition(x_min, x_max, y_min, y_max, limit, skip)
        else:
            ret, has_next = self._select_without_boundary_condition( limit, skip, species, months)



        # POST PROCESSING
        for each in ret:
            each['species'] = [birds_dict.get(x).get("species_kr") for x in each['species']]
            each['object_storage_url']=self.get_presigned_url(each['object_key'])

        logger.info("rawdata size: %s, has next: %s"%(len(ret), has_next))

        return {"data": ret, "has_next": has_next}


    def get_presigned_url(self, object_key):
        '''

        매번 요청할때마다 새롭게 URL을 발급받는게 아니
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
