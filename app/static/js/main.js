document.addEventListener("DOMContentLoaded", function(){


    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });

    window.addEventListener("popstate", () => {

          console.log("url changed", location.href)
          toggle(location.href.toString().split(window.location.host)[1].split('/')[1], true)

    });

    getGallaryData(row_per_page=15, current_page=0, species=[], month=[])

    // WEB(HORIZONTAL)

    column_container = document.getElementById('gallery');
    column_container.addEventListener('scroll',()=>{

        clientHeight = document.documentElement.clientHeight
        scrollHeight = column_container.scrollHeight;
        scrollTop = column_container.scrollTop;

        if(scrollTop + clientHeight > scrollHeight - 20){

            createPost(1, column_container)

        }
    });

    toggle(route, route_params)

    wrapper_main = document.getElementById("wrapper_main")
    canvas_width = wrapper_main.offsetWidth


    getBirds()
    initPost()
    showSlides(1);
    // MOBILE(VERTICAL)
    app = document.querySelector('#user_body_header')

    new UserBodyHeader(document.querySelector('#user_body_header'));
    new UserBodyContent(document.querySelector('#user_body_content'))
});


let CLIENT_WIDTH = window.innerWidth
let GALLERY_BATCH_SIZE = 5
let current_page = "others"
let display_mode = (window.innerWidth / window.innerHeight) > 1 ? 'horizontal' : 'vertical'
let wrapper_map_id = (window.innerWidth / window.innerHeight) > 1 ? 'wrapper_map_horizontal' : 'wrapper_map_vertical'

function success(pos) {
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}




function initPost(){
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {

            console.log("how")
            post_slide_container = document.getElementById("post_slide_container")
            slides = post_slide_container.querySelectorAll('.slide')

            for (let i=0; i<slides.length; i++){
                post_slide_container.removeChild(slides[i])
            }

            slides = document.getElementById("slides")
            post_slide_container.appendChild(slides)

            for (let i=0; i<this.files.length; i++){

                if (this.files[i].type.includes("image")){

                    slide = document.createElement("div")
                    slide.setAttribute("class", "slide")

                    slide_image = document.createElement("div")
                    slide_image.setAttribute("class", "slide_image")



                    // slide_image_message.appendChild(message)

                    img = document.createElement("img")
                    img.setAttribute("class", "img_to_upload")
                    img.src = URL.createObjectURL(this.files[i]); // set src to blob url
                    slide_image.appendChild(img)

                    slide_meta = document.createElement("div")
                    slide_meta.setAttribute("class", "slide_meta")

                    meta_table = document.createElement("table")
                    meta_table.setAttribute("class", "meta_table")
                    meta_table.appendChild(trMaker("observe date", "image_meta_datetime_original", "text", "관찰시각(YYYY-MM-DD)"))
                    meta_table.appendChild(trMaker("model-camera", "image_meta_camera_model", "text", "카메라 모델"))
                    meta_table.appendChild(trMaker("model-lens", "image_meta_lens_model", "text", "렌즈 모델"))
                    meta_table.appendChild(trMaker("logitude", "image_meta_longitude", "text", "관찰위치 - 경도"))
                    meta_table.appendChild(trMaker("latitude", "image_meta_latitude", "text", "관찰위치 - 위도"))
                    meta_table.appendChild(trMaker("species", "image_meta_species", "text", "종명"))
                    slide_meta.appendChild(meta_table)

                    slide.appendChild(slide_image)
                    slide.appendChild(slide_meta)
                    // slide.appendChild(slide_image_message)

                    slides.appendChild(slide)
                    cropper = getCropper(img)
                    img.setAttribute("cropper", cropper)

//                    span = document.createElement("span")
//                    span.setAttribute("class", "dot")
//                    span.setAttribute("onclick", "currentSlide("+i+1+")")
//                    page_here.appendChild(span)



                }

                else if (this.files[i].type.includes("video")){


                    video = document.createElement("video")
                    video.style.width = "100%"
                    source = document.createElement("source")
                    source.src = URL.createObjectURL(this.files[i]);
                    source.type = this.files[i].type
                    video.appendChild(source)
                    div.appendChild(video)
                    image_here.appendChild(div)
                    console.log(div)

                    span = document.createElement("span")
                    span.setAttribute("class", "dot")
                    span.setAttribute("onclick", "currentSlide("+i+1+")")
                    page_here.appendChild(span)

                }



            }

            showSlides(1);
            species = df_birds.species_kr.values

            input_species = document.getElementsByClassName("image_meta_species")
            for (let i=0; i<input_species.length; i++){
                autocomplete(input_species[i], species);
            }
            getExif()

            console.log("end")
          }
    });



}


