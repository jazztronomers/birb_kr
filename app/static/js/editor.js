const IMAGE_MAX_WIDTH = 1920
const IMAGE_COMPRESS_RATIO = 0.9
const TITLE_LENGTH_MIN=3
const MAXIMUM_IMAGE_COUNT_PER_POST= 40
const TEXTAREA_PLACEHOLDER="이미지 업로드는 위 툴바에 버튼을 활용해주세요, 클립보드에서 옮겨온(그림판 복붙, 캡쳐)는 텍스트로 인지되어 정상작동하지 않습니다"
const ALERT_MESSAGE_VALIDATE_TITLE=`제목은 ${TITLE_LENGTH_MIN}자 이상이어야 합니다`
const ALERT_MESSAGE_VALIDATE_IMG_CNT_MAX=`이미지는 최대 ${MAXIMUM_IMAGE_COUNT_PER_POST}장 까지 올릴 수 있습니다`
const ALERT_MESSAGE_VALIDATE_IMG_CNT="이미지를 최소 한장 업로드 하세요"

let editor_initialized=false
let editor_uploading = false




class Editor extends Component{
    setup() {
        this.$state = { items: this.$state };
    }

    template() {
        const { items } = this.$state;
        return `

            <div id="editor_tool">
                <input id="editor_upload" type="file" accept="image/*" multiple style="display:flex"/>
            </div>
            <div id="editor_header">
                <span class="select">
                    <select id="editor_category">
                    </select>
                </span>
                <input id="editor_title" type="text" placeholder="제목을 입력하세요">
                <span class="select">
                    <select id="editor_option">
                    </select>
                </span>
                <button id="editor_submit" onclick="submitPost()">submit</button>
            </div>
            <div id="editor_body">
                <textarea id="editor_textarea" placeholder="${TEXTAREA_PLACEHOLDER}"></textarea>
            </div>
            <div id="editor_map" style="display: none">
                <div id="wrapper_map_btns">
                    <button onclick="alert('here')">testA</button>
                    <button onclick="alert('here')">testB</button>
                    <button onclick="alert('here')">testC</button>
                </div>
                <div id="wrapper_map_mini" class="wrapper_map_mini"></div>
            </div>
        `
    }
}


function initEditor(){

    if (editor_initialized == false){

        removeAllChildNodes(document.querySelector("#editor"))
        new Editor(document.querySelector("#editor"), [])
        editor_initialized=true
        console.log(" * initEditor start..")
        map_editor = document.getElementById("wrapper_map_mini")
        initEditorHeader()
        tinymce.init({
                menubar: false,
                // forced_root_block : "",
                selector: '#editor_textarea',
                toolbar: 'undo redo erase | addImage addVideo addLink addLocation',
                preview_styles: false,
                // preview_styles: 'font-family font-size font-weight font-style text-decoration text-transform color background-color outline text-shadow',
                content_style: 'img {max-width: 100%;} textarea {border:5px solid black}',
                setup: function (editor) {

                    editor.ui.registry.addButton('erase', {
                        icon: 'document-properties',
                        tooltip: 'erase',
                        disabled: true,
                        onAction: function (_) {
                            confirmation = confirm("clear", clearEditor, null)

                        },
                        onSetup: function (buttonApi) {
                            var editorEventCallback = function (eventApi) {
                                buttonApi.setDisabled(eventApi.element.nodeName.toLowerCase() === 'time');
                            };
                            editor.on('NodeChange', editorEventCallback);

                            /* onSetup should always return the unbind handlers */
                            return function (buttonApi) {
                                editor.off('NodeChange', editorEventCallback);
                            };
                        }
                    });


                    editor.ui.registry.addButton('addVideo', {
                        icon: 'embed',
                        tooltip: 'Add video',
                        disabled: true,
                        onAction: function (_) {
                            alert("아직 지원안합니다 ㅈㅅ")
                        },
                        onSetup: function (buttonApi) {
                            var editorEventCallback = function (eventApi) {
                                buttonApi.setDisabled(eventApi.element.nodeName.toLowerCase() === 'time');
                            };
                            editor.on('NodeChange', editorEventCallback);

                            /* onSetup should always return the unbind handlers */
                            return function (buttonApi) {
                                editor.off('NodeChange', editorEventCallback);
                            };
                        }
                    });

                    editor.ui.registry.addButton('addLocation', {
                        icon: 'temporary-placeholder',
                        tooltip: 'Add Location',
                        disabled: true,
                        onAction: function (_) {

                            toggleMapSmall()
                        },
                        onSetup: function (buttonApi) {
                            var editorEventCallback = function (eventApi) {
                                buttonApi.setDisabled(eventApi.element.nodeName.toLowerCase() === 'time');
                            };
                            editor.on('NodeChange', editorEventCallback);

                            /* onSetup should always return the unbind handlers */
                            return function (buttonApi) {
                                editor.off('NodeChange', editorEventCallback);
                            };
                        }
                    });



                    editor.ui.registry.addButton('addLink', {
                        icon: 'link',
                        tooltip: 'Add link',
                        disabled: true,
                        onAction: function (_) {
                            alert("Youtube링크 삽입용")
                        },
                        onSetup: function (buttonApi) {
                            var editorEventCallback = function (eventApi) {
                                buttonApi.setDisabled(eventApi.element.nodeName.toLowerCase() === 'time');
                            };
                            editor.on('NodeChange', editorEventCallback);

                            /* onSetup should always return the unbind handlers */
                            return function (buttonApi) {
                                editor.off('NodeChange', editorEventCallback);
                            };
                        }
                    });

                    // ==============================================
                    // U P L O A D B T N
                    // ==============================================
                    editor.ui.registry.addButton('addImage', {
                        icon: 'image',
                        tooltip: 'Add image',
                        disabled: true,
                        onAction: function (_) {

                            console.log("addImage button clicked..")


                            document.getElementById("editor_upload").click();

                        },
                        onSetup: function (buttonApi) {
                            console.log('onSetup')
                            var editorEventCallback = function (eventApi) {
                                buttonApi.setDisabled(eventApi.element.nodeName.toLowerCase() === 'time');
                            };
                            editor.on('NodeChange', editorEventCallback);

                            /* onSetup should always return the unbind handlers */
                            return function (buttonApi) {
                                editor.off('NodeChange', editorEventCallback);
                            };
                        }
                    });
                }
            }
        )

        document.querySelector('#editor_upload').addEventListener('input', function() {

                console.log("editor upload files change event triggerd..")
                if (this.files && this.files[0]) {

                        console.log("image count..", this.files.length)
                        for (file of this.files){
                            var img = new Image;
                            img.onload = resizeImage;
                            img.src = URL.createObjectURL(file)

                            function resizeImage() {
                                var newDataUri = imageToDataUri(this, IMAGE_COMPRESS_RATIO);
                                var img_html = toImgHtml(newDataUri)
                                tinyMCE.activeEditor.insertContent(img_html)
                            }
                        }

                    }
            }
        )

    }
    else {
        clearEditor()
    }
}

