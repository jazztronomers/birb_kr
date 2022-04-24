// MEDIA ITEM 에 대해서 META 정보를 입력하는 컴포넌트
// 메타정보는 X, Y, CAMERA, COMMENT 등을 의미한다
// 진입접: editor submit
// 자기 이미지 우측 위에 아이콘 선택시 (단일 아이템만 지원)


const CONFIRM_CONTINUE="해당 아이템의 정보가 입력되었습니다<br>나머지도 입력하시겠습니까?"

function initMeta(post_id){


    // 화면 RENDERING
    new Meta(document.querySelector('#meta'))
    autocomplete(document.getElementById('meta_update_species'), BIRD.birds_list.map(function(a) {return a.species_kr;}));

    // 하방 MAP 초기화

    x = LOCATION.x
    y = LOCATION.y


    new naverMap(
        target="meta_map",
        x,
        y,
        zoom_level=15,
        zoom_min=8,
        zoom_max=20,
        callback=mapCallback,
        option={
            "create_marker_with_click":true
        }
    )

    // 사용자의 모든을 전역변수 ITEMS로 받아오기
    if (post_id != undefined){
        getItemByPostId(post_id)
    }
    else {
        getItemByUserId()
    }


    // 수평 스크롤 활설화
    const meta_horizotal_item_slide = document.querySelector("#meta_horizotal_item_slide").querySelector(".meta_content");
    meta_horizotal_item_slide.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        meta_horizotal_item_slide.scrollLeft += evt.deltaY;
    });

    const meta_update_species = document.getElementById("meta_update_species")
}

ITEMS = null


function mapCallback(x,y){
    document.getElementById('meta_update_x').value = x
    document.getElementById('meta_update_y').value = y
}

class Meta extends Component {
    setup() {
        this.$state = { items: this.$state };
    }
    template () {

        return `

            <div id="meta_body">
                <div class="item_selector block" id="meta_horizotal_item_slide">
                    <div class="title"><span>Choose your image</span></div>
                    <div class="content meta_content"></div>
                </div>
                <div class="form block" id="meta_form">
                    <div class="title meta_title" id="meta_title"><span>Meta input</span></div>
                    <div class="content meta_content" id="meta_content">

                        <div class='right'>
                            <div class='row'>
                                <label for="meta_update_post_id">게시글 정보</label>
                                <p>
                                    <input type="text" id='meta_update_post_id' placeholder="post_id" disabled style="display:none">
                                    <input type="text" id='meta_update_post_title' placeholder="post_title" disabled>
                                    <input type="text" id='meta_update_item_id' placeholder="item_id" disabled>
                                </p>
                            </div>
                            <div class='row'>
                                <label for="meta_update_publish_timestamp">작성 | 관찰시간</label>
                                <p>
                                    <input type="text" id='meta_update_publish_timestamp' placeholder="publish timestamp" disabled>
                                    <input type="text" id='meta_update_observe_timestamp' placeholder="observe timestamp">
                                </p>
                            </div>
                            <div class='row'>
                                <label for="meta_update_x">관찰경도 | 위도</label>
                                <p>
                                    <input type="text" id='meta_update_x' placeholder="지도위치 클릭시" disabled>
                                    <input type="text" id='meta_update_y' placeholder="값이 입력됨" disabled>
                                </p>
                            </div>
                            <div class='row'>
                                <label for="meta_update_species">종 정보</label>
                                <p class="autocomplete">
                                    <input type="text" id='meta_update_species' autocomplete='off' placeholder="species">
                                    <input type="text" id='meta_update_observe_level' placeholder="희귀도" disabled>
                                </p>
                            </div>
                            <div class='row'>
                                <label for="meta_update_tag">태그</label>
                                <p>
                                    <input type="text" id='meta_update_tag' placeholder="tags">
                                </p>
                            </div>
                            <div class='row'>
                                <label for="meta_update_camera">카메라 | 렌즈</label>
                                <p>
                                    <input type="text" id='meta_update_camera' placeholder="camera">
                                    <input type="text" id='meta_update_lens' placeholder="lens">
                                </p>
                            </div>
                            <div class='row'>
                                <button onclick="setMeta(false)">새사진이 아닙니다, 스킵!</button>
                                <button onclick="setMeta(true)">입력한 정보를 저장합니다</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="meta_map"></div>
            </div>



        `
    }
}



function speciesKrValidation(species_kr){
    for (bird of BIRD.birds_list){
        if (bird.species_kr == species_kr){
            return true
        }
    }

    return false

}

function speciesKrValidationSetMetaObserveLevel(species_kr){


    if (species_kr != undefined){
        // INPUT BIRD IN DICT
        if(BIRD.birds_list.map(function(a) {return a.species_kr;}).includes(species_kr)){
            for (bird of BIRD.birds_list){
                if (bird.species_kr == species_kr){
                    document.getElementById("meta_update_observe_level").value=bird.observe_level
                    return true
                    break
                }
            }
        }
        else if (species_kr.length > 0 ) {
            alert("wrong bird, or not a korean bird")
            document.getElementById("meta_update_species").value=''
            document.getElementById("meta_update_observe_level").value=''

            return false
        }
    }
    // INPUT BIRD NOT IN DICT
}


class MetaItem extends Component {

    setup() {
        this.$state = { items: this.$state };
    }

    template () {

        const { items } = this.$state;

        let html_meta_exists = ''
        let html_meta_not_exists = ''


        for (let item of items){

            if (item.x != undefined && item.species != undefined){
                html_meta_exists += `

                <div class="meta_item">
                    <div class="meta_preview">
                        <a onclick="setItemActive('${item.object_key}')">
                            <img class="image" id="${item.object_key}" src="${item.object_storage_url}">
                        </a>
                    </div>
                </div>


                `
            }

            else {
                html_meta_not_exists += `

                <div class="meta_item">
                    <div class="meta_preview active">
                        <a onclick="setItemActive('${item.object_key}')">

                            <img class="image" id="${item.object_key}" src="${item.object_storage_url}">
                            <div class="image_cover"></div>
                        </a>
                    </div>
                </div>


                `

            }

        }

        let html = html_meta_not_exists + html_meta_exists

        return html
    }

}



function getItemByUserId(){

    // post 를 선택하면 해당 아이템 안에 모든 아이템이 리턴되도록
    // 식별자와 시각화목적 Attribute 만 리턴

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


                ITEMS = req.response.data
                console.log(ITEMS)

                if (ITEMS.length > 0){

                    new MetaItem(document.querySelector('#meta_horizotal_item_slide').querySelector(".meta_content"), ITEMS)
                    setItemActive(ITEMS[0].object_key)
                }
            }
        }
    }

    req.open('POST', '/items/get/user')
    req.setRequestHeader("Content-type", "application/json")
    req.send()
}


// ======================================================
// N O T U S E D Y E T
// ======================================================
function getItemByPostId(post_id){

    // post 를 선택하면 해당 아이템 안에 모든 아이템이 리턴되도록
    // 식별자와 시각화목적 Attribute 만 리턴

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
                ITEMS = req.response.data

                new MetaItem(document.querySelector('#meta_horizotal_item_slide').querySelector(".meta_content"), ITEMS)

                setItemActive(ITEMS[0].object_key)
                autocomplete(document.getElementById('meta_update_species'),
                             BIRD.birds_list.map(function(a) {return a.species_kr;}),
                             speciesKrValidationSetMetaObserveLevel);
            }
        }
    }

    data = JSON.stringify({"post_id":post_id})
    req.open('POST', '/items/get/post')
    req.setRequestHeader("Content-type", "application/json")
    req.send(data)
}

function setItemActive(object_key){

    for (item of ITEMS) {

        if (item.object_key==object_key){


            // HIDDEN
            document.getElementById("meta_update_post_id").value = item.post_id

            // SHOWN
            document.getElementById("meta_update_post_title").value = item.title
            document.getElementById("meta_update_item_id").value = item.item_id
            document.getElementById("meta_update_publish_timestamp").value = item.publish_timestamp
            document.getElementById("meta_update_observe_timestamp").value = item.observe_timestamp
            document.getElementById("meta_update_species").value = ''
            document.getElementById("meta_update_x").value = ''
            document.getElementById("meta_update_y").value = ''

            document.getElementById(item.object_key).style.opacity=1
            document.getElementById(item.object_key).style.borderBottom="1rem solid red";

        }
        else {
            document.getElementById(item.object_key).style.opacity=0.3
            document.getElementById(item.object_key).style.borderBottom="none"
            document.getElementById(item.object_key).style.backgroundColor="black"
        }
    }


}

function validateLatlong(num){

    return parseFloat(num)
}

function setMeta(is_bird=false){

    post_id = document.getElementById("meta_update_post_id").value,
    item_id = document.getElementById("meta_update_item_id").value,
    species = document.getElementById("meta_update_species").value,
    publish_timestamp = document.getElementById("meta_update_publish_timestamp").value,
    observe_timestamp = document.getElementById("meta_update_observe_timestamp").value,
    x = document.getElementById("meta_update_x").value,
    y = document.getElementById("meta_update_y").value,
    camera = document.getElementById("meta_update_camera").value,
    lens = document.getElementById("meta_update_lens").value,
    tag = document.getElementById("meta_update_tag").value,

    // validateHashtag(tag)
    x = validateLatlong(x)
    y = validateLatlong(y)
    // validateTimestamp(publish_timestamp)
    // validateTimestamp(observe_timestamp)

    data = {"meta":
        {
            "post_id": post_id,
            "item_id": item_id,
            "species": species,
            "publish_timestamp": publish_timestamp,
            "observe_timestamp": observe_timestamp,
            "x": x,
            "y": y,
            "camera": camera,
            "lens": lens,
            "tag": tag,
            "is_bird": is_bird
        },
        "post_id":post_id,
        "item_id":item_id
    }




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

                confirm(CONFIRM_CONTINUE,
                        function () {void(0)},
                        function () {window.location='/'}
                )
            }
        }
    }

    data = JSON.stringify(data)
    req.open('POST', '/meta/set')
    req.setRequestHeader("Content-type", "application/json")
    req.send(data)


}