function getCropper(img){
    return new Cropper(img, {
    minContainerWidth: canvas_width,
    minContainerHeight: canvas_width,
    minCanvasWidth: canvas_width,
    minCanvasHeight: canvas_width,
    minCropBoxWidth: 300,
    minCropBoxHeight: 300,
    viewmode: 3,
    dragMode: 'move',
    aspectRatio: 1,
    autoCropArea: 0.9,
    restore: false,
    guides: false,
    center: false,
    highlight: false,
    cropBoxMovable: false,
    cropBoxResizable: false,
    toggleDragModeOnDblclick: false,
    modal: true,
    background: false,
//    crop(event) {
//
//    },
    });
}

function getExif() {

    var imgs = document.getElementsByClassName("img_to_upload");
    var observe_timestamp = document.getElementsByClassName("image_meta_datetime_original");
    var model = document.getElementsByClassName("image_meta_camera_model");
    var lens_model = document.getElementsByClassName("image_meta_lens_model");


    console.log("getExif", imgs.length)

    for (let i=0; i< imgs.length; i++){

        _getExif(imgs[i], observe_timestamp[i], model[i], lens_model[i])

    }

}


async function _getExif(img, observe_timestamp, model, lens_model) {

    function get_date_str(date)
    {
        var sYear = date.getFullYear();
        var sMonth = date.getMonth() + 1;
        var sDate = date.getDate();
        var hour    = date.getHours();
        var minute  = date.getMinutes();
        var seconds = date.getSeconds();

        sMonth = sMonth > 9 ? sMonth : "0" + sMonth;
        sDate  = sDate > 9 ? sDate : "0" + sDate;
        hour = hour > 9 ? hour : "0" + hour;
        minute = minute > 9 ? minute : "0" + minute;
        seconds = seconds > 9 ? seconds : "0" +seconds;

        return sYear + '-' + sMonth + '-' + sDate + ' ' + hour + ":"+ minute + ":" + seconds
    }




    let output = await exifr.parse(img)

    if (output != undefined){

        observe_timestamp.value = get_date_str(output.DateTimeOriginal)
        model.value = output.Model
        lens_model.value = output.LensModel

    }



}

function trMaker(label, class_name, input_type, placeholder){


    row = document.createElement("tr")

    cell_label = document.createElement("td")
    cell_label.innerHTML = label

    cell_value = document.createElement("td")


    autocomplete_div = document.createElement("div")
    autocomplete_div.setAttribute("class", "autocomplete")

    input = document.createElement("input")
    input.type = 'text'
    input.setAttribute("class", class_name)
    input.setAttribute("placeholder", placeholder)

    autocomplete_div.appendChild(input)
    cell_value.appendChild(autocomplete_div)

    row.appendChild(cell_label)
    row.appendChild(cell_value)

    return row


}



function reportWindowSize() {

  console.log(window.innerWidth)
  CLIENT_WIDTH = window.innerWidth

}

window.onresize = reportWindowSize;



function toggle(to, param=null, backward=false){


    console.log('toggle..', to, param)

    event.preventDefault();
    // console.log("toggle event:", event)


    let map_div = document.getElementById(wrapper_map_id)
    let map_extension = document.getElementById("wrapper_map_extension")

    if (['post'].includes(current_page)){
        confirmation = confirm("작성중인 내용이 모두 지워집니다, 계속 하시겠습니까?")
        if (!confirmation){
            return false
        }
    }

    //
    if (! backward){

        if (param!= null){
            path = to + '/' + param
        }
        else {
            path = to
        }
        window.history.pushState(
            {},
            "/"+path,
            window.location.origin + "/" + path
        );
    }


    if (display_mode=='vertical'){
        map_div.style.display="none"
        map_extension.style.display="none"
    }


    clearPost()
    current_page = "others"

    if (to=="root"){
        document.location.href="/";
    }

    panes = document.getElementsByClassName('pane')

    for (let i=0; i<panes.length; i++){

        panes[i].style.display='none'

    }

    input_div = document.getElementById(to)
    if (input_div) input_div.style.display='flex'

}


function dropdownUser(){

    dropdown_user = document.getElementById("dropdown_user")
    if (dropdown_user.style.display=="none" || dropdown_user.style.display=="" ){
        dropdown_user.style.display='flex'
        dropdown_user.style.flexDirection='column'
    }
    else {
        dropdown_user.style.display='none'
    }
}


