let TAB = [
    {"name":"gallery", "display": "flex"},
    {"name":"post", "display": "block"},
    {"name":"collection", "display": "block"},
    {"name":"map", "display": "flex"}
]



map_user=null
user_init = false
user_gallery=[]
function initUser(user_id){

    if (user_init==false || user_init!=user_id){

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
        getGalleryUser(30, 1, user_id)

        new UserBodyContentMap(document.querySelector('#user_body_content_map'))
        new UserBodyContentPost(document.querySelector('#user_body_content_post'))
        new UserBodyContentCollection(document.querySelector('#user_body_content_collection'))

        $('#table_collection').DataTable( {
            aaSorting: [],
                    // stateSave:true,
                    // sScrollX:"100%",
                    autoWidth:true,
                    autoHeight:false,
                    aLengthMenu: [ 15, 30 ],
                    iDisplayLength: 15,
                    scrollCollapse: true,

        } );



        user_init=user_id
        toggleTab(document.getElementById('user_body_content_gallery'), 'user_body_content')
    }
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
                    console.log(this)
                    console.log(this.parent)
                    console.log(req.response.data)
                    // set();
                    new UserHeader(document.querySelector('#user_header'), {});
                }
            }
        }

        console.log(this)
        console.log(this.parent)
        let data = JSON.stringify({'user_id': this.$user_id})
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
        this.$state = { items:TAB }
    }

    template () {



        const { items } = this.$state;
        console.log(items)

        return `
            <div id="user_header_left">
                <img id="user_photo" src="https://cdn.pixabay.com/photo/2019/07/16/14/50/egrets-4342083_960_720.jpg">
            </div>
            <div id="user_header_right">
                <div class="profile_row">
                    <div class="profile_label">nickname</div>
                    <div class="profile_value">jazz</div>
                </div>
                <div class="profile_row">
                    <div class="profile_label">contents</div>
                    <div class="profile_value">100</div>
                </div>
                <div class="profile_row">
                    <div class="profile_label">posts</div>
                    <div class="profile_value">100</div>
                </div>
                <div class="profile_row">
                    <div class="profile_label">instagram</div>
                    <div class="profile_value">100</div>
                </div>
                <div class="profile_row">
                    <div class="profile_label">introduction</div>
                    <div class="profile_value">birb birb</div>
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

class UserBodyContentGallery extends Component {
    setup() {
        this.$state = { items:user_gallery }
    }
    template () {
        const { items } = this.$state;
        return `
            ${items.map(item => `

                <div class="grid">
                    <div class="grid_image">
                        <a onclick="alert('hello')"><img src="${item.object_storage_url}" class="post_grid"></a>
                    </div>
                </div>

            `).join('')}
            <div style="width:100%; height:300px"><h3>END<h3></div>
        `
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
        console.log(items)

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

function getUserData(user_id){


}

function getGalleryUser(row_per_page, current_page, user_id, callback=null){

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
                    user_gallery = user_gallery.concat(response_data)
                    console.log(' * response data size', response_data.length)
                    gallery_api_idle = true
                    console.log(callback)
                    if(callback!=null){
                        callback()
                    }


                    new UserBodyContentGallery(document.querySelector('#user_body_content_gallery'), user_gallery)
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
