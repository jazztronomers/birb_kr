import pymongo

mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
mongo_db_local = mongo_client["local"]

mongo_client.list_databases()
mongo_client.list_database_names()

mongo_db_local.list_collections()
mongo_db_local.list_collection_names()

mongo_col = mongo_db_local['content']

print(mongo_col.find_one())

## INSERT

# mylist = [
#   { "name": "Amy", "address": "Apple st 652"},
#   { "name": "Hannah", "address": "Mountain 21"}
# ]
#
# mongo_col.insert_many(mylist)
# mongo_col.insert_one(mylist[0])


for e in mongo_col.find().limit(5):
  print(e)