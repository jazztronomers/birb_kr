///////////////////////////////////////////////////////////////////////////////
// 사용안함
///////////////////////////////////////////////////////////////////////////////
let slideIndex = 1;


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



function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("slide");


    if (slides.length > 0){
        // var dots = document.getElementsByClassName("dot");
        if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
        }
        //    for (i = 0; i < dots.length; i++) {
        //      dots[i].className = dots[i].className.replace(" active", "");
        //    }
        slides[slideIndex-1].style.display = "block";
        // dots[slideIndex-1].className += " active";
    }
}

function clearPost(){

    input = document.getElementById('post_upload')
    input.value = '';

    post_slide_container = document.getElementById("post_slide_container")
    slides = post_slide_container.querySelectorAll('.slides')

    for (let i=0; i<slides.length; i++){
        post_slide_container.removeChild(slides[i])
    }
}



function upload(){

    // https://stackoverflow.com/questions/56573339/using-cropper-js-image-quality-get-reduced-after-cropping

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

                alert(req.response.message)
                window.location = "/";
            }
        }
    }


    let formData = new FormData();
    slides = document.getElementsByClassName("slide")

    i = 0

    for (let slide of slides){
        content = slide.querySelector(".img_to_upload").cropper.getCroppedCanvas({
            maxWidth: 2500,
            maxHeight: 2500,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',

        }).toDataURL('image/png', 1);


        //array.push(dataURItoBlob(content))
        key = 'image_'+i
        formData.append(key, dataURItoBlob(content));

        meta = {
            "observe_timestamp" :slide.querySelector(".image_meta_datetime_original").value,
            "camera":slide.querySelector(".image_meta_camera_model").value,
            "lens":slide .querySelector(".image_meta_lens_model").value,
            "x":slide.querySelector(".image_meta_longitude").value,
            "y":slide.querySelector(".image_meta_latitude").value,
            "species":[slide.querySelector(".image_meta_species").value]
        }


        key = 'meta_'+i
        formData.append(key, JSON.stringify(meta))

        i+=1
    }



    req.open('POST', '/uploadFile')
    req.setRequestHeader("test", "yoho")
    req.send(formData)






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
  return blob;

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


//        <div id="post" class="pane" style = 'display: none'>
//            <div id="post_util_container">
//                <div class="add_images">
//                    <button class="btn">
//                        <label for="post_upload">
//                            <i class="fi fi-rr-plus"></i> ADD IMAGE
//                        </label>
//                        <input id="post_upload" type="file" multiple />
//                    </button>
//                </div>
//                <div class="upload_images">
//                    <button class="btn" onclick="upload()">
//                        <i class="fi fi-rr-plus"></i> UPLOAD SELECTED FILE
//                    </button>
//                </div>
//                <div class="open_map">
//                    <button class="btn" onclick="toggleMapSmall()">
//                        <i class="fi fi-rr-map-marker"></i> OPEN MAP
//                    </button>
//                </div>
//            </div>
//            <div id="post_slide_container">
//                <div id="for_button">
//                    <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
//                    <a class="next" onclick="plusSlides(1)">&#10095;</a>
//                    <span class="info">스크롤을 해라</span>
//                </div>
//                <div id="slides">
//
//                </div>
//                <div id="wrapper_map_mini" class="wrapper_map_mini" style="display: block"></div>
//
//            </div>
//        </div>