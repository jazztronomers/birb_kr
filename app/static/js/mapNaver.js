const MARKERS_QUEUE_SIZE = 100

let map = null
let map_mini = null
let markers = []
let infowindows = []
let current_content_id = null
let species_dict = {}
let last_zoom_level = -1
let rectangle = null
let data_source = 'gallery'


const ZOOM_LEVEL_ALLOWED = 12




class naverMap {
    $x;
    $y;
    $zoom_level;
    $zoom_min;
    $zoom_max;
    $target;
    $callback;
    $option;
    constructor ($target, $x, $y, $zoom_level, $zoom_min, $zoom_max, $callback, $option) {

        this.$target=$target;
        this.$zoom_level=$zoom_level;
        this.$zoom_min=$zoom_min;
        this.$zoom_max=$zoom_max;
        this.$callback=$callback;
        this.$option= $option;

        this.$markers = [];
        this.$infowindows = [];

        this.render()
        this.setup()
    }

    render () {
        let map  = new naver.maps.Map(this.$target, {
            center: new naver.maps.LatLng(y, x),
            zoom: this.$zoom_level,  // zoom level
            minZoom: this.$zoom_min, //지도의 최소 줌 레벨
            maxZoom: this.$zoom_max, //지도의 최DA 줌 레벨
            zoomControl: false, //줌 컨트롤의 표시 여부
        });

        this.$map = map

    };


    setup () {

        let map = this.$map
        if (this.$option.create_marker_with_click==true){
            naver.maps.Event.addListener(map, 'click', function(e) {
                var marker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(e.coord.y, e.coord.x),
                    map: map
                });
                callback(e.coord.x, e.coord.y)
                if (markers.length > 0){
                    markers.pop().setMap(null)
                }
                markers.push(marker)
            });
        }
    }

    hideMarker(marker) {
        if (!marker.getMap()) return;
        marker.setMap(null);
    }


    updateMarkers() {

        var mapBounds = this.$map.getBounds();
        var i = this.$markers.length
        while (i--) {
            showMarker(map, marker);
        }
        console.log(' ** markers after update', markers.length)

    }


}




function initNaverMap(x=127.105399, y=37.3595704, zoom_level=15, zoom_min=5, zoom_max=20, div_id="wrapper_map_horizontal", callback=null){
    if (div_id =="wrapper_map_mini"){
        map_mini = new naver.maps.Map(div_id, {
            center: new naver.maps.LatLng(y, x),
            zoom: zoom_level,  // zoom level
            minZoom: zoom_min, //지도의 최소 줌 레벨
            maxZoom: zoom_max, //지도의 최DA 줌 레벨
            zoomControl: false, //줌 컨트롤의 표시 여부

        });

        var polyline = new naver.maps.Polyline({
            map: map_mini,
            path: [],
            strokeColor: '#5347AA',
            strokeWeight: 2
        });

        naver.maps.Event.addListener(map_mini, 'click', function(e) {

            console.log(e.coord.x)
            console.log(e.coord.y)
            console.log(callback)
            callback(e.coord.x, e.coord.y)

        });
        // document.getElementById(div_id).style.position = 'absolute'
    }
    else {

        map = new naver.maps.Map(div_id, {
            center: new naver.maps.LatLng(y, x),
            zoom: zoom_level,  // zoom level
            minZoom: zoom_min, //지도의 최소 줌 레벨
            maxZoom: zoom_max, //지도의 최DA 줌 레벨
            zoomControl: true, //줌 컨트롤의 표시 여부
            zoomControlOptions: { //줌 컨트롤의 옵션
                position: naver.maps.Position.TOP_RIGHT
            }
        });

        naver.maps.Event.addListener(map, 'click', function(e) {
            for (infowindow of infowindows){
                infowindow.close();
            }
        })
    }




    console.log(" ** NAVER MAP INITIALIZED...")

}








