## MONGO DB TEST CASE
##
## 100 USER * 1000 CONTENT * 100 POSTS
## 10000 USER * 3000 CONTENT * 500 POSTS




## user



user = {
    "usernm": "jazzbirb",
    "email": "jazztronomers@gmail.com",
    "password": "**********",
    "telegram": "",
    "instagram": "",
    "cameras":['iphone11', 'nikon-d500', 'canon-90d', 'canon-shx70hs'],
    "collection":[
        {
            "year": 'earlier',
            "species": []
        },
        {
            "year":'2021',
            "species":[]
        },
        {
            "year":'2022',
            "species":[]
        }
    ]
}

## content
content = {
    "content_id": 1,
    "content_type": "p",
    "publish_timestamp": "2022-01-19 23:37:11.72914" ,
    "observe_timestamp": "2021-01-19 23:37:11.72914" ,
    "object_storage_url": "https://cdn.somewhere.s3/news/photo/202008/557518_154093_5515.jpg",
    "from": 'instagram'
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




## aggregation to count contents tags
## https://pymongo.readthedocs.io/en/stable/examples/aggregation.html




## 데이터 가져오는 프로세스

## 데이터 불러오기 ||  화면 그리기는 독립수행

## 최초 어플 초기화시, Bounds 정보와 Species 정보 상관없이 상위 100건의 데이터 읽어드리기

## 스크롤내리면서 10장씩 화면에 그리기 로드하기

## 바운드정보로 조회하면 현재 데


## function getRawData(bounds, species, batch_size, limit)
##
## if bounds => only observe level 1~2 includes in results
##           => can not specify species with boundary condition
##
## else      => all pics includes in results
##           => In addition, species information can be inquired
