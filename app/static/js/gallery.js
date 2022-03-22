const GALLERY_BATCH_SIZE = 5      // FOR RENDERING
const GALLERY_ROW_PER_PAGE = 10   // GET IMAGE FROM SERVER PER REQUEST
let gallery_api_idle = true

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

                    response_data = req.response.data
                    raw_data = raw_data.concat(response_data)
                    console.log(' * response data size', response_data.length)
                    console.log(' * current raw data size', raw_data.length)
                    console.log(' * species dict', species_dict)
                    gallery_api_idle = true
                    console.log(callback)
                    if(callback!=null){
                        callback()
                    }
                }
            }
        }

        data = JSON.stringify({'species':species, "months": months, 'row_per_page':row_per_page, 'current_page':current_page})
        req.open('POST', '/getContentsMeta')
        req.setRequestHeader("Content-type", "application/json")
        req.send(data)
    }
}


function renderGallery(clear=false){


    console.log('renderGallery!')
    // raw_data 에서 차례대로 데이터를 꺼내서 N장씩 붙여주는 함수
    column = document.getElementById("column")
    if (clear){
        removeAllChildNodes(column)
    }


    if (raw_data.length > 0){

        current_item_cnt = column.children.length
        tobe_item_cnt = column.children.length + GALLERY_BATCH_SIZE

        for (let i=current_item_cnt; i< tobe_item_cnt; i++){
            console.log(i,raw_data[i])
            html = makeGalleryContent(raw_data[i])
            column.appendChild(html)

        }
    }
    else {

        out_of_data = document.createElement("div")
        out_of_data.innerHTML = "데이터가 없습니다 ㅠㅠ"
        alert(column.children.length)
        column.appendChild(out_of_data)

    }
}


function makeGalleryContent(image){

//    <div class="content">
//        <img class="image" src="https://jazzbirb-bird.s3.ap-northeast-2.amazonaws.com/0080_001.jpg">
//        <div class="meta">
//            <div class="top-right">
//                <span><a href="#" onclick="setImageInfo()"><i class="icon_info fi fi-rr-info"></i></a></span>
//                <span><a href="#" onclick="setMapCenter(126.534361, 33.3590628)"><i class="icon_info fi fi-rr-map-marker"></i></a></span>
//            </div>
//            <div class="bottom-right">
//                <span><a href="#" onclick="setImageInfo()"><i class="icon_info fi fi-rr-info"></i></a></span>
//                <span><a href="#" onclick="setImageInfo()"><i class="icon_info fi fi-rr-info"></i></a></span>
//            </div>
//        </div>
//    </div>



    content = document.createElement("div")
    content.setAttribute("class", "content")

    img = document.createElement("img")
    img.setAttribute("class", 'image')
    img.setAttribute("src", image.object_storage_url)

    meta = document.createElement("div")
    meta.setAttribute("class", "meta")


    top_right_div = document.createElement("div")
    top_right_div.setAttribute("class", "top-right")

    i_a = document.createElement("i")
    i_a.setAttribute("class", "icon_info fi fi-rr-map-marker")

    a_a = document.createElement("a")
    a_a.value = image
    a_a.setAttribute("onclick", "moveToBird(this.value)")
    a_a.appendChild(i_a)


    span_a = document.createElement("span")
    span_a.appendChild(a_a)

    i_b = document.createElement("i")
    i_b.setAttribute("class", "icon_info fi fi-rr-map-marker")

    a_b = document.createElement("a")
    a_b.value = image
    a_b.setAttribute("onclick", "moveToBird(this.value)")
    a_b.appendChild(i_b)

    span_a = document.createElement("span")
    span_a.appendChild(a_a)

    span_b = document.createElement("span")
    span_b.appendChild(a_b)

    top_right_div.appendChild(span_a)
    top_right_div.appendChild(span_b)

    meta.appendChild(top_right_div)

    content.appendChild(img)
    content.appendChild(meta)

    // bottom-right-div = document.createElement("div")

    return content

}
