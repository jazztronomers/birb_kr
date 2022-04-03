from jazzbirb_kr.app.util.mongo_connector import *
from jazzbirb_kr.app.util.boto3_connector import BirbBoto3
from jazzbirb_kr.app.config.config import AWS_S3_BUCKET_NAME
from datetime import datetime
from bson.objectid import ObjectId
from jazzbirb_kr.app.constant import *
import pandas as pd

df_birds = pd.DataFrame(data=[x for x in mongo_db['bird'].find({}, {'_id': False})])




## WRITE_CONTENT -> WRITE_ITEM ->


class ContentWriter:

    def __init__(self, user_id):
        self.collection_post= mongo_db['post']
        self.collection_item= mongo_db['item']
        self.s3 = 's3'
        self.user_id = user_id



    def write_post(self, title, content, items, location, camera, lens, category, option):

        collection_post = mongo_db['post']
        collection_item = mongo_db['item']
        post_id = ObjectId().__str__() # 채번

        publish_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        _post ={
            'post_id': post_id,
            'user_id': self.user_id,
            'title': title,
            'content': content,
            'location': location,
            'publish_timestamp': publish_timestamp,
            'delete_yn': 0,
            'camera': camera,
            'lens': lens,
            "view": 0,
            "recomm": [],
            "category": category,
            "category_admin":category[:5],
            "option": option
        }


        _items = []

        for item in items:
            item_idx = item.get('item_id')
            object_key = '%s/%s_%s'%(self.user_id, post_id, item_idx)
            item_obj = item.get('item_value')
            ret_boto = BirbBoto3(AWS_S3_BUCKET_NAME).upload_image(file_obj=item_obj,
                                                file_name=object_key)
            print(item_idx, ret_boto)

            _items.append(
                {
                    'post_id': post_id,
                    "item_id": item.get('item_id'),
                    "user_id": self.user_id,
                    "publish_timestamp": publish_timestamp,
                    "observe_timestamp": publish_timestamp,
                    "object_key": object_key,

                    "x": None,
                    "y": None,
                    "species": None,
                    "camera": None if len(camera) == 0 else camera[0],
                    "lens": None if len(lens) == 0 else lens[0],
                }
            )

        insert_result_post = collection_post.insert_one(_post)
        insert_result_item = collection_item.insert_many(_items)

        ## insert result processing...

        return {'result': False,
                'message': 'email already exsists'}

    def write_comment_post(self, post_id, content, user_id):

        collection_comment = mongo_db['post_comment']
        publish_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        _comment = {
            "post_id":post_id,
            "user_id":user_id,
            "publish_timestamp":publish_timestamp,
            "content":content,
            "delete_yn": 0
        }

        insert_result_comment = collection_comment.insert_one(_comment)

        ## insert result processing...

        return {'result': False,
                'message': 'email already exsists'}


    def like_post(self, post_id, user_id):



        ret, _ = select(collection=mongo_db['post'],
                        query={"post_id": {"$eq": post_id}},
                        sort_by='post_id')


        if user_id not in ret[0].get('recomm'):
            ret = update_push(collection=mongo_db['post'],
                              query= {"post_id" : {"$eq": post_id}},
                              key='recomm',
                              value=user_id)

            return {'result': True,
                    'message': 'liked'}
        else:

            return {'result': False,
                    'message': 'you already liked'}


    def set_meta(self, meta, user_id, post_id, item_id):

        query = {"post_id" : {"$eq": post_id},
                 "user_id" : {"$eq": user_id},
                 "item_id" : {"$eq": item_id}}

        print(post_id, user_id, item_id)


        ret = select(mongo_db['item'], query, sort_by="object_key")
        print("BEFORE", ret)

        ret = update_set_multi(collection=mongo_db['item'],
                         query=query,
                         key_value_dict=meta)

        ret = select(mongo_db['item'], query, sort_by="object_key")
        print("AFTER", ret)

        return {'result': True,
                'message': 'set meta success'}




# if __name__ == "__main__":
#
#     print(ObjectId())
#     print(ObjectId())
#     print(ObjectId())