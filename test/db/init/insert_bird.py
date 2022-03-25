import pymongo

_dict_observe_level = {}
_dict_observe_level['아주 흔함'] = 1
_dict_observe_level['흔함'] = 2
_dict_observe_level['국지적으로 흔함'] = 3
_dict_observe_level['국지적으로 흔함.'] = 3
_dict_observe_level['국지적 흔함'] = 3
_dict_observe_level['드믊'] = 3
_dict_observe_level['드묾'] = 3
_dict_observe_level['아주 드묾'] = 4
_dict_observe_level['흔하지 않음'] = 4
_dict_observe_level['흔하지않음'] = 4
_dict_observe_level['매우 드묾'] = 5
_dict_observe_level['매우 드묾'] = 5
_dict_observe_level['희귀'] = 5
_dict_observe_level['(현재)희귀'] = 5
_dict_observe_level['북한에서만 관찰 기록이 있고, 남한에서는 관찰 기록이 없음,'] = 5
_dict_observe_level['북한에서의 관찰기록만 있음'] = 5
_dict_observe_level['.'] = 7
_dict_observe_level['멸종'] = 8

_dict_iucn = {}
_dict_iucn['IUCN-LC'] = 'LC'
_dict_iucn['IUCN-VU'] = 'VU'
_dict_iucn['IUCN-EN'] = 'EN'
_dict_iucn['IUCN-NT'] = 'NT'
_dict_iucn['IUCN-CR'] = 'CR'
_dict_iucn['NA'] = 'NA'

_dict_sites = {}

_dict_sites['NA'] = 'NA'
_dict_sites['CITES-CITES1급'] = '1'
_dict_sites['CITES-CITES 1급'] = '1'
_dict_sites['CITES-CITES2급'] = '2'
_dict_sites['CITES-CITES 2급'] = '2'
_dict_sites['CITES-CITES3급'] = '3'
_dict_sites['CITES-CITES 3급'] = '3'

_dict_el = {}
_dict_el['NA'] = 'NA'
_dict_el['멸종위기-멸종위기2급'] = '2'
_dict_el['멸종위기-멸종위기1급'] = '1'
_dict_el['멸종위기-멸종위기 2'] = '2'
_dict_el['멸종위기-멸종위기 1'] = '1'

_dict_seasonal = {}
_dict_seasonal['NA'] = 'NA'
_dict_seasonal['겨울철새'] = '겨울철새'
_dict_seasonal['여름철새'] = '여름철새'
_dict_seasonal['텃새'] = '텃새'
_dict_seasonal['나그네새'] = '나그네새'
_dict_seasonal['길'] = '미조'

import requests
import json
import pandas as pd
from bs4 import BeautifulSoup as BS

url = 'https://www.birdcenter.kr/index.php?MenuID=2&mode=tree'  # 한국의 새
response = requests.get(url).content.decode(encoding='utf-8')

soup = BS(response)



mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
mongo_db_local = mongo_client["local"] # db


mongo_db_local.drop_collection('bird')
mongo_db_bird = mongo_db_local['bird'] # collection


dict_observe_level = {}
dict_iucn = {}
dict_sites = {}
dict_nm = {}
dict_el = {}
dict_seasonal = {}

L = []

for i, ultag in enumerate(soup.find_all('ul', {'class': 'bird_tree'})):

    for line in str(ultag).split('\n'):

        # print(line)

        if str.startswith(line, '<li><span><img alt="icon" src="/images/bird_icon'):
            # print("목|", BS(line).find_all('span')[0].text)
            order_kr, order_sn, order_en = BS(line).find_all('span')[0].text.split('/')


        elif str.startswith(line, '<li><span><em class="name_kr">'):
            # print("과|", BS(line).find_all('span')[0].text)

            family_kr, family_sn, family_en = BS(line).find_all('span')[0].text.split('/')

        elif str.startswith(line, '<li><a href="/index.php?MenuID=2') or \
             str.startswith(line, '<li class="active"><a href="/index.php?MenuID=2'):
            species_kr, species_sn, species_en = BS(line).find_all('a')[0].text.split('/')

            href = BS(line).find_all('a')[0].get('href')
            bid_num = int(href.split('=')[-1])
            bid = 'B%03d'%(bid_num)

            url = 'https://www.birdcenter.kr/?MenuID=2&mode=view&bid='
            response = requests.get(url + str(bid_num)).content.decode(encoding='utf-8')

            dfs = pd.read_html(response)

            try:
                categories = str(dfs[0].loc[2][1])
            except:
                categories = 'NA'
            try:
                observe_level = str(dfs[1].loc[3][1])
            except:
                observe_level = 'NA'

            try:
                seasonal_spec = str(dfs[1].loc[1][1].split()[0])
            except:
                seasonal_spec = 'NA'

            if 'IUCN-' in categories:

                IUCN = categories[categories.find('IUCN-'): categories.find('IUCN-') + 7]
            else:
                IUCN = 'NA'

            if 'CITES' in categories:
                SITES = categories[categories.find('CITES'): categories.find('CITES') + 14]
            else:
                SITES = 'NA'

            if '천연기념물' in categories:
                NM = True
            else:
                NM = 'NA'

            if '멸종' in categories:
                EL = categories[categories.find('멸종'): categories.find('멸종') + 11]
            else:
                EL = 'NA'

                # print('%s,%s,%s,%s'%(IUCN, SITES, NM, EL))

            if observe_level not in dict_observe_level.keys():
                dict_observe_level[observe_level] = 1
            else:
                dict_observe_level[observe_level] += 1

            if IUCN not in dict_iucn.keys():
                dict_iucn[IUCN] = 1
            else:
                dict_iucn[IUCN] += 1

            if SITES not in dict_sites.keys():
                dict_sites[SITES] = 1
            else:
                dict_sites[SITES] += 1

            if NM not in dict_nm.keys():
                dict_nm[NM] = 1
            else:
                dict_nm[NM] += 1

            if EL not in dict_el.keys():
                dict_el[EL] = 1
            else:
                dict_el[EL] += 1

            if seasonal_spec not in dict_seasonal.keys():
                dict_seasonal[seasonal_spec] = 1
            else:
                dict_seasonal[seasonal_spec] += 1

            d = dict(bid=bid,
                     species_kr=species_kr.strip().split('-')[0].split('[')[0].replace("(가칭)", ""),
                     order_kr=order_kr.strip(),
                     family_kr=family_kr.strip(),
                     species_en=species_en.strip(),
                     order_en=order_en.strip(),
                     family_en=family_en.strip(),
                     species_sn=species_sn.strip(),
                     order_sn=order_sn.strip(),
                     family_sn=family_sn.strip(),
                     observe_level_kr=observe_level,
                     observe_level=_dict_observe_level[observe_level],
                     iucn=_dict_iucn[IUCN],
                     sites=_dict_sites[SITES],
                     nm=NM,
                     el=_dict_el[EL],
                     seasonal_spec=_dict_seasonal[seasonal_spec])
            print(d)
            L.append(d)
            mongo_db_bird.insert_one(d)

mongo_db_bird.create_index([('bid', -1)])