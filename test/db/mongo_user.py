import pymongo
from datetime import datetime

mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
mongo_db_local = mongo_client["local"]


mongo_col = mongo_db_local['user']


def get_user(email):
    user = mongo_col.find_one({"email":{"$eq": email}})
    return user

## NEW KEY
def update_add_ney_key_value(email, key, value):
    query = {"email": {"$eq": email}}

    append = {
        '$set': {
                key: value
        }
    }

    mongo_col.update_one(query, append)



def update_push_value_to_nested_array(email, value):
    query = {"email": {"$eq": email}}
    # PUSH WHETHER EXISTENCE
    # mongo_col.update_one(query, {"$push": {"collection.$[].2020": value}})

    # PUSH IF NOT EXISTS
    mongo_col.update_one(query,  { "$addToSet": {"collection.$[].2020" : value}})

def remove_collection_value_from_nested(email, value):
    query = {"email": {"$eq": email}}
    mongo_col.update_one(query,  { "$pull": {"collection.$[].2020" : value}})




## PUSH

if __name__=="__main__":

    email = "rubenchu@naver.com"
    user = get_user(email)
    print(user)

    update_add_ney_key_value(email, 'collection', {"2020":["008", "003"]})

    # update_push_value_to_nested_array("rubenchu@naver.com", '005')
    # remove_collection_value_from_nested(email, '008')
    user = get_user(email)
    print(user)