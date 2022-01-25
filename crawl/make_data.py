import json



locations = []
dataset = []


specis_dict = {

    'HAEORAGI':'https://cdn.chungnamilbo.co.kr/news/photo/202008/557518_154093_5515.jpg',
    'JIKBAK':'http://www.chungnamilbo.com/news/photo/201303/pp_245586_1_1363522270.jpg',

}

def get_location_bulk():

    d = 'static/data/accidentDeath.json'

    with open(d,'r') as f:
        data = json.loads(f.read())
        for spot in data:
            lo = spot.get('grd_lo')
            la = spot.get('grd_la')
            locations.append({"grd_la": la, "grd_lo": lo})

    print(len(locations))


def random_meta(content_id):

    global i

    data = dict(
    content_id = i,
    x = locations[i].get('grd_lo'),   # lo =>
    y = locations[i].get('grd_la'),
    sid = 'J1',
    sname='JIKBAK',
    object_address = 'https://cdn.chungnamilbo.co.kr/news/photo/202008/557518_154093_5515.jpg')


    data = dict(
    content_id = i,
    x = locations[i].get('grd_lo'),   # lo =>
    y = locations[i].get('grd_la'),
    speci_id = 'H1',
    speci_name='HAEORAGI',
    object_address = 'http://www.chungnamilbo.com/news/photo/201303/pp_245586_1_1363522270.jpg')

    i+=1

    return data

if __name__=="__main__":
    get_location_bulk()

    for i in range(4586):
        dataset.append(random_meta(i))

    with open("../db/data/bird.json", 'w') as f:
        json.dump(dataset, f)




