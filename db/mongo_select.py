import pymongo
from datetime import datetime

mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
mongo_db_local = mongo_client["local"]


mongo_col = mongo_db_local['content']


# $eq	It will match the values that are equal to a specified value.
# $ne	It will match all the values that are not equal to a specified value.

# $gt	It will match the values that are greater than a specified value.
# $gte	It will match all the values that are greater than or equal to a specified value.
# $lt	It will match all the values that are less than a specified value.
# $lte	It will match all the values that are less than or equal to a specified value.

# $in	It will match any of the values specified in an array.
# $nin	It will match none of the values specified in an array.

class TimeCheck:
    def __init__(self):
        self.name = None
        self.cnt = 0
        self.start = datetime.now()
        self.run()
        self.end = datetime.now()
        print(f"수행로직: {self.name}, 소요시간: {(self.end - self.start).total_seconds()}, 데이터건수: {self.cnt}")

    def run(self):
        self.name="ruben"


class CountAllUsers(TimeCheck):
    def run(self):
        self.name = "전체유저수 체크"
        mongo_col = mongo_db_local['user']
        self.cnt += mongo_col.count_documents({})

class CountAllContents(TimeCheck):
    def run(self):
        self.name = "전체콘텐트수 체크"
        mongo_col = mongo_db_local['content']
        self.cnt += mongo_col.count_documents({})


class SelectUsers(TimeCheck):
    def run(self, limit=10):
        self.name = "특정유저의 모든 컨텐츠 정보 받아오기"
        mongo_col = mongo_db_local['content']

        query = { "user_id": { "$eq": 'uid0413' }}
        for e in mongo_col.find(query).sort("publish_timestamp", -1):
            self.cnt+=1

class SelectBounds(TimeCheck):
    def run(self, limit=10):
        self.name = "특정 x,y 좌표범위안에 모든 데이터를 받아오기"
        mongo_col = mongo_db_local['content']

        query = { "x": { "$gt": 36.0000000 },
                  "x": { "$lt": 36.1000000 },
                  "y": { "$gt": 124.0000000 },
                  "y": { "$lt": 124.1000000 }}

        for e in mongo_col.find(query):
            self.cnt+=1




class SelectBoundsSpecificSpecies(TimeCheck):
    '''
    https://docs.mongodb.com/manual/tutorial/query-arrays/
    '''
    def run(self, limit=10):
        self.name = "특정 x,y 좌표범위안에 특정 종 A만 검색해서 받아오기"
        mongo_col = mongo_db_local['content']

        query = { "x": { "$gt": 36.0000000 },
                  "x": { "$lt": 36.1000000 },
                  "y": { "$gt": 124.0000000 },
                  "y": { "$lt": 124.1000000 },
                  "species": '074' }

        for e in mongo_col.find(query):
            self.cnt+=1
            # print(e)

class SelectBoundsSpecificSpeciesB(TimeCheck):
    '''
    https://docs.mongodb.com/manual/tutorial/query-arrays/
    '''
    def run(self, limit=10):
        self.name = "특정 x,y 좌표범위안에 특정 종 B 만 검색해서 받아오기"
        mongo_col = mongo_db_local['content']

        query = { "x": { "$gt": 36.0000000 },
                  "x": { "$lt": 36.1000000 },
                  "y": { "$gt": 124.0000000 },
                  "y": { "$lt": 124.1000000 },
                  "species": '073' }

        for e in mongo_col.find(query):
            self.cnt+=1
            # print(e)

class SelectBoundsManySpecies(TimeCheck):
    '''
    db.inventory.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )
    '''

    def run(self, limit=10):
        self.name = "특정 x,y 좌표범위안에 A종 또는 B종을 or 조건으로 검색해서 받아오기"
        mongo_col = mongo_db_local['content']

        query = { "x": { "$gt": 36.0000000 },
                  "x": { "$lt": 36.1000000 },
                  "y": { "$gt": 124.0000000 },
                  "y": { "$lt": 124.1000000 },
                  "$or": [{"species": '074'}, {"species": '073'}] }

        for e in mongo_col.find(query):
            self.cnt+=1
            # print(e)


## AGGREGATE 해야됨
# class SelectBoundsContainsSpecificTag(TimeCheck):
#     def run(self, limit=10):
#         self.name = "특정 x,y 좌표범위안에 모든 테그정보 검색해서 받아오기"
#         mongo_col = mongo_db_local['content']
#
#         query = { "x": { "$gt": 36.5888888 },
#                   "x": { "$lt": 36.6888888 },
#                   "y": { "$gt": 124.5888888 },
#                   "y": { "$lt": 124.6888888 }
#                   "speices": }
#
#         for e in mongo_col.find(query):
#             self.cnt+=1

SelectUsers()
CountAllContents()
CountAllUsers()

SelectBoundsSpecificSpecies()
SelectBoundsSpecificSpeciesB()
SelectBoundsManySpecies()
SelectBounds()



