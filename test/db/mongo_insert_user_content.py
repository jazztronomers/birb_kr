import pymongo

import random
from random import randrange, uniform, randint

from datetime import timedelta
from datetime import datetime


mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
mongo_db_local = mongo_client["local"]


user = {
    "user_id": 1,
    "user_nm": "ruben",
    "email": "jazztronomers@gmail.com",
    "password": "**********",
}

content = {
    "content_id": 1,
    "user_id": 1,
    "content_type": "p",
    "publish_timestamp": "2022-01-19 23:37:11.72914" ,
    "observe_timestamp": "2021-01-19 23:37:11.72914" ,
    "object_storage_url": "https://cdn.somewhere.s3/news/photo/202008/557518_154093_5515.jpg",
    "source": 'instagram'
}
TAGS_BIRD = ["흰꼬리수리", "곤줄박이", "직박구리", "흰뺨검둥오리", "해오라기", "박새", "쇠박새", "동고비", "참수리", "검은이마직박구리", "참새", "까치", "까마귀", "왜가리"]
TAGS_PLACE = ["유부도", "홍제천", "밤섬", "성미산", "올림픽공원", "월공", "공릉천", "송도", "난지천", "중랑천", "강서생태습지", "굴포천", "인천공항"]
BIDS = ['031', '218', '306', '305', '220', '255', '355', '032', '297', '254', '063', '213', '309', '143', '189', '282', '181', '169', '079', '406', '113', '209', '206', '407', '013', '264', '411', '418', '415', '419', '420', '413', '409', '304', '410', '416', '602', '421', '259', '417', '408', '414', '303', '412', '261', '263', '179', '193', '311', '042', '301', '145', '310', '390', '321', '098', '087', '338', '281', '275', '287', '438', '323', '360', '276', '351', '146', '353', '322', '448', '150', '185', '224', '319', '199', '029', '093', '454', '163', '130', '046', '267', '194', '253', '312', '367', '149', '366', '359', '362', '286', '139', '196', '361', '165', '348', '443', '451', '316', '212', '450', '047', '449', '365', '364', '459', '458', '262', '144', '479', '470', '471', '374', '437', '455', '352', '442', '441', '473', '472', '457', '461', '478', '468', '104', '086', '439', '440', '358', '447', '343', '444', '345', '279', '072', '363', '453', '452', '446', '445', '474', '464', '462', '466', '463', '456', '481', '469', '467', '480', '166', '318', '260', '136', '137', '101', '126', '085', '180', '270', '476', '482', '477', '475', '294', '377', '375', '376', '490', '489', '493', '491', '603', '492', '105', '207', '211', '205', '432', '278', '434', '350', '269', '092', '285', '435', '339', '174', '433', '191', '204', '436', '142', '044', '186', '167', '313', '128', '016', '502', '177', '503', '504', '127', '094', '249', '158', '356', '155', '251', '293', '095', '107', '160', '357', '141', '162', '201', '387', '168', '258', '048', '427', '346', '129', '226', '140', '425', '426', '431', '428', '422', '424', '430', '429', '423', '082', '284', '488', '486', '295', '485', '289', '483', '487', '484', '012', '183', '108', '342', '400', '399', '397', '396', '398', '394', '393', '395', '391', '392', '290', '379', '059', '198', '389', '302', '349', '300', '369', '347', '337', '495', '368', '494', '380', '496', '497', '498', '157', '154', '161', '070', '215', '324', '115', '036', '197', '116', '090', '040', '102', '248', '100', '110', '052', '049', '296', '084', '061', '243', '125', '030', '148', '257', '245', '378', '217', '153', '247', '216', '089', '068', '170', '192', '041', '208', '065', '112', '156', '077', '202', '122', '230', '171', '291', '292', '099', '064', '134', '175', '114', '083', '308', '039', '283', '017', '045', '152', '314', '103', '190', '091', '383', '384', '187', '274', '097', '178', '132', '265', '081', '222', '242', '124', '317', '277', '273', '188', '315', '043', '517', '172', '252', '111', '528', '524', '527', '525', '529', '076', '537', '553', '549', '184', '173', '271', '037', '062', '272', '562', '135', '266', '159', '564', '225', '151', '228', '569', '200', '014', '572', '280', '214', '028', '581', '372', '133', '109', '587', '335', '221', '307', '123', '596', '509', '510', '514', '512', '511', '515', '533', '526', '538', '545', '541', '554', '547', '539', '551', '536', '567', '558', '565', '557', '568', '566', '240', '570', '575', '576', '580', '582', '585', '591', '594', '595', '600', '556', '561', '386', '593', '597', '382', '505', '506', '508', '256', '513', '516', '518', '106', '520', '519', '223', '232', '521', '522', '523', '605', '535', '546', '555', '548', '543', '604', '563', '560', '219', '559', '573', '583', '584', '574', '589', '588', '590', '592', '598', '601', '534', '544', '550', '373', '381', '540', '164', '599', '500', '499', '501', '371', '336', '354', '325', '341', '370', '210', '078', '051', '147', '227', '401', '080', '288', '250', '050', '138', '038', '403', '402', '268', '229', '096', '131', '404', '405', '182', '507', '195', '088']



