const MARKERS_QUEUE_SIZE = 100

let map = null
let map_mini = null
let markers = []
let infowindows = []
let current_content_id = null
let raw_data = []
let species_dict = {}
let last_zoom_level = -1
let rectangle = null
let data_source = 'gallery'


const ZOOM_LEVEL_ALLOWED = 9


function initNaverMap(x=127.105399, y=37.3595704, zoom_level=15, zoom_min=5, zoom_max=20, div_id="wrapper_map_horizontal"){
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

            var point = e.coord;

            var path = polyline.getPath();
            path.push(point);

            new naver.maps.Marker({
                map: map_mini,
                position: point
            });

        });
        // document.getElementById(div_id).style.position = 'absolute'
    }
    else if (div_id =="wrapper_map_user"){
        map_user = new naver.maps.Map(div_id, {
            center: new naver.maps.LatLng(y, x),
            zoom: zoom_level,  // zoom level
            minZoom: zoom_min, //지도의 최소 줌 레벨
            maxZoom: zoom_max, //지도의 최DA 줌 레벨
            zoomControl: false, //줌 컨트롤의 표시 여부

        });

        naver.maps.Event.addListener(map_user, 'click', function(e) {

            console.log(e.coord.x)
            console.log(e.coord.y)

        });

        console.log(div_id)
        console.log(document.getElementById(div_id).offsetWidth)
        console.log(document.getElementById(div_id).offsetHeight)

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

        // map.panTo(new naver.maps.LatLng(y, x))
        // map.resize()
        console.log(div_id)
        console.log(document.getElementById(div_id).offsetWidth)
        console.log(document.getElementById(div_id).offsetHeight)



    }




    console.log(" ** NAVER MAP INITIALIZED...")

}


function searchThisArea(){

    confirmation = true
    let zoom_level = map.getZoom()
    if (zoom_level< ZOOM_LEVEL_ALLOWED) {
        alert("선택된 영역이 너무 넓습니다, 지도를 조금더 확대하세요! \n현재 줌 레벨: " + zoom_level + "\n허용 줌레벨 범위: > " + ZOOM_LEVEL_ALLOWED)
        return false
    }


    else if (last_zoom_level!=-1){
        confirmation = (confirm("선택된 종 및 지도상의 마커가 사라집니다\n계속하시겠습니까?"))
    }



    if (confirmation){

        hideSpecies('000', all=true)
        bounds = getBounds(map)
        removeObjectsOutsideOfBounds(bounds)
        getBoundaryData(bounds, 3000, 0)

        if (last_zoom_level==-1){
            last_zoom_level=map.getZoom()
            console.log(" ** last_zoom_level you search:", last_zoom_level)
        }


        view = new naver.maps.OverlayView()


        if (rectangle != null){
            rectangle.setMap(null)
        }

        // 박스치기
        rectangle = new naver.maps.Rectangle({
            map: map,
            strokeColor: 'grey',
            strokeWeight: 1,
            bounds: new naver.maps.LatLngBounds(
                new naver.maps.LatLng(bounds.y_min, bounds.x_min),
                new naver.maps.LatLng(bounds.y_max, bounds.x_max),

            )
        });



    }
}


// ===============================================
// B A C K E N D
// ===============================================
function getBoundaryData(bounds, row_per_page, current_page) {
    var req = new XMLHttpRequest()
    req.responseType = 'json';
    req.onreadystatechange = function()
    {
        if (req.readyState == 4)
        {
            if (req.status != 200)
            {
                alert(''+req.status+req.response)
            }
            else
            {

                response_data = req.response.data
                species_dict = {}
                for (let i = 0; i < response_data.length; i++) {
                    console.log(response_data[i])
                    for (let j = 0; j < response_data[i].species.length; j++) {
                        if (response_data[i].species[j] in species_dict){
                            species_dict[response_data[i].species[j]] +=1
                        }
                        else {
                            species_dict[response_data[i].species[j]] = 1
                        }
                    }
                }

                raw_data = response_data
                console.log(' * response data size', response_data.length)
                console.log(' * current raw data size', raw_data.length)
                console.log(' * species dict', species_dict)
                setMapExtensionSpeciesSelector(species_dict)
                renderGallery(clear=true)
            }
        }
    }

    data = JSON.stringify({'boudndary_condition':bounds, 'row_per_page':row_per_page})
    req.open('POST', '/getContentsMeta')
    req.setRequestHeader("Content-type", "application/json")
    req.send(data)
}