// ==============================================
// F U N C T I O N
// ==============================================


function submitValidate(htmlDoc){

    ret = true

    // AT LEAST ONE IMAGE
    image_count = htmlDoc.getElementsByClassName("image").length
    title = document.getElementById("editor_title").value
    // TITLE > 5 WORD


    if (title.length < TITLE_LENGTH_MIN) {
        alert(ALERT_MESSAGE_VALIDATE_TITLE)
        ret = false
    }

    else if (image_count < 1) {
        alert(ALERT_MESSAGE_VALIDATE_IMG_CNT)
        ret = false
    }

    else if (image_count > MAXIMUM_IMAGE_COUNT_PER_POST)
        alert(ALERT_MESSAGE_VALIDATE_IMG_CNT_MAX)
        ret = false

    return ret
}


function submitPost(){


    let content = tinyMCE.get('editor_textarea').getContent();
    let parser = new DOMParser();
    let htmlDoc = parser.parseFromString(content, 'text/html');

    console.log('*', htmlDoc.body.innerHTML.toString())

    if(submitValidate(htmlDoc)){

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

                    confirm("컨텐츠에 메타(위치, 종 등)정보를 입력하시겠습니까",
                    function() {
                        toggle('meta', req.response.post_id)
                    },
                    function() {
                            window.location = "/";
                    })

                }
            }
        }



        let formData = new FormData();
        images = htmlDoc.getElementsByClassName("image")
        key_prefix = 'img_'


        for (let i=0; i<images.length; i++){
            try {

                idx = ('' + i).padStart(4, '0')
                key = `${key_prefix}${idx}`
                formData.append(key, dataURItoBlob(images[i].src))
                // images[i].src => html content => 즉 본문에 base64 image 가 치환됨
                images[i].src= key

            } catch (error) {
                alert(''+i+error)

                // expected output: ReferenceError: nonExistentFunction is not defined
                // Note - error messages will vary depending on browser
            }


        }

        formData.append("title", document.getElementById("editor_title").value)
        formData.append("category", document.getElementById("editor_category").value)
        formData.append("content", htmlDoc.body.innerHTML.toString())
        formData.append("option", document.getElementById("editor_option").value)

        console.log(htmlDoc.body.innerHTML.toString())

        req.open('POST', '/submitPost')
        req.send(formData)

    }
}


function initEditorHeader(){
    console.log(" * initEditorHeader")
    editor_category = document.getElementById("editor_category")
    for (const [k, v] of Object.entries(EDITOR_CATEGORY)){

        option = document.createElement("option")
        option.value= k
        option.innerHTML= v
        editor_category.appendChild(option)
    }

    editor_option = document.getElementById("editor_option")
    for (const [k, v] of Object.entries(EDITOR_OPTION)){

        option = document.createElement("option")
        option.value= k
        option.innerHTML= v
        editor_option.appendChild(option)
    }

}

function dataURItoBlob(dataURI) {


  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});


  console.log(blob)
  return blob;

}




var toImgHtml = function (url) {
    return `<img class="image" src="${url.toString()}">`
};

function imageToDataUri(img, compress_ratio=0.75) {

    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    ratio = 1
    if (img.width > IMAGE_MAX_WIDTH){
        ratio = IMAGE_MAX_WIDTH / img.width
    }

    width_final = img.width * ratio
    height_final = img.height * ratio

    // set its dimension to target size
    canvas.width = width_final
    canvas.height = height_final

    ctx.drawImage(img, 0, 0, width_final, height_final);



    return canvas.toDataURL("image/jpeg", compress_ratio);
}

function clearEditor(){

    document.getElementById("editor_title").value=""
    tinyMCE.activeEditor.setContent('')
}

function toggleMapSmall(){

    event.preventDefault();

    editor_map = document.getElementById("editor_map")

    // wrapper_map_mini = document.getElementById("wrapper_map_mini")

    if (editor_map.style.display=='none'){
        editor_map.style.display = 'block'

        x = LOCATION.x
        y = LOCATION.y

        initNaverMap(x=x, y=y, zoom_level=15, zoom_min=8, zoom_max=20, div_id="wrapper_map_mini")
    }

    else{
        editor_map.style.display = 'none'
    }
}


function showMediaMetaInput(){
    // 현재 에디터의 모든 MEDIA ITEM에 대해서
    // MEDA DATA 입력창 보이기

}


