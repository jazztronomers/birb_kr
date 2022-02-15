import pymongo

mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["local"]


def select(collection, query, sort_by, ascending=False, skip=2, limit=5, includes_id=False):
    sort_how = 1 if ascending else -1
    ret = []
    cur = collection.find(query, {'_id': includes_id}).sort(sort_by, sort_how).skip(skip)

    print(ascending)

    for i in range(limit):

        try:
            ret.append(cur.next())
            if not cur.alive:
                has_next = False
                break
            else:
                has_next = True
        except StopIteration:
            has_next = False


    return ret, has_next


if __name__ == "__main__":

    col = mongo_db['test']


    # =======================================================================================================
    # W H O L E D A T A
    # =======================================================================================================
    #
    # {'_id': ObjectId('61ff26806ab013390bc77601'), 'name': 'Chuck', 'age': 10, 'address': 'Main Road 989'}
    # {'_id': ObjectId('61ff26806ab013390bc77602'), 'name': 'Viola', 'age': 12, 'address': 'Sideway 1633'}
    # {'_id': ObjectId('61ff26806ab013390bc775f9'), 'name': 'Michael', 'age': 13, 'address': 'Valley 345'}
    # {'_id': ObjectId('61ff26806ab013390bc775fd'), 'name': 'Susan', 'age': 13, 'address': 'One way 98'}
    # {'_id': ObjectId('61ff26806ab013390bc775fb'), 'name': 'Betty', 'age': 15, 'address': 'Green Grass 1'}
    # {'_id': ObjectId('61ff26806ab013390bc775fa'), 'name': 'Sandy', 'age': 17, 'address': 'Ocean blvd 2'}
    # {'_id': ObjectId('61ff26806ab013390bc775ff'), 'name': 'Ben', 'age': 20, 'address': 'Park Lane 38'}
    # {'_id': ObjectId('61ff26806ab013390bc77600'), 'name': 'William', 'age': 25, 'address': 'Central st 954'}
    # {'_id': ObjectId('61ff26806ab013390bc775f7'), 'name': 'Amy', 'age': 27, 'address': 'Apple st 652'}
    # {'_id': ObjectId('61ff26806ab013390bc775f8'), 'name': 'Hannah', 'age': 27, 'address': 'Mountain 21'}
    # {'_id': ObjectId('61ff26806ab013390bc775fe'), 'name': 'Vicky', 'age': 28, 'address': 'Yellow Garden 2'}
    # {'_id': ObjectId('61ff26806ab013390bc775fc'), 'name': 'Richard', 'age': 30, 'address': 'Sky st 331'}


    ret, has_next = select(col, {"age":{"$gt": 10}}, 'age', True, 2, 5)

    for row in ret:
        print(row)

    ret, has_next = select(col, {"age":{"$gt": 10}}, 'age', False, 2, 5)

    for row in ret:
        print(row)

    print(has_next)
    # =======================================================================================================
    # O U T P U T
    # =======================================================================================================
    # {'name': 'Susan', 'age': 13, 'address': 'One way 98'}
    # {'name': 'Betty', 'age': 15, 'address': 'Green Grass 1'}
    # {'name': 'Sandy', 'age': 17, 'address': 'Ocean blvd 2'}
    # {'name': 'Ben', 'age': 20, 'address': 'Park Lane 38'}
    # {'name': 'William', 'age': 25, 'address': 'Central st 954'}
    # True

    ret, has_next = select(col, {"age":{"$gt": 10}}, 'age', True, 5, 2)

    for row in ret:
        print(row)

    print(has_next)
    # =======================================================================================================
    # O U T P U T
    # =======================================================================================================
    # {'name': 'Susan', 'age': 13, 'address': 'One way 98'}
    # {'name': 'Betty', 'age': 15, 'address': 'Green Grass 1'}
    # {'name': 'Sandy', 'age': 17, 'address': 'Ocean blvd 2'}
    # {'name': 'Ben', 'age': 20, 'address': 'Park Lane 38'}
    # {'name': 'William', 'age': 25, 'address': 'Central st 954'}
    # {'name': 'Amy', 'age': 27, 'address': 'Apple st 652'}
    # {'name': 'Hannah', 'age': 27, 'address': 'Mountain 21'}
    # {'name': 'Vicky', 'age': 28, 'address': 'Yellow Garden 2'}
    # {'name': 'Richard', 'age': 30, 'address': 'Sky st 331'}
    # False