function removeObjectsOutsideOfBounds(bounds){


    console.log(' * rawdata before remove', raw_data.length)

    var i = raw_data.length
    while (i--) {


        if (raw_data[i].x < bounds.x_min || raw_data[i].x > bounds.x_max ||
            raw_data[i].y < bounds.y_min || raw_data[i].y > bounds.y_max){

                // 클라이언트단 영역내 종수 데이터 처
                for (let j = 0; j < raw_data[i].species.length; j++) {
                    species_dict[raw_data[i].species[j]] -= 1
                }
                raw_data.splice(i, 1);
            }


    }

    console.log(' * rawdata after remove', raw_data.length)

}



function setMapExtensionSpeciesSelector(data) {


    tbody = document.getElementById("map_extension_search_result_table").getElementsByTagName('tbody')[0]
    removeAllChildNodes(tbody)

    var ordered_species_list = Object.keys(data).map(function(key) {
      return [key, data[key]];
    });


    ordered_species_list.sort(function(first, second) {
      return second[1] - first[1];
    });




    // for (let i=0; i<ordered_species_list.length; i++){

    for (species of ordered_species_list){
        species_kr = species[0]
        species_count = species[1]
        species_id = df_birds.query(df_birds['species_kr'].eq(species_kr)).bid.values[0]
        species_observe_level = df_birds.query(df_birds['species_kr'].eq(species_kr)).observe_level.values[0]

        row = document.createElement("tr")

        cell_a = document.createElement("td")
        cell_b = document.createElement("td")
        cell_c = document.createElement("td")
        cell_d = document.createElement("td")


        input = document.createElement("input");
        input.type = 'checkbox'
        input.value = species_kr
        input.setAttribute('id', 'ckbx_' + species_id)
        input.setAttribute('onclick', 'toggleDataSpecificSpecies(this.value, this.checked)')

        cell_a.appendChild(input)

        species_name = document.createTextNode(species_kr)
        cell_b.appendChild(species_name)

        species_observe_level = document.createTextNode(species_observe_level)
        cell_c.appendChild(species_observe_level)

        species_count = document.createTextNode(species_count)
        cell_d.appendChild(species_count)

        row.appendChild(cell_a)
        row.appendChild(cell_b)
        row.appendChild(cell_c)
        row.appendChild(cell_d)

        tbody.appendChild(row)

    }

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

    let i = markers.length
    while (i--) {
        marker = markers[i]
        if (marker.species.includes(species_id) || all==true){
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
        '<div class="iw_inner">',
        '' + spot.x + ',' + spot.y,
        '   <img src="'+spot.object_storage_url+'" width="300" height="300" alt="서울시청" class="thumb" />',
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



//    for (var i=0; i<markers.length; i++) {
//        naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
//    }
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


function moveToBird(bird){


    setMapCenter(bird.x, bird.y)
    // setMapZoomLevel(18)
    showData([bird])
}

function setMapCenter(x, y){

    console.log("set map center!")

    let map_div = document.getElementById(wrapper_map_id)

    if (map_div.style.display =='none'){
        toggleMap(true)
    }


    console.log(document.getElementById("wrapper_map_horizontal").offsetWidth)
    console.log(document.getElementById("wrapper_map_horizontal").offsetHeight)
    map.panTo(new naver.maps.LatLng(y, x))


}

function setMapZoomLevel(level){
    map.setZoom(level)
}






// 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
function getClickHandler(marker, infowindow) {
    return function(e) {

        if (infowindow.getMap() != null) {
            infowindow.close();
        } else {
            infowindow.open(map, marker);
        }

    }
}


