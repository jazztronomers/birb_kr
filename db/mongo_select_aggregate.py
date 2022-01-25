import pymongo
from datetime import datetime

mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
mongo_db_local = mongo_client["local"]
mongo_col = mongo_db_local['content']



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


# address = {
#     "name": "Bob",
#     "blk_no": 22,
#     "street" : "dewey street",
#     "city" : "United States of America"
# }
#
# userinfo = {
#     "contact_name": "Bob",
#     "age": 27,
#     "sex" : "male",
#     "citizenship" : "Filipino"
# }
#
# ## how to aggregate ??
#
#
# # db.userInfo.aggregate([
# #     { $lookup:
# #         {
# #            from: "address",
# #            localField: "contact_name",
# #            foreignField: "name",
# #            as: "address"
# #         }
# #     }
# # ]).pretty();

# db.orders.aggregate([
#   {
#     $lookup: {
#       from: "stati",
#       localField: "status",
#       foreignField: "id",
#       as: "strStatus"
#     }
#   },
#   {
#     $set: {
#       strStatus: { $arrayElemAt: ["$strStatus.str", 0] }
#     }
#   }
# ])

query = [{
        "$lookup": {
            "from": "bird",
            "localField": "species",
            "foreignField": "bid",
            "as": "species_kr"
        },
    },
    {
        "$set": {
            "species_kr": "$species_kr.species_kr"
        }
    }
]



print(mongo_db_local['content'].aggregate(query).count())


