from jazzbirb_kr.app.util.mongo_connector import mongo_db
from jazzbirb_kr.app.util.boto3_connector import BirbBoto3
from jazzbirb_kr.app.util.app_logger import logger
from datetime import datetime
import pandas as pd

from random import randrange, uniform, randint, choices




df_birds = pd.DataFrame(data=[x for x in mongo_db['bird'].find({}, {'_id': False})])
# print(df_birds[df_birds["species_kr"].str.contains("따오기")].bid)
# print(df_birds[df_birds["species_kr"]=="동박새"].bid.iloc[0])
# print(df_birds[df_birds["species_kr"]=="동박새"])
# birds_dict = {x.get('bid'):x for x in birds_list}


class ContentWriter:

    def __init__(self, email):
        self.collection = mongo_db['content']
        self.s3 = 's3'
        self.email = email
        self.email_id = email.split("@")[0]


    def _get_object_idx(self):

        # db.collection.find().sort({age: -1}).limit(1)
        try:
            idx = self.collection.find().sort('content_id', -1).limit(1)[0].get("content_id")

            return idx+1
        except IndexError:
            idx = 0
            return idx+1




    def _write_image(self, meta, image, ext):
        ## generate publish_timestamp
        publish_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        ## generate file_name
        content_id = self._get_object_idx()


        object_key = '%s/%s.%s'%(self.email_id, content_id, ext)
        bids = []
        if meta.get("species") is not None:
            for species_kr in meta.get("species"):
                print('@', species_kr, df_birds[df_birds["species_kr"] == species_kr].bid.iloc[0])
                bids.append(df_birds[df_birds["species_kr"] == species_kr].bid.iloc[0])

        print(bids)

        ## insert mongodb first
        ret_mongo = self.collection.insert_one({
            "content_id": content_id,
            "publish_timestamp": publish_timestamp,
            "observe_timestamp": meta.get("observe_timestamp", publish_timestamp),
            "camera":meta.get("camera"),
            "lens":meta.get("lens"),
            "object_key":object_key,
            "x": float(meta.get('x', round(uniform(124, 128), 7))),
            "y": float(meta.get('y', round(uniform(36, 38), 7))),
            "species": bids
        })



        ## generate file_name using mongo db auto generated object_key
        ret_boto = BirbBoto3().upload_image(file_obj=image,
                                            file_name=object_key)

        logger.info('object key: %s'%(object_key))
        logger.info('inserted_id: %s'%(ret_mongo.inserted_id))
        logger.info('ret_boto: %s'%(ret_boto))

        return True



    def write_images(self, metas, images):
        # CHECK EXISTS

        if len(metas) != len(images):
            raise Exception("meta data and images length is differ")




        if True:
            for meta, image in zip(metas, images):
                print(type(meta), meta)
                self._write_image(meta=meta, image=image, ext='png')

            return {'result': False,
                    'message': 'email already exsists'}


