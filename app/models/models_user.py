from jazzbirb_kr.app.util.mongo_connector import mongo_db
from hashlib import sha256


class User:

    def __init__(self, user_id=None):
        self.user_id = user_id
        self.collection = mongo_db['user']


    def function(self):
        '''
        기본 응답은 아래 dictionary를 기본으로 한다
        '''

        return {
            'result': "함수의 응답결과, Boolean Or Object",
            'message': "화면단에 ALERTING 할 메세지"
        }

    def register(self, email, pw, user_name, user_id):
        # CHECK EXISTS
        pw_encoded = sha256(pw.encode('utf-8')).hexdigest()
        email_dup = self.check_dup_email(email)
        if email_dup:

            return {'result': False,
                    'message': 'email already exsists'}

        else:

            self.collection.insert_one({"email": email,
                                        "pw":pw_encoded,
                                        "user_id":user_id,
                                        "user_name":user_name,
                                        'user_lv':1,
                                        "location":{"x":None, "y":None}
                                        })


            return {'result': True,
                    'message': 'Success'}

    def check_dup_email(self, email):

        ret = self.collection.find_one({"email": { "$eq": email}})
        if not ret:
            return False  # 이메일 존재함
        else:
            return True  # 이메일 존재하지 않음

    # INSERT

    def login(self, email, pw):
        pw_encoded = sha256(pw.encode('utf-8')).hexdigest()


        # 아이디로 먼저
        response = self.collection.find_one({"user_id": {"$eq": email},
                                             "pw": {"$eq": pw_encoded}, })

        if response is not None and len(response) > 0:

            ret = {'result': True,
                   'message': 'Login success',
                   'email': response.get("email"),
                   'user_id': response.get("user_id"),
                   'user_name': response.get("user_name"),
                   'user_lv': response.get("user_lv"),
                   'location': response.get("location")
                   }

        else:
            # 안되면 이메일
            response = self.collection.find_one({"email": { "$eq": email},
                                             "pw": { "$eq": pw_encoded},})


            if response is not None and len(response) > 0:
                ret = {'result': True,
                       'message': 'Login success',
                       'email': response.get("email"),
                       'user_id': response.get("user_id"),
                       'user_name': response.get("user_name"),
                       'user_lv': response.get("user_lv"),
                       'location': response.get("location")
                       }

            else:
                ret = {'result': False,
                       'message': 'Username not found or password is wrong',
                       'email': None,
                       'user_id': None,
                       'user_name': None,
                       'user_lv': None,
                       'location': None,
                       }

        return ret



    def check_dup(self, key, value):
        ret = self.collection.find_one({key: { "$eq": value}})
        if ret:
            return False  # 이메일 존재함
        else:
            return True  # 이메일 존재하지 않음

    def check_curr_pw(self, email, curr_pw):

        curr_pw_input = sha256(curr_pw.encode('utf-8')).hexdigest()
        ret = self.collection.find({"email": { "$eq": email}})

        if curr_pw_input == ret.get("pw"):
            return True

        else:
            return False

    def update_username(self, new_username, usercode):
        return True
        # if self.check_dup(new_username):
        #     query = '''UPDATE `jazzstockuser`.`T_USER_INFO` SET `USERNAME` = '%s' WHERE (`USERCODE` = '%s');''' % (
        #     new_username, usercode)
        #     try:
        #         db.insert(query)
        #         return True
        #
        #     except Exception as e:
        #         return False
        #
        # else:
        #     return False

    def update_password(self, new_password, usercode):

        return True

        # new_password_encoded = sha256(new_password.encode('utf-8')).hexdigest()
        # query = '''UPDATE `jazzstockuser`.`T_USER_INFO` SET `PASSWORD` = '%s' WHERE (`USERCODE` = '%s');''' % (
        # new_password_encoded, usercode)
        # try:
        #     db.insert(query)
        #     return True
        #
        # except Exception as e:
        #     return False


    # def get_collection(self):
    #     '''
    #     개인도감 데이터 가져오기
    #     :return:
    #     '''
    #
    #     if self.email is None:
    #         ret = {'result': False,
    #                'message': 'email not found'
    #                }
    #         return ret
    #     else:
    #         user = self.collection.find_one({"email": { "$eq": self.email}})
    #         return user.get("collection")
    #
    #
    # def set_collection(self, collection):
    #     '''
    #     개인도감 데이터 쓰기 BULK (insert ot update)
    #     :return:
    #     '''
    #
    #     if self.email is None:
    #         ret = {'result': False,
    #                'message': 'email not found'
    #                }
    #
    #     else:
    #
    #         query = {"email": {"$eq": self.email}}
    #         append = {
    #             '$set': {
    #                 "collection": collection
    #             }
    #         }
    #
    #         self.collection.update_one(query, append)
    #         ret = {'result': True,
    #                'message': 'collection update success'
    #                }
    #         return ret

    def set_location(self, location):
        query = {"user_id": {"$eq": self.user_id}}
        append = {
            '$set': {
                "location": location
            }
        }

        result_update = self.collection.update_one(query, append)
        if result_update.raw_result.get("n") == 1:

            ret = {'result': True,
                   'message': 'collection update success'
                   }
        else:
            ret = {'result': False,
                   'message': 'collection update fail'
                   }
        return ret

    def get_location(self):
        print(self.user_id)
        query = {"user_id": {"$eq": self.user_id}}
        location = self.collection.find_one(query).get('location')
        return location