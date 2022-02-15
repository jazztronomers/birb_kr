let slideIndex = 1;

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