class BirbMongo:

    def __init__(self):
        self.collection_name= 'birb'
        self.object = {}

    def insert(self, db):
        db[self.collection_name].insert_one(self.object)


class BirbUser(BirbMongo):

    def __init__(self, user_id, user_nm, email, password):

        self.collection_name = 'user'
        self.object = {
            "user_id": user_id,
            "user_nm": user_nm,
            "email": email,
            "password": password
        }


class BirbContent(BirbMongo):
    def __init__(self, content_id, user_id, content_type, publish_timestamp, observe_timestamp, object_storage_url, source, x,y, species):

        self.collection_name = 'content'

        self.object = {
            'content_id': content_id,
            'user_id': user_id,
            'content_type': content_type,
            'publish_timestamp': publish_timestamp,
            'observe_timestamp': observe_timestamp,
            'object_storage_url': object_storage_url,
            'source': source,
            'x': x,
            'y': y,
            'species': species,
        }


class BirbContentMeta(BirbMongo):
    def __init__(self, content_id, like, abuse, delyn, blindyn, tags, comments):
        self.collection_name = 'content_meta'
        self.object = {
            'content_id': content_id,
            'like': like,
            'abuse': abuse,
            'delyn': delyn,
            'blindyn': blindyn,
            'tags': tags,
            'comments': comments
        }

def get_random_timestamp():
    def random_date(start, end):
        delta = end - start
        int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
        random_second = randrange(int_delta)
        return start + timedelta(seconds=random_second)


    d1 = datetime.strptime('1/1/2020 1:30 PM', '%m/%d/%Y %I:%M %p')
    d2 = datetime.strptime('1/1/2021 1:30 AM', '%m/%d/%Y %I:%M %p')
    return str(random_date(d1, d2))

if __name__=="__main__":

    user_cnt = 2001
    post_cnt_per_user = 1001

    print("start making dummy data...")

    mongo_db_local.drop_collection('user')
    mongo_db_local.drop_collection('content')
    mongo_db_local.drop_collection('content_meta')

    t0 = datetime.now()
    for idx in range(user_cnt):

        t1 = datetime.now()
        BirbUser(user_id ="uid%04d" % (idx),
                   user_nm ="unm%04d" %(idx),
                   email= "email%04d@d.com" % (idx),
                   password="pws%04d" % (idx)).insert(mongo_db_local)

        for jdx in range(post_cnt_per_user):
            t2 = datetime.now()
            BirbContent(content_id='uid%04dcid%04d'%(idx, jdx),
                        user_id='uid%04d'%(idx),
                        content_type=0,
                        x = round(uniform(124, 128), 7),
                        y = round(uniform(36, 38), 7),
                        species=random.choices(BIDS, k=2),
                        publish_timestamp=get_random_timestamp(),
                        observe_timestamp=get_random_timestamp(),
                        object_storage_url="https://jazzbirb-bird.s3.ap-northeast-2.amazonaws.com/0109_003.jpg",
                        source="upload").insert(mongo_db_local)

            BirbContentMeta(content_id = 'uid%04d_cid%04d'%(idx, jdx),
                            like = [],
                            abuse = [],
                            delyn = randint(0,1),
                            blindyn = 0,
                            tags = [random.choice(TAGS_BIRD), random.choice(TAGS_PLACE)],
                            comments=[]).insert(mongo_db_local)
            t3 = datetime.now()
        t4 = datetime.now()
        print(idx, (t4 - t0).total_seconds())

    t5= datetime.now()
    print(idx, (t5-t0).total_seconds())

    t00 = datetime.now()
    ret = mongo_db_local['user'].create_index('user_id')
    print('#1 index for user', ret, (datetime.now()-t00).total_seconds())

    t00 = datetime.now()
    ret = mongo_db_local['content'].create_index('content_id')
    print('#1 index for content - content_id', ret, (datetime.now()-t00).total_seconds())

    ret = mongo_db_local['content'].create_index([('publish_timestamp', -1)])
    print('#1 index for content - publish_timestamp', ret, (datetime.now()-t00).total_seconds())

    ret = mongo_db_local['content'].create_index([('x', -1)])
    print('#1 index for content_meta - x', ret, (datetime.now()-t00).total_seconds())

    ret = mongo_db_local['content'].create_index([('y', -1)])
    print('#1 index for content_meta - y', ret, (datetime.now()-t00).total_seconds())

    t00 = datetime.now()
    ret= mongo_db_local['content_meta'].create_index('content_id')
    print('#1 index for content_meta - content_id', ret, (datetime.now()-t00).total_seconds())

    t00 = datetime.now()
    ret = mongo_db_local['content'].create_index([('user_id', -1)])
    print('#1 index for content - user_id', ret, (datetime.now()-t00).total_seconds())