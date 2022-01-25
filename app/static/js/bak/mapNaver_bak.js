document.addEventListener("DOMContentLoaded", function(){

    // INIT MAP, SET LISTENER
    initNaverMap(x=37.3595704, y=127.105399, zoom_level=15, zoom_min=13, zoom_max=20)
    // getData();

});


let map = null
let markers_raw = []
let markers = [];
let infoWindows = [];
let MARKERS_QUEUE_SIZE = 100

function initNaverMap(x=37.3595704, y=127.105399, zoom_level=15, zoom_min=5, zoom_max=20){


    map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(x, y),
        zoom: zoom_level,  // zoom level
        minZoom: zoom_min, //지도의 최소 줌 레벨
        maxZoom: zoom_max, //지도의 최DA 줌 레벨
        zoomControl: true, //줌 컨트롤의 표시 여부
        zoomControlOptions: { //줌 컨트롤의 옵션
            position: naver.maps.Position.TOP_RIGHT
        }
    });




    map.addListener('idle', function() {
        bounds = getBounds(map)
        getData(bounds, 'FILTER_KEYWORD')

    });


    bounds = getBounds(map)
    getData(bounds, 'FILTER_KEYWORD')

    naver.maps.onJSContentLoaded = initGeocoder;
    console.log(" ** NAVER MAP INITIALIZED...")
}



// ===============================================
// B A C K E N D
// ===============================================
// CURRENT POSITION
// CURRENT BOUNDARY CONDITION
// SELECTED FILTER
// ORDER BY SEEN YN
// CONTENTS I HAVE IN QUEUE
function getData(bounds, filter) {
    var req = new XMLHttpRequest()
    req.responseType = 'json';
    req.onreadystatechange = function()
    {
        if (req.readyState == 4)
        {
            if (req.status != 200)
            {
                console.log('hello')
            }
            else
            {


                console.log("getData START", req.response.length)
                showData(req.response)
                console.log("getData END", markers.length)
            }
        }
    }


    data = JSON.stringify({'boudndary_condition':bounds,
                            'filter': filter,
                            'content_id_list':getAttributeListFromListOfObject(markers, 'title')});


    req.open('POST', '/getMarker')
    req.setRequestHeader("Content-type", "application/json")
    req.send(data)
}



function getAttributeListFromListOfObject(object, attribute){

    ret = []
    for (let i=0; i<object.length; i++){
        ret.push(object[i][attribute])
    }

    console.log(ret)
    return ret
}

function showData(data) {





    // markers = []
    marker_list_already_have = getAttributeListFromListOfObject(markers, 'title')
    // GENERATE ALL MARKERS
    for (let spot_idx in data) {
        if (!marker_list_already_have.includes(data[spot_idx].content_id)){;

            console.log("+", data[spot_idx].content_id)

            if (markers.length > MARKERS_QUEUE_SIZE){
                temp = markers.shift();

                console.log('-', temp.title)
            }

            spot = data[spot_idx]
            var position = new naver.maps.LatLng(spot.y, spot.x);


            var marker = new naver.maps.Marker({
                map: map,
                position: position,
                title: spot.content_id,
                object_address: spot.object_address,
                // icon: {
                //     url: HOME_PATH +'/img/example/sp_pins_spot_v3.png',
                //    size: new naver.maps.Size(24, 37),
                //    anchor: new naver.maps.Point(12, 37),
                //     origin: new naver.maps.Point(MARKER_SPRITE_POSITION[key][0], MARKER_SPRITE_POSITION[key][1])
                // },
                zIndex: 100
            });


            markers.push(marker);

//            contentString = [
//            '<div class="iw_inner">',
//            '   <h3>'+marker.title+ '</h3>',
//            '   <img src="'+marker.object_address+'" width="300" height="300" alt="서울시청" class="thumb" />',
//            '</div>'
//            ].join('');
//
//
//            var infoWindow = new naver.maps.InfoWindow({
//                // content: '<div style="width:150px;text-align:center;padding:10px;">The Letter is <b>"'+ key.substr(0, 1) +'"</b>.</div>'
//
//                content : contentString
//            });

            //infoWindows.push(infoWindow);

        }

        else {
            console.log("=", data[spot_idx].content_id)
        }
    }

//
//    for (var i=0, ii=markers.length; i<ii; i++) {
//        naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
//    }


}

function showMarker(map, marker) {

    addMarkerInfo(marker)
    if (marker.getMap()) return;
    marker.setMap(map);

}

function hideMarker(map, marker) {


    if (!marker.getMap()) return;
    marker.setMap(null);
}


function getBounds(map) {

    let bounds = map.getBounds(),
        southWest = bounds.getSW(),
        northEast = bounds.getNE()
    return {"y_max":northEast.lat(), "y_min":southWest.lat(), "x_max":northEast.lng(), "x_min":southWest.lng()}

}

function checkDistance() {
    var p1 = new naver.maps.Point(0, 0),
        p2 = new naver.maps.Point(66, 0),
        proj = map.getProjection(),
        c1 = proj.fromOffsetToCoord(p1),
        c2 = proj.fromOffsetToCoord(p2),
        dist1px = proj.getDistance(c1, c2)

    console.log('checkDistance per 65px:', dist1px, 'meter');
}




function updateMarkers(map, markers) {


    var mapBounds = map.getBounds();
    var marker, position;

    for (var i = 0; i < markers.length; i++) {

        marker = markers[i]
        position = marker.getPosition();
        if (mapBounds.hasLatLng(position)) {
            showMarker(map, marker);
        } else {
            hideMarker(map, marker);
        }
    }
}



function addMarkerInfo(marker){



    contentString = [
    '<div class="iw_inner">',
    '   <h3>'+marker.title+ '</h3>',
    '   <img src="'+marker.object_address+'" width="300" height="300" alt="서울시청" class="thumb" />',
    '</div>'
    ].join('');

    infowindow = new naver.maps.InfoWindow({
        content: contentString
    });

    naver.maps.Event.addListener(marker, "click", function(e) {


        if (infowindow.getMap()) {

            console.log("clicked!")
            infowindow.close();
        } else {

            console.log("clicked!")
            infowindow.open(map, marker);
        }
    });

}

// 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
//function getClickHandler(seq) {
//    return function(e) {
//        var marker = markers[seq],
//            infoWindow = infoWindows[seq];
//
//        if (infoWindow.getMap()) {
//            infoWindow.close();
//        } else {
//            infoWindow.open(map, marker);
//        }
//    }
//}






