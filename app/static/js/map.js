map = null


const CONFIRM_SEARCH="선택된 종 및 지도상의 마커가 사라집니다<br>계속하시겠습니까?"
const ALERT_AREA_TOO_WIDE="선택된 영역이 너무 넓습니다<br>선택영역을 축소후 다시 시도하세요"
const ALERT_LIMIT_INFO="위치정보가 등록되지 않았거나<br>정보조회가 제한된 상태입니다"

function initMap(){

    if (map == null){
        x = LOCATION.x
        y = LOCATION.y
        initNaverMap(x=x, y=y, zoom_level=15, zoom_min=8, zoom_max=20, "map_naver")
        new ResultTable(document.querySelector("#map_extension_search_result"), [])
    }
}


df = null

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

                raw_data = req.response.data // raw_data is global variable that affect on renderGallery
                species_dict = {}
                console.log(raw_data)

                df = new dfd.DataFrame(raw_data).groupby(["species_kr"])
                summary = []
                for (const [species_kr, dict] of Object.entries(df.colDict)) {
                    summary.push({"species_kr":species_kr,
                                  "species":dict.species[0],
                                  "observe_level":dict.observe_level[0],
                                  "count":dict.observe_level.length,
                                  'object_keys': dict.object_key});
                }


                console.log(summary)

                removeAllChildNodes(document.querySelector("#map_extension_search_result_tbody"))

                if (raw_data.length > 0){
                    new ResultTableRow(document.querySelector("#map_extension_search_result_tbody"), summary)
                }
            }
        }
    }

    data = JSON.stringify({'boudndary_condition':bounds, 'row_per_page':row_per_page})
    req.open('POST', '/items/get/boundary')
    req.setRequestHeader("Content-type", "application/json")
    req.send(data)
}


function searchThisArea(){

    function _searchThisArea(){

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

    console.log(" * search this area...", last_zoom_level)
    let zoom_level = map.getZoom()
    if (zoom_level< ZOOM_LEVEL_ALLOWED) {
        // alert("선택된 영역이 너무 넓습니다, 지도를 조금더 확대하세요! \n현재 줌 레벨: " + zoom_level + "\n허용 줌레벨 범위: > " + ZOOM_LEVEL_ALLOWED)
        alert(ALERT_AREA_TOO_WIDE)
        return false
    }


    else if (last_zoom_level==-1){
        _searchThisArea()
    }

    else {
        confirm(CONFIRM_SEARCH,
            _searchThisArea,  // CONFIRM TRUE CALLBACK
            function () {void(0)} // CONFIRM FALSE CALLBACK
        )
    }


}


function moveToBird(object_key, from){

    toggle("map")
    initMap()
    let data = undefined
    if (from == 'gallery'){
        console.log(" * move to bird from gallery")
        data = raw_data
    }
    else if (from == 'collection'){
        console.log(" * move to bird from collection")
        data = collection_image_data
    }
    else if (from == 'user'){
        console.log(" * move to bird from user")
        data = collection_image_data
    }

    for (bird of data){

        console.log(bird)

        if (bird.object_key == object_key){
            if (bird.x == 0 || bird.x == undefined){
                alert(ALERT_LIMIT_INFO);
            }
            else {
                setMapZoomLevel(15)
                setMapCenter(bird.x, bird.y)
                showData([bird])
            }
            break
        }
    }
    // setMapCenter(bird.x, bird.y)
    // showData([bird])
}



class ResultTable extends Component {

    setup(){
        this.$state = { item: this.$state };
    }

    template () {
        return `
            <table id="map_extension_search_result_table">
                <thead>
                    <tr>
                        <th>Species</th>
                        <th>Observe Level</th>
                        <th>Count</th>
                        <th>View</th>

                    </tr>
                </thead>
                <tbody id="map_extension_search_result_tbody">
                </tbody>
            </table>
        `
    }
}

class ResultTableRow extends Component {

    setup(){
        this.$state = { items: this.$state };
    }

    template () {
        const { items } = this.$state;
        console.log(items)
        console.log(this.$state)



        return `
        ${items.map(item => `
            <tr>
                <td>${item.species_kr}</td>
                <td>${item.observe_level}</td>
                <td>${item.count}</td>
                <td><input type="checkbox" value="${item.species}" onclick="toggleDataSpecificSpecies(this.value, this.checked)"></td>


            </tr>
        `).join('')}
        `
    }
}