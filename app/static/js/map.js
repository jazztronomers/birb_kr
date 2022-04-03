// ===============================================
// B A C K E N D
// ===============================================
map = null


function initMap(){

    if (map == null){
        initNaverMap(x=126.8223675, y=37.4859302, zoom_level=15, zoom_min=8, zoom_max=20, "map_naver")
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
                //for (let i = 0; i < raw_data.length; i++) {
                //    console.log(raw_data[i])
                //    if (response_data[i].species_kr in species_dict){
                //        species_dict[response_data[i].species_kr] +=1
                //    }
                //    else {
                //        species_dict[response_data[i].species_kr] =1
                //    }
                //}

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