let TAB = [
    {"name":"gallery", "display": "flex"},
    {"name":"post", "display": "block"},
    {"name":"collection", "display": "block"},
    {"name":"map", "display": "flex"}
]


const USER_GALLERY_ROW_PER_PAGE = 10   // GET IMAGE FROM SERVER PER REQUEST
const USER_BOARD_ROW_PER_PAGE = 30

let user_current_tab = "gallery"

map_user=null
user_init = false

let user_board_api_idle = true
let user_board_has_next = true
let user_board_scroll_has_next = true
let user_board_data = []
let user_board_last_batch = []

let user_gallery_api_idle = true
let user_gallery_has_next = true
let user_gallery_scroll_has_next = true
let user_gallery_data = []
let user_gallery_last_batch = []


function initUser(user_id){



    if (user_init==false || user_init!=user_id){
        console.log(user_id)
        if (user_init!=user_id){

            user_gallery=[]
        }

        removeAllChildNodes(document.querySelector('#user_header'))
        removeAllChildNodes(document.querySelector('#user_body_header'))
        removeAllChildNodes(document.querySelector('#user_body_content'))


        // GET USER INFORMATION AND RENDER HEADER
        new UserInformation(user_id)

        // 틀만 잡고

        new UserBodyHeader(document.querySelector('#user_body_header'));
        new UserBodyContent(document.querySelector('#user_body_content'))


        // 데이터 받아오고 틀은 나중에 => PUB SUB 형태로 코드수정 한번 해보자
        getUserGalleryData(USER_GALLERY_ROW_PER_PAGE, 1, user_id, renderUserGallery)

        new UserBodyContentMap(document.querySelector('#user_body_content_map'))
        new UserBodyContentPost(document.querySelector('#user_body_content_post'))
        new UserBodyContentCollection(document.querySelector('#user_body_content_collection'))




        user_init=user_id
        toggleTab(document.getElementById('user_body_content_gallery'), 'user_body_content')
    }
}



function renderUserGallery(last_batch){
    console.log(last_batch)
    new UserBodyContentGallery(document.querySelector('#user_body_content_gallery'), last_batch)
}


// =======================================================================
// T E M P L A T E
// =======================================================================


class UserInformation {
    $user_id;
    constructor ($user_id){
        this.$user_id = $user_id
        this.get()
    }
    // GET DATA FROM BAKCEND
    get (){

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

                    let profile = req.response.data.profile
                    new UserHeader(document.querySelector('#user_header'), profile);
                }
            }
        }


        let data = JSON.stringify({'user_id': this.$user_id})
        console.log(data)
        req.open('POST', '/api/user/profile/get')
        req.setRequestHeader("Content-type", "application/json")
        req.send(data)


    }
    //
    set (){
        new UserHeader(document.querySelector('#user_header'), {});
    }

}



class UserHeader extends Component {

    setup(){
        this.$profile = this.$state
    }

    template () {



        const profile = this.$profile

        return `
            <div id="user_header_left">
                <img id="user_photo" src="https://cdn.pixabay.com/photo/2019/07/16/14/50/egrets-4342083_960_720.jpg">
            </div>
            <div id="user_header_right">
                <div class="profile_row">
                    <div class="profile_label">username</div>
                    <div class="profile_value">${profile.user_name}</div>
                </div>
                <div class="profile_row">
                    <div class="profile_label">posts</div>
                    <div class="profile_value">${profile.count_post}</div>
                </div>
                <div class="profile_row">
                    <div class="profile_label">media</div>
                    <div class="profile_value">${profile.count_item}</div>
                </div>
                <div class="profile_row">
                    <div class="profile_label" >instagram</div>
                    <div class="profile_value input" name="instagram">${profile.instagram}</div><a onclick="profileInputActive(this)"><i class="fi fi-rr-pencil"></i></a>
                </div>
                <div class="profile_row">
                    <div class="profile_label">sites</div>
                    <div class="profile_value input" name="sites">${profile.sites}</div><a onclick="profileInputActive(this)"><i class="fi fi-rr-pencil"></i></a>
                </div>
                <div class="profile_row">
                    <div class="profile_label">camera</div>
                    <div class="profile_value input" name="camera">${profile.camera}</div><a onclick="profileInputActive(this)"><i class="fi fi-rr-pencil"></i></a>
                </div>
                <div class="profile_row">
                    <div class="profile_label">lens</div>
                    <div class="profile_value input" name="lens">${profile.lens}</div><a onclick="profileInputActive(this)"><i class="fi fi-rr-pencil"></i></a>
                </div>
            </div>
        `
    }
}

class UserBodyHeader extends Component {

    setup(){
        this.$state = { items:TAB }
    }

    template () {
        const { items } = this.$state;

        return `
            ${items.map(item => `<span class="tab_title" onclick="toggleTab(this, 'user_body_content')" name='${item.name}'>${item.name}</span>`).join('')}
        `
    }
}

