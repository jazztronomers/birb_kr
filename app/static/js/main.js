document.addEventListener("DOMContentLoaded", function(){


    getConst()
    getSession()

    // HTTPS 인증후 브라우저상에서 자기 현재 좌표 얻을 수 있는 함수
    //    navigator.geolocation.getCurrentPosition(success, error, {
    //      enableHighAccuracy: true,
    //      timeout: 5000,
    //      maximumAge: 0
    //    });


    // CLIENT SIDE ROUTER LISTENER
    window.addEventListener("popstate", () => {

        full_url = location.href.toString()
        to = full_url.split(window.location.host)[1].split('/')[1]
        params = to = full_url.split(window.location.host)[1].split('/')[2] // [2:] 나중에 구현..

        toggle(location.href.toString().split(window.location.host)[1].split('/')[1], params, true)

    });

    window.addEventListener('scroll', throttle(scrollSwitch, 200), {
        capture: true,
        passive: true
    });

    toggle(route, route_params)
    wrapper_main = document.getElementById("wrapper_main")

    canvas_width = wrapper_main.offsetWidth
    canvas_height = wrapper_main.offsetHeight
    initAd()

});


let CLIENT_WIDTH = window.innerWidth
let EDITOR_CATEGORY = undefined
let EDITOR_OPTION = undefined
let BIRD = undefined
let CURRENT_PAGE = "others"
let LOCATION = undefined


let display_mode = (window.innerWidth / window.innerHeight) > 100 ? 'horizontal' : 'vertical'
// let wrapper_map_id = (window.innerWidth / window.innerHeight) > 100 ? 'wrapper_map_horizontal' : 'wrapper_map_vertical'

// FOR INFINITE SCROLL
// FIRE FUNCTION ONLY ONCE IN TIME INTERVAL (LIMIT)
function throttle(callback, limit = 100) {
    let waiting = false
    return function() {
        if(!waiting) {
            callback.apply(this, arguments)
            waiting = true
            setTimeout(() => {
                waiting = false
            }, limit)
        }
    }
}


function scrollSwitch(){

    if (CURRENT_PAGE=="gallery"){

        clientHeight = document.documentElement.clientHeight // 창의 크기
        scrollHeight = document.body.scrollHeight;           // REFLOW후 창의 높이
        scrollTop = document.documentElement.scrollTop;      // 현재 스크롤의 위치



        column = document.getElementById("gallery_items")
        current_item_cnt = column.querySelectorAll(".content").length

        if ((scrollTop + clientHeight > scrollHeight * 0.5) && (raw_data.length == current_item_cnt) && gallery_has_next){
            console.log('infinite more', raw_data.length, current_item_cnt)
            getGalleryData(GALLERY_ROW_PER_PAGE,  parseInt(current_item_cnt/ GALLERY_ROW_PER_PAGE)+1)
        }

        else if(scrollTop + clientHeight > scrollHeight * 0.8 && scroll_has_next){

            if (gallery_has_next == false){
                scroll_has_next = false;
            }
            infiniteScroll(initGallery)
        }
    }
}

// GET LOCATION OF USER, HTTPS / SSL 필요
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



// GET EXIF OF JPEG IMAGE
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



//
//function reportWindowSize() {
//
//  console.log(window.innerWidth)
//  CLIENT_WIDTH = window.innerWidth
//
//}
//
//window.onresize = reportWindowSize;



function toggle(to, param=null, backward=false, callback=null){
    /*

    toggle 이라기엔 커스텀 라우터...

    */

    console.log('toggle..', to, param)
    event.preventDefault();

//    let map_div = document.getElementById(wrapper_map_id)
//    let map_extension = document.getElementById("wrapper_map_extension")

//    if (['post'].includes(current_page)){
//        confirmation = confirm("작성중인 내용이 모두 지워집니다, 계속 하시겠습니까?")
//        if (!confirmation){
//            return false
//        }
//    }

    // CLIENT SIDE ROUTING
    if (! backward){
        if (param!= null && param!=''){
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




    if (to=="root"){
        document.location.href="/";
    }

    panes = document.getElementsByClassName('pane')
    for (let i=0; i<panes.length; i++){
        panes[i].style.display='none'
    }

    input_div = document.getElementById(to)
    if (input_div) {
        input_div.style.display='flex'
        input_div.style.height='100%'
    }


    CURRENT_PAGE = to
    // C A L L B A C K P R E S E T
    if (to=="gallery"){
        if (raw_data.length==0){

            getGalleryData(GALLERY_ROW_PER_PAGE, current_page=1, species=[], month=[], callback=initGallery)
        }
    }

    else if (to=="editor"){
        initEditor()
    }

    else if (to=="board"){
        initContents()
    }

    else if (to=="post"){
        initPost(param)
    }

    else if (to=="user"){
        initUser(param)
    }

    else if (to=="meta"){
        initMeta(param)
    }

    else if (to=="map"){
        initMap()
    }


}


function toggleGNBDrop(){

    dropdown_user = document.getElementById("utils_dropdown")
    if (dropdown_user.style.display=="none" || dropdown_user.style.display=="" ){
        dropdown_user.style.display='flex'
        dropdown_user.style.flexDirection='column'
    }
    else {
        dropdown_user.style.display='none'
    }
}





//function setImageInfo(){
////    action_popup.confirm("custom confirm", function (res) {
////        if (res) {
////            action_popup.alert("yes");
////        }
////    })
////
//
//    action_popup.alert("custom alert");
//
//    $(".modal_close").on("click", function () {
//        action_popup.close(this);
//    });
//}



function getConst(){



    var req = new XMLHttpRequest()
    // req.responseType = 'json';
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

                res = JSON.parse(req.response)
                EDITOR_CATEGORY = res.data.category
                EDITOR_OPTION = res.data.option
                BIRD = res.data.bird
                df_birds = new dfd.DataFrame(res.data.bird.birds_list)
                console.log(BIRD)
                df_birds.print()
            }
        }
    }


    req.open('POST', '/getConst', false)
    req.setRequestHeader("Content-type", "application/json")
    req.send()


}


function getSession(){



    var req = new XMLHttpRequest()
    // req.responseType = 'json';
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

                res = JSON.parse(req.response)
                LOCATION = res.data.location
            }
        }
    }


    req.open('POST', '/api/session/get', false)
    req.setRequestHeader("Content-type", "application/json")
    req.send()


}


function infiniteScroll(func){
    func()
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

function zip(arrays) {
    /*

        zip([[1,2,3],[4,5,6]])
    =>

        (3) [Array(2), Array(2), Array(2)]
        0: (2) [1, 4]
        1: (2) [2, 5]
        2: (2) [3, 6]

    */
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
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




class Component {
  $target;
  $state;
  constructor ($target, $state) {
    this.$target = $target;
    this.$state = $state;

    console.log('constructor', this.$target, this.$state)

    this.setup();
    this.render();
  }
  setup () {};
  template () { return ''; }
  render () {
    this.$target.innerHTML = this.template();
    this.setEvent();
  }
  setEvent () {}
  setState (newState) {
    this.$state = { ...this.$state, ...newState };
    this.render();
  }
}

//class App extends Component {
//  setup () {
//    this.$state = { items: ['item1', 'item2'] };
//  }
//  template () {
//    const { items } = this.$state;
//    return `
//        <ul>
//          ${items.map(item => `<li>${item}</li>`).join('')}
//        </ul>
//        <button>추가</button>
//    `
//  }
//
//
//}
