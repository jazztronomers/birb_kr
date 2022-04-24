from jazzbirb_kr.app.util.app_logger import logger
from jazzbirb_kr.app.config.config import MONGO_DB_URL, MONGO_DB_DB
from datetime import datetime
import pymongo


# DOCKER
# mongo_client = pymongo.MongoClient("mongodb://localhost:27016/")
# mongo_db = mongo_client["birb_kr"]

# LOCAL
mongo_client = pymongo.MongoClient(MONGO_DB_URL)
mongo_db = mongo_client[MONGO_DB_DB]

def select(collection, query, sort_by=None, ascending=False, skip=0, limit=5, includes_id=False):


    ret = []
    ## SORT BY MULTI FIELD
    if isinstance(sort_by, list) and isinstance(ascending, list):
        sort_list = []
        for sb, sh in zip(sort_by, ascending):
            sort_list.append(tuple([sb, 1 if sh else -1]))

        cur = collection.find(query, {'_id': includes_id}).sort(sort_list).skip(skip)

    ## SORT BY SINGLE FIELD
    else:

        if sort_by is None:
            cur = collection.find(query, {'_id': includes_id})
        else:
            sort_how = 1 if ascending else -1
            cur = collection.find(query, {'_id': includes_id}).sort(sort_by, sort_how).skip(skip)

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


def aggregate(collection, query, sort_by=None, ascending=False, skip=0, limit=50, includes_id=False, lookups=[]):

    '''

    SUB COLLECTION에서 특정 KEY 값만 가져오는 AGGREGATION WRAPPER

    :param collection:
    :param query:
    :param sort_by:
    :param lookup:
    :return:
    '''

    print(collection, query, skip, limit)

    pipeline = []
    sort_how = 1 if ascending else -1
    # cnt = collection.count_documents({}) ## FOR HAS NEXT  // 조건에 맞는것만 세야지
    # # print(cnt, skip, limit)
    # #
    # # if skip > cnt:
    # #     print('111')
    # #     has_next = False
    # # elif cnt - skip <= limit:
    # #
    # #     print('222')
    # #     has_next = False
    # # else:
    # #     print('333')
    # #     has_next = True
    #
    # # print("COUNT, LIMIT, SKIP 가지고 hasnext 도출해내라", cnt, limit, skip)
    if isinstance(sort_by, list) and isinstance(ascending, list):
        sort_dict = {}
        for sb, sh in zip(sort_by, ascending):
            sort_dict[sb] = 1 if sh else -1

    else:
        sort_dict= {sort_by: sort_how}



    if sort_by:
        pipeline.append({
            "$sort": sort_dict
        })



    if len(lookups)>0:
        for lookup in lookups:

            # pipeline: [
            #     { $project: {id: 1, cafeId: { $toObjectId: "$$id"}, name: 1}},
            # { $match: {expr: { $eq: ["$$cafeId", "$cafeId"]}}},
            # { $sort: {stampDate: -1}},
            # { $limit: 10}
            # ]

            ## 1:1 MATCHING, FLATTEN
            if 'extract' in lookup:

                _lookup = {
                        "from": lookup['collection'],
                        "localField": lookup["left_key"],
                        "foreignField": lookup["right_key"],
                        "as": 'TEMP' if isinstance(lookup['extract'], list) else lookup['extract'],
                }


                pipeline.append({
                    "$lookup": _lookup
                })
                pipeline.append({
                    "$set": {x: {"$arrayElemAt": ["$%s.%s" % ('TEMP', x), 0]} for x in lookup['extract']}
                })
                pipeline.append({
                    "$unset": ["_id", "TEMP"]
                })

            ## 1:N MATCHING, AS KEY, VALUE
            elif 'as' in lookup:

                pipeline.append({
                    "$lookup": {
                        "from": lookup['collection'],
                        "localField": lookup["left_key"],
                        "foreignField": lookup["right_key"],
                        "as": lookup['as']
                    },
                })

                pipeline.append({
                    "$unset": ["_id", "TEMP"]
                })


            if 'count' in lookup:
                pipeline.append({
                    "$set": {
                        lookup['count']: { "$size": "$%s"%(lookup['count'])}
                    }
                })


    # ===========================================================
    pipeline.append({
        "$match": query,
    })
    pipeline.append({
        "$skip": skip,
    })
    pipeline.append({
        "$limit": limit+1,
    })

    ret = [x for x in collection.aggregate(pipeline)]

    if len(ret) == limit+1:
        has_next = True
        ret = ret[:-1]
    else:
        has_next = False

    print(len(ret))

    # ===========================================================
    return ret, has_next


