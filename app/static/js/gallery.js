const GALLERY_BATCH_SIZE = 5      // FOR RENDERING
const GALLERY_ROW_PER_PAGE = 10   // GET IMAGE FROM SERVER PER REQUEST
const RARE_SPECIES_ALERT = "희귀종 위치정보 공개정책 수립중입니다 :)"
let gallery_api_idle = true
let gallery_has_next = true
let scroll_has_next = true
let last_batch = []
function initGallery(items){
    console.log('init gallery', items)
    new Gallery(document.querySelector('#gallery_items'), raw_data)

}


function appendItem(items){
    console.log('append_item', items)
    new Gallery(document.querySelector('#gallery_items'), items)
}

function getGalleryData(row_per_page, current_page, species=[], months=[], callback=null) {

    if (gallery_api_idle == true){
        gallery_api_idle = false
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

                    last_batch = req.response.data

                    gallery_has_next = req.response.has_next
                    raw_data = raw_data.concat(last_batch)
                    console.log(' * gallery has next', gallery_has_next)
                    console.log(' * response data size', last_batch.length)
                    console.log(' * current raw data size', raw_data.length)
                    console.log(' * species dict', species_dict)
                    gallery_api_idle = true

                    if(callback!=null){
                        callback(last_batch)
                    }
                }
            }
        }

        data = JSON.stringify({'species':species, "months": months, 'row_per_page':row_per_page, 'current_page':current_page})
        req.open('POST', '/items/get/gallery')
        req.setRequestHeader("Content-type", "application/json")
        req.send(data)
    }
}




class Gallery extends Component {

    setup() {
        this.$state = { items: this.$state };
    }

    template () {

        const { items } = this.$state;

        let i=0
        let html = ''
        console.log(items.length)

        for (let item of items){

            html+=`
            <div class="content">
                <img class="image" src="${item.object_storage_url}">
                <div class="meta">

                    <div class="top-left" style='display:none'>TOP-LEFT</div>
                    <div class="top-right">
                        <span><a onclick="showImageInformation(this.parentElement.parentElement.parentElement, '${item.object_key}')"><i class="icon_info fi fi-rr-info"></i></a></span>
                        <span><a onclick="moveToBird('${item.object_key}')"><i class="icon_info fi fi-rr-map-marker"></i></a></span>
                    </div>
                    <div class="bottom-left" style='display:none'>BOTTOM-LEFT</div>
                    <div class="bottom-right">
                        <span><a onclick="goToPost('${item.post_id}')"><i class="icon_info fi fi-rr-document"></i></a></span>
                        <span><a onclick="confirmation_test()"><i class="icon_info fi fi-rr-document"></i></a></span>
                        <span><a onclick="alert_test()"><i class="icon_info fi fi-rr-document"></i></a></span>
                    </div>
                </div>
            </div>
            `
            i+=1
            if (i%5==0){
                html += getAdHorizontalGallery()
            }
        }

//        `
//        ${items.map(item => `
//            <div class="content">
//                <img class="image" src="${item.object_storage_url}">
//                <div class="meta">
//
//                    <div class="top-left" style='display:none'>TOP-LEFT</div>
//                    <div class="top-right">
//                        <span><a onclick="showImageInformation(this.parentElement.parentElement.parentElement, '${item.object_key}')"><i class="icon_info fi fi-rr-info"></i></a></span>
//                        <span><a onclick="moveToBird('${item.object_key}')"><i class="icon_info fi fi-rr-map-marker"></i></a></span>
//                    </div>
//                    <div class="bottom-left" style='display:none'>BOTTOM-LEFT</div>
//                    <div class="bottom-right">
//                        <span><a onclick="goToPost('${item.post_id}')"><i class="icon_info fi fi-rr-document"></i></a></span>
//                        <span><a onclick="confirmation_test()"><i class="icon_info fi fi-rr-document"></i></a></span>
//                        <span><a onclick="alert_test()"><i class="icon_info fi fi-rr-document"></i></a></span>
//                    </div>
//                </div>
//            </div>
//
//        `).join('')}
//
//        `


        return html
    }

}

function goToPost(post_id){
    toggle('post', post_id, false, null)
}
function alert_test(){
    alert("test")
}


function confirmation_test(){

    confirm("test",
            function () {console.log("sss true")},
            function () {console.log("sss false")}
    )


}

function showImageInformation(meta_element, object_key){

    bottom_left = meta_element.querySelector(".bottom-left")

    if (bottom_left.style.display=='none'){

        information = ''
        for (item of raw_data){
            if (item.object_key == object_key){

                information += `# 원글: <a onclick="toggle('post', '${item.post_id}')">${item.title}</a><br>`
                information += `# 관찰일자: ${item.observe_timestamp}<br>`
                information += `# 작성일자: ${item.publish_timestamp}<br>`
                information += `# 작성자: ${item.user_id}<br>`
                information += `# 종명: ${item.species_kr}<br>`
                information += `# 희귀도: ${item.observe_level}<br>`
                if (item.x == 0){
                    information += `# 좌표: ${RARE_SPECIES_ALERT}<br>`
                }
                else {
                    information += `# 좌표: ${item.x}, ${item.y}<br>`
                }
                break;
            }
        }
        bottom_left.style.display= 'block'
        bottom_left.innerHTML=information
    }

    else {
        bottom_left.style.display= 'none'
    }
}


