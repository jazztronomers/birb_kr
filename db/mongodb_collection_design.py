## MONGO DB TEST CASE
##
## 100 USER * 1000 CONTENT * 100 POSTS
## 10000 USER * 3000 CONTENT * 500 POSTS




## user



user = {
    "userid": 1,
    "usernm": "ruben",
    "email": "jazztronomers@gmail.com",
    "password": "**********",
    "telegram": "",
    "instagram": "",
    "cameras":['iphone11', 'nikon-d500', 'canon-90d', 'canon-shx70hs']
}

## content
content = {
    "content_id": 1,
    "user_id": 1,
    "content_type": "p",
    "publish_timestamp": "2022-01-19 23:37:11.72914" ,
    "observe_timestamp": "2021-01-19 23:37:11.72914" ,
    "object_storage_url": "https://cdn.somewhere.s3/news/photo/202008/557518_154093_5515.jpg",
    "from": 'instagram'
}

## content_meta
content_meta = {
    "content_id": 1,
    "species": ["031"],
    "latitude": 37.00000001,
    "longtude": 120.0000001,
    "like": [1,2,3],  ## user_id
    "abuse": 5,
    "delyn": 0,
    "blindyn": 0,
    "tags":["흰꼬리수리", "공릉천"],
    "comments":[
        {
            "user_id":2, 
            "comment":"hello",
            "publish_timestamp": "2022-01-19 23:37:11.72914",
        }, {
            "user_id":3, 
            "comment":"bye",
            "publish_timestamp": "2022-01-19 23:37:12.72914"
        }
    ]
}

## Post

post = {
    "user_id": 1,
    "description":"ASDSADSADSADASDSA",
    "contents":[
        {"content_id": ""},
        {"content_id": ""},
        {"content_id": ""},
        {"content_id": ""}
    ]
}

## Species
species = {
    "sid":"",                     #
    "species_kr":"",
    "order_kr":"",
    "family_kr":"",
    "species_en":"",
    "order_en":"",
    "family_en":"",
    "species_sn":"",
    "order_sn":"",
    "family_sn":"",
    "observe_level":1,            #
    "iucn":'LC',
    "nt_mn":True,
    "extlv":None
}

## CAMERA

camera = {
    "manufacturer":"nikon",
    "model_name":"d500"
}

## Camera

## Query

[
    {
        "H":"GET ALL PHOTO OF '흰꼬리수리' FROM ALL USERS WITHOUT X,Y",
        "Q":''
    },{
        "H":"GET ALL PHOTO OF '흰꼬리수리'  FROM ALL USERS IN X,Y",
        "Q":''
    },{
        "H":"GET ALL CONTENT FROM BOUNDARY CONDITION X,Y",
        "Q":''
    },{
        "H":"GET ALL CONTENT OF USER 001",
        "Q":''
    }
]


## aggregation to count contents tags
## https://pymongo.readthedocs.io/en/stable/examples/aggregation.html