def update_inc(collection, query, key, value):
    '''

    조회수 증가호출 함수

    :param collection:
    :param query:
    :param key:
    :param value:
    :return:
    '''

    values = { "$inc": { key: 1} }
    collection.update_one(query, values)

def update_set_one(collection, query, key, value):
    '''

    특정값 attributedml 값 조정 함수, only one value

    :param collection:
    :param query:
    :param key:
    :param value:
    :return:
    '''

    update = { "$set": { key: value}}
    collection.update_one(query, update)

def update_set_multi(collection, query, key_value_dict):
    '''

    특정값 attributedml 값 조정 함수, multi value

    :param collection:
    :param query:
    :param key:
    :param value:
    :return:
    '''




    update = { "$set": key_value_dict}
    ret = collection.update_one(query, update)
    print(ret.modified_count)

    logger.info("%s"%(ret))
    return ret


def update_push(collection, query, key, value):
    push = { "$push": { key: value }}
    return collection.update_one(query, push)

def update_pull(collection, query, key, value):
    pull = { "$pull": { key: value }}
    return collection.update_one(query, pull)


if __name__ == "__main__":


    # update_inc(collection = mongo_db['post'],
    #        query = {"post_id" : {"$eq": "621b6d8b4584af4fb521bdab"}},
    #        key = 'view',
    #        value = 2
    #        )


    # ret = update_push(collection=mongo_db['post'],
    #             query= {"post_id" : {"$eq": "621cc5b28370bf3c3302e20b"}},
    #             key='recomm',
    #             value='test')

    ret = update_pull(collection=mongo_db['post'],
                query= {"post_id" : {"$eq": "621cc5b28370bf3c3302e20b"}},
                key='recomm',
                value='test')

    print(ret)




    # USER_ID 가지고 EMAIL 갖다 붙이기... 1:1 => flatten
    # aggregate(mongo_db['post'], query={},
    #     sort_by='publish_timestamp',
    #     ascending=True,
    #     limit=5,
    #     skip=0,
    #     lookups=[
    #     {
    #         'collection': 'user',  # COLLECTION TO JOIN
    #         'left_key': 'user_id',      # JOIN ON
    #         'right_key': 'user_id',      # JOIN ON
    #         'extract': ['email', 'pw'],       # FIELD TO EXTRACT FROM THE 'FROM COLLECTION'
    #     }
    # ])

    # POST_ID 가지고 COMMENT 가져오... 1:N => nested
    # ret = aggregate(mongo_db['post'], query={},
    #     sort_by='publish_timestamp',
    #     ascending=True,
    #     limit=5,
    #     skip=0,
    #     lookups=[
    #     {
    #         'collection': 'post_comment',  # COLLECTION TO JOIN
    #         'left_key': 'post_id',      # JOIN ON
    #         'right_key': 'post_id',      # JOIN ON
    #         'as': 'comment',
    #         'count':'comment'  ## COMMENT 라는 ARRAY가 ARRAY LENGTH로 치환됨
    #     }
    # ])
    # for r in ret:
    #     print(r)


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

    #
    # ret, has_next = select(col, {"age":{"$gt": 10}}, 'age', True, 2, 5)
    #
    # for row in ret:
    #     print(row)
    #
    # ret, has_next = select(col, {"age":{"$gt": 10}}, 'age', False, 2, 5)
    #
    # for row in ret:
    #     print(row)
    #
    # print(has_next)
    # # =======================================================================================================
    # # O U T P U T
    # # =======================================================================================================
    # # {'name': 'Susan', 'age': 13, 'address': 'One way 98'}
    # # {'name': 'Betty', 'age': 15, 'address': 'Green Grass 1'}
    # # {'name': 'Sandy', 'age': 17, 'address': 'Ocean blvd 2'}
    # # {'name': 'Ben', 'age': 20, 'address': 'Park Lane 38'}
    # # {'name': 'William', 'age': 25, 'address': 'Central st 954'}
    # # True
    #
    # ret, has_next = select(col, {"age":{"$gt": 10}}, 'age', True, 5, 2)
    #
    # for row in ret:
    #     print(row)
    #
    # print(has_next)
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