function removeObjectsOutsideOfBounds(bounds){

    console.log(' * rawdata before remove', raw_data.length)
    var i = raw_data.length
    while (i--) {
        if (raw_data[i].x < bounds.x_min || raw_data[i].x > bounds.x_max ||
            raw_data[i].y < bounds.y_min || raw_data[i].y > bounds.y_max){

                if (raw_data[i].species != null){
                    for (let j = 0; j < raw_data[i].species.length; j++) {
                        species_dict[raw_data[i].species[j]] -= 1
                    }
                }
                raw_data.splice(i, 1);
            }
    }
    console.log(' * rawdata after remove', raw_data.length)

}




function toggleDataSpecificSpecies(species_id, checked){


    // 현재 클라이언트가 가지고 있는 데이터에서 해당종만 추려서 리스트로 구성
    species = []
    for (const row of raw_data){
        if(row.species.includes(species_id)){
            species.push(row)
        }
    }

    // CHECK
    if (checked){
        showSpecies(species_id)
    }

    // UNCHECK
    else {
        hideSpecies(species_id)
    }
}


function showSpecies(species_id){

    // 너무 많으면 포기
    if (species.length>300){
        alert("선택된 영역에 해당 새 사진이 너무 많습니다, 선택영역을 줄여고 시도해주세요"+ species.length)
        return false
    }

    // 이미 지도에 너무 많이 활성화되있으면 포
    else if (markers.length>300){

        updateMarkers(map, markers)

        if (markers.length>300){
            alert("지도에 활성화된 새 사진이 너무 많습니다, 영역을 좀 줄이세요!"+ markers.length)
            return false
        }

        else{
            showData(species)
        }
    }
    else {
        showData(species)
    }

}

function hideSpecies(species_id, all=false){


    for (infowindow of infowindows){
        infowindow.close();
    }

    let i = markers.length
    while (i--) {
        marker = markers[i]
        if (all==true || marker.species.includes(species_id)){
            hideMarker(map, marker)
            markers.splice(i, 1)
            infowindows.splice(i, 1)
        }
    }
    console.log(" ** markers after uncheck", markers.length)

}


function showData(data) {

    // MAP에 마커 표시
    console.log("showdata..", data)
    //시
    // 체크박스를 여러개 선택하면
    // 맨 먼저 선택한 녀석의 마커는 리스너 체크박스 선택된 개수 만큼 추가됨
    //



    console.log(" ** showData....data length:", data.length)
    console.log(" ** markers before update", markers.length)
    for (let spot_idx in data) {

        spot = data[spot_idx]
        position = new naver.maps.LatLng(spot.y, spot.x);
        marker = new naver.maps.Marker({
            map: map,
            position: position,
            title: spot.content_id,
            zIndex: 100,

            species: spot.species

        });


        contentString = [
        '<div class="naver_map_infowindow">',
        '   <img src="'+spot.object_storage_url+'"/>',
        '</div>'
        ].join('');

        infowindow = new naver.maps.InfoWindow({
            content: contentString,
            title: spot.content_id
        });



        markers.push(marker);
        infowindows.push(infowindow)
        naver.maps.Event.addListener(marker, 'click', getClickHandler(marker, infowindow));

    }


    updateMarkers(map, markers)

}


function updateMarkers(map, markers) {


    var mapBounds = map.getBounds();
    var i = markers.length
    while (i--) {
        showMarker(map, marker);
    }

    console.log(' ** markers after update', markers.length)

}



function showMarker(map, marker) {
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

    ret = {"y_max":northEast.lat(), "y_min":southWest.lat(),
            "x_max":northEast.lng(), "x_min":southWest.lng()}


    return ret

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



function setMapCenter(x, y){

    toggle('map')
    map.panTo(new naver.maps.LatLng(y, x))

}

function setMapZoomLevel(level){
    map.setZoom(level)
}






// 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
function getClickHandler(marker, infowindow) {
    return function(e) {

        console.log(e)

        if (infowindow.getMap() != null) {
            infowindow.close();
        } else {
            infowindow.open(map, marker);
        }

    }
}





