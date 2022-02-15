import pymongo



mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
mongo_db_local = mongo_client["local"] # db
mongo_db_local.drop_collection('content')