function toggleMap(confirm=true){



    event.preventDefault();
    if (confirm == false){
        if (['post'].includes(current_page)){
            confirmation = confirm("작성중인 내용이 모두 지워집니다, 계속 하시겠습니까?")
            if (!confirmation){
                return false
            }
        }
    }

    clearPost()

    current_page = "others"

    let main = document.getElementById("wrapper_main")
    let map_div = document.getElementById(wrapper_map_id)
    let map_extension = document.getElementById("wrapper_map_extension")


    if (map == null){
        initNaverMap(x=37.4832059, y=126.8231877, zoom_level=15, zoom_min=8, zoom_max=20, wrapper_map_id)
    }



    // HORIZONTAL (DESKTOP)

    if (display_mode=='horizontal'){
        if (map_div.style.display =='none'){
            main.style.width = '600px'
            main.style.marginLeft = 'unset'
            main.style.marginRight = 'unset'
            map_div.style.display = 'flex'
            map_extension.style.display = "flex"
            map_extension.style.width= '500px';
        }

        else {

            main.style.width = '1000px'
            main.style.marginLeft = 'auto'
            main.style.marginRight = 'auto'
            map_div.style.display = 'none'
            map_extension.style.display = "none"
        }
    }

    else if (display_mode=="vertical"){

        if (map_div.style.display =='none'){
            panes = document.getElementsByClassName("pane")
            for (let pane of panes) {
                pane.style.display="none"
            }

            map_div.style.display = 'flex'
            map_extension.style.display = "flex"
            map_extension.style.width = '100%'
            map_extension.style.height = '30%'

        }

        else {

            main.style.width = '100%'
            main.style.marginLeft = 'auto'
            main.style.marginRight = 'auto'
            map_div.style.display = 'none'
            map_extension.style.display = "none"
        }
    }
    // VERTICAL (MOBILE)

}

function toggleMapSmall(){

    event.preventDefault();
    wrapper_map_mini = document.getElementById("wrapper_map_mini")

    if (wrapper_map_mini.style.display=='none'){
        wrapper_map_mini.style.display = 'block'
        initNaverMap(x=37.4832059, y=126.8231877, zoom_level=15, zoom_min=8, zoom_max=20, div_id="wrapper_map_mini")
    }

    else{
        wrapper_map_mini.style.display = 'none'
    }


}




function togglePost(){

    event.preventDefault();

    window.history.pushState(
        {},
        "/post",
        window.location.origin + "/post"
    );


    let map_div = document.getElementById(wrapper_map_id)
    let panes = document.getElementsByClassName('pane')



    if(map_div.style.display=='flex'){
        toggleMap()
    }


    current_page = "post"

    for (let i=0; i<panes.length; i++){

        panes[i].style.display='none'

    }

    post = document.getElementById('post')
    post.style.display = 'flex'


}


function setImageInfo(){
    alert("지도 센터 이동해서\n해당이미지 촬영위치에다 마커 표시하고 어쩌고 저쩌고\n아무튼 추후 연동")
}




function renderGallery(clear=false){

    // raw_data 에서 차례대로 데이터를 꺼내서 N장씩 붙여주는 함수

    column = document.getElementById("column")
    if (clear){
        removeAllChildNodes(column)
    }


    if (raw_data.length > 0){

        current_item_cnt = column.children.length
        tobe_item_cnt = Math.min(column.children.length + GALLERY_BATCH_SIZE, raw_data.length)

        console.log(current_item_cnt)
        console.log(tobe_item_cnt)

        for (let i=current_item_cnt; i< tobe_item_cnt; i++){
            console.log(i)
            console.log(raw_data[i])
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
//        for (let image of raw_data){
//
//            html = makeGalleryContent(image)
//            column.appendChild(html)
//        }


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

function createPost(cnt=1, container){

    for (let i=0; i<cnt; i++){
        const post = document.createElement('div');

        if(container.id == 'gallery'){
            console.log('createPost for column...')
            renderGallery()
        }

        else if(container.id == 'grid_container'){

            console.log('createPost for grid...')
            post.className = 'grid';
            post.innerHTML = 'C'+i

            grid = document.getElementById("grid")
            grid.appendChild(post);

            // container.appendChild(post);
        }
	}
}

function logout(){
    let req = new XMLHttpRequest()
    req.onreadystatechange = function()
    {
        if (req.readyState == 4)
        {
            if (req.status == 200)
            {
                // console.log(' * LOGOUT, ', req.status)
                window.location = "/";
            }

        }
    }

    req.open('POST', '/logout')
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    req.send()

    return false
}



function getAttributeListFromListOfObject(object, attribute){

    ret = []
    for (let i=0; i<object.length; i++){
        ret.push(object[i][attribute])
    }

    return ret
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};


function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}