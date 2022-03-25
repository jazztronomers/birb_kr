import pymongo
import pandas as pd
import numpy as np
from random import randrange, uniform, randint

from datetime import timedelta
from datetime import datetime


df = pd.read_csv("data/bird.csv", delimiter='\t')



df = df[['BID', 'SPECIES_KR', 'OBSERVE_LEVEL_TXT', 'OBSERVE_LEVEL',
       'ARRIVAL_TYPE', 'ORDER_KR', 'FAMILY_KR', 'SPECIES_EN', 'ORDER_EN',
       'FAMILY_EN', 'SPECIES_SN', 'ORDER_SN', 'FAMILY_SN',
       'IUCN', 'CITES', 'NATURAL_MONUMENT', 'EXTINCTION_KR']]


df.columns = [x.lower() for x in df.columns.tolist()]
df = df.replace({np.nan: None})
# df.fillna(None)
birds = df.to_dict(orient='records')

print(birds)
print(type(birds))



for i in range (len(birds)):
       birds[i]['bid'] = '%03d'%(birds[i].get('bid'))



mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
mongo_db_local = mongo_client["local"] # db


mongo_db_local.drop_collection('bird')
mongo_db_bird = mongo_db_local['bird'] # collection

mongo_db_bird.insert_many(birds)

ret = mongo_db_bird.create_index([('bid', -1)])



#
print(['%03d'%(x) for x in df['bid'].drop_duplicates().tolist()])
#
# import random
# print(random.choices(df['bid'].drop_duplicates().tolist(), k=2))
# print(len(df))