// MEDIA ITEM 에 대해서 META 정보를 입력하는 컴포넌트
// 메타정보는 X, Y, CAMERA, COMMENT 등을 의미한다
// 진입접: editor submit
// 자기 이미지 우측 위에 아이콘 선택시 (단일 아이템만 지원)

function initMeta(post_id){

    console.log(post_id)
    new Meta(document.querySelector('#meta'))

    initNaverMap(x=126.8231877, y=37.4832059, zoom_level=15, zoom_min=8, zoom_max=20, div_id="meta_map")
    getItemByPostId(post_id)

    const meta_horizotal_item_slide = document.querySelector("#meta_horizotal_item_slide").querySelector(".meta_content");

    meta_horizotal_item_slide.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        meta_horizotal_item_slide.scrollLeft += evt.deltaY;
    });

}

ITEMS = null

class Meta extends Component {
    setup() {
        this.$state = { items: this.$state };
    }
    template () {

        return `


            <div id="meta_body">
                <div id="meta_horizotal_item_slide">
                    <div class="meta_title">IMAGE SELECTOR</div>
                    <div class="meta_content"></div>
                </div>
                <div id="meta_form">
                    <div class="meta_title">IMAGE META EDITOR</div>
                    <div class="meta_content">
                        <div class='left'>
                            <div class="image">
                                <img id="image_to_update"  src="/static/images/bird.png">
                            </div>
                        </div>
                        <div class='right'>
                            <input type="text" id="ac_test" placeholder="species">
                            <input type="text" placeholder="x">
                            <input type="text" placeholder="y">
                            <input type="text" placeholder="camera">
                            <input type="text" placeholder="lens">
                            <input type="text" placeholder="description">
                            <button>save</button>
                        </div>
                    </div>
                </div>
                <div id="meta_map"></div>
            </div>



        `
    }
}

class MetaItem extends Component {

    setup() {
        this.$state = { items: this.$state };
    }

    template () {

        const { items } = this.$state;

        return `
        ${items.map(item => `
            <div class="meta_item">
                <div class="meta_preview">
                    <a onclick="setItemActive('${item.object_key}')">
                        <img class="image" src="${item.object_storage_url}">
                    </a>
                </div>
            </div>
        `).join('')}

        `
    }

}

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
                autocomplete(document.querySelector('#ac_test'), BIRD.birds_list.map(function(a) {return a.species_kr;}));
            }
        }
    }

    data = JSON.stringify({"post_id":post_id})
    req.open('POST', '/getItemByPostId')
    req.setRequestHeader("Content-type", "application/json")
    req.send(data)
}

function setItemActive(object_key){

    for (item of ITEMS) {

        console.log(item.object_key)
        if (item.object_key==object_key){
            document.querySelector("#image_to_update").src=item.object_storage_url
            break;
        }
    }


}



function nextImage(){

}

function prevImage(){

}

function getItemNoLocation(){

}


function setSpecies(){

}

function setLocation(){

}

function setItem(){

}


