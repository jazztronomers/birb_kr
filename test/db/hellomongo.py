import pymongo

mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
mongo_db_local = mongo_client["local"]


mongo_col = mongo_db_local['post']




for e in mongo_col.find().sort([("category_admin",-1),  ("publish_timestamp",-1)]).limit(5):
    print(e['publish_timestamp'], e['category_admin'])