class UserBodyContent extends Component {
    setup(){
        this.$state = { items:TAB }
    }
    template () {
        const { items } = this.$state;

        return `
            ${items.map(item => `<div class="user_body_content tab_content" id="user_body_content_${item.name}" name="${item.name}" style="display: none"></div>`).join('')}
        `
    }
}

class UserBodyContentMap extends Component {
    setup() {
    }
    template () {
        return `
            <div id="wrapper_map_user"></div>
        `
    }
}

class UserBodyContentGallery extends ComponentAppend {
    setup() {
        this.$state = { items:this.$state  }
    }
    template () {
        const { items } = this.$state;

        let html = ''
        for (let item of items){

            html += `
                <div class="grid image_wrapper row">
                    <div class="grid_image">
                        <a onclick="alert('hello')"><img src="${item.object_storage_url}" class="post_grid"></a>
                    </div>
                    <div onclick="alert('hello')" class="meta">
                        <div class="top-left" style='display:none'>TOP-LEFT</div>
                        <div class="top-right">
                            <span><a onclick="showImageInformation(this.parentElement.parentElement.parentElement, '${item.object_key}')"><i class="icon_info fi fi-rr-info"></i></a></span>
                            <span><a onclick="goToPost('${item.post_id}')"><i class="icon_info fi fi-rr-search-alt"></i></a></span>
                            <span><a onclick="moveToBird('${item.object_key}', 'collection')"><i class="icon_info fi fi-rr-map-marker"></i></a></span>
                        </div>
                        <div class="bottom-left" style='display:none'>BOTTOM-LEFT</div>
                        <div class="bottom-right" style='display:none'>BOTTOM-RIGHT</div>
                    </div>
                </div>
            `

        }

        return html
    }
}


class UserBodyContentPost extends Component {
    setup() {
        this.$state = { items:[] }
    }
    template () {
        return `
            Post
        `
    }
}
class UserBodyContentCollection extends Component {
    setup() {
        this.$state = { items:BIRD.birds_list }
    }
    template () {

        const { items } = this.$state;


        return `
        <table id="table_collection">
        <thead>
            <tr>
                <th>목</th>
                <th>속</th>
                <th>종</th>
                <th>관찰빈도</th>
                <th>2020</th>
                <th>2021</th>
                <th>2022</th>
            </tr>
        </thead>
        <tbody>
            ${items.map(item => `<tr>
                                    <td>${item.order_kr}</th>
                                    <td>${item.family_kr}</th>
                                    <td>${item.species_kr}</th>
                                    <td>${item.observe_level}</th>
                                    <td><input type='checkbox'></th>
                                    <td><input type='checkbox'></th>
                                    <td><input type='checkbox'></th>
                                </tr>`).join('')}
        </tbody>
        </table>


        `
    }
}

function profileInputActive(row){


    elm = row.parentElement.querySelector(".profile_value.input")

    // IDENTIFIER
    key = elm.getAttribute("name")
    value = elm.innerHTML


    elm.innerHTML = ''
    input = document.createElement("input")
    input.value = value

    button = document.createElement("button")
    button.innerHTML = 'save'
    elm.appendChild(input)
    elm.appendChild(button)

    console.log(key, value)




}


function getUserData(user_id){


}

function getUserGalleryData(row_per_page, current_page, user_id, callback=null){

    if (user_gallery_api_idle == true){
        user_gallery_api_idle = false
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

                    user_gallery_last_batch = req.response.data
                    user_gallery_has_next = req.response.has_next
                    user_gallery_data = user_gallery_data.concat(user_gallery_last_batch)

                    console.log(' * user_gallery has next', user_gallery_has_next)
                    console.log(' * user_gallery data size', user_gallery_last_batch.length)
                    console.log(' * current user_gallery data size', user_gallery_data.length)


                    user_gallery_api_idle = true

                    if(callback!=null){
                        callback(user_gallery_last_batch)
                    }



                }
            }
        }

        data = JSON.stringify({"user_id": user_id, 'row_per_page':row_per_page, 'current_page':current_page})
        req.open('POST', '/items/get/user')
        req.setRequestHeader("Content-type", "application/json")
        req.send(data)
    }


}

function getPostUser(user_id){

}

function getCollectionUser(user_id){


}

function getMapUser(user_id){

    // KOREA CENTER
    x=127.7473583
    y=36.6915063
    map_user = initNaverMap(x=x, y=y, zoom_level=8, zoom_min=7, zoom_max=11, div_id='wrapper_map_user')

}

function toggleTab(tab_to_show, tab_class_name){

    for (let tab of document.getElementsByClassName(tab_class_name)){
        if (tab.getAttribute('name') == tab_to_show.getAttribute('name')){

            for (let _ of TAB){

                tab.style.display= _.display
                break;
            }
            if(tab.getAttribute('name')=='map'){

                getMapUser('abc')

            }
        }
        else {
            tab.style.display='none'
        }
    }
}
