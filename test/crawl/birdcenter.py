import requests
import json
import pandas as pd
from bs4 import BeautifulSoup as BS
import os

url = 'https://www.birdcenter.kr/index.php?MenuID=2&mode=tree'  # 한국의 새
response = requests.get(url).content.decode(encoding='utf-8')

soup = BS(response, features="html.parser")
cnt = 0

df = pd.DataFrame(
    columns=['S_ID', 'SPECIES_KR', 'ORDER_KR', 'FAMILY_KR', 'SPECIES_EN', 'ORDER_EN', 'FAMILY_EN', 'SPECIES_SN',
             'ORDER_SN', 'FAMILY_SN'])

for i, ultag in enumerate(soup.find_all('ul', {'class': 'bird_tree'})):

    for line in str(ultag).split('\n'):


        # print(line)
        if str.startswith(line, '<li><span><img alt="icon" src="/images/bird_icon'):
            # print("목|", BS(line).find_all('span')[0].text)
            order_kr, order_sn, order_en = BS(line, features="html.parser").find_all('span')[0].text.split('/')


        elif str.startswith(line, '<li><span><em class="name_kr">'):
            # print("과|", BS(line).find_all('span')[0].text)

            family_kr, family_sn, family_en = BS(line, features="html.parser").find_all('span')[0].text.split('/')

        elif str.startswith(line, '<li><a href="/index.php?MenuID=') or str.startswith(line, '<li class="active"><a href="/index.php?MenuID=2'):
            species_kr, species_sn, species_en = BS(line, features="html.parser").find_all('a')[0].text.split('/')

            href = BS(line, features="html.parser").find_all('a')[0].get('href')
            bid = href.split('=')[-1]
            print(bid, species_kr)
            df.loc[len(df)] = [bid, species_kr, order_kr, family_kr, species_en, order_en, family_en, species_sn,
                               order_sn, family_sn]



df.to_csv('/workspace/jazzbirb_net/app/static/data/constant_bird_name.csv', index=False)

