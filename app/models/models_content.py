from jazzbirb_kr.app.util.mongo_connector import mongo_db
from jazzbirb_kr.app.util.app_logger import logger
import pandas as pd
import pymongo



mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["local"]

birds = {x.get('bid'):x for x in mongo_db['bird'].find()}


class Content:

    def __init__(self):
        self.collection = mongo_db['content']

    def select_bounds(self, x_min, x_max, y_min, y_max, content_id_list, species=[]):
        '''

        고민:

        작은영역에 사진이 1000장씩 검색되는 경우도 있다.

        Order기준

        seen yn desc
        publish date desc
        observe level desc



        '''

        query = { "x": { "$gt": x_min, "$lt": x_max },
                  "y": { "$gt": y_min, "$lt": y_max },}



        raw_data = [ docu for docu in self.collection.find(query, {'_id': False})
                                                .sort('publish_date', -1)
                                                if docu.get("content_id") not in content_id_list]

        for each in raw_data:
            each['species'] = [birds.get(x).get("species_kr") for x in each['species']]
        logger.info("rawdata size: %s"%(len(raw_data)))


        # df = pd.DataFrame(raw_data).explode('species')
        # species_count = df.groupby('species').count()[['content_id']]
        # species_count.reset_index(inplace=True)
        # species_count = species_count.sort_values(by="content_id", ascending=False) ## count
        # species_count.columns=['species_id', "count"]
        # species_count=species_count.to_dict(orient= "records")
        # return {"raw_data":raw_data, "species_count":species_count}

        return {"raw_data":raw_data}

