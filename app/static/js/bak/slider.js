

function slide(wrapper, items, prev, next) {
  var posX1 = 0,
      posX2 = 0,
      posInitial,
      posFinal,
      threshold = 100,
      slides = items.getElementsByClassName('slide'),
      slidesLength = slides.length,
      slideSize = items.getElementsByClassName('slide')[0].offsetWidth,
      firstSlide = slides[0],
      lastSlide = slides[slidesLength - 1],
      cloneFirst = firstSlide.cloneNode(true),
      cloneLast = lastSlide.cloneNode(true),
      index = 0,
      allowShift = true;




  // Clone first and last slide
  items.appendChild(cloneFirst);
  items.insertBefore(cloneLast, firstSlide);
  wrapper.classList.add('loaded');

  // Mouse and Touch events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);

  // Click events
  prev.addEventListener('click', function () { shiftSlide(-1) });
  next.addEventListener('click', function () { shiftSlide(1) });

  // Transition events
  items.addEventListener('transitionend', checkIndex);

    items.style.left = '0px'

  function dragStart (e) {
    e = e || window.event;
    e.preventDefault();
    posInitial = items.offsetLeft;

    if (e.type == 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  function dragAction (e) {
    e = e || window.event;

    if (e.type == 'touchmove') {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }
    items.style.left = (items.offsetLeft - posX2) + "px";
  }

  function dragEnd (e) {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) {
      shiftSlide(1, 'drag');
    } else if (posFinal - posInitial > threshold) {
      shiftSlide(-1, 'drag');
    } else {
      items.style.left = (posInitial) + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

  function shiftSlide(dir, action) {
    items.classList.add('shifting');


    if (allowShift) {
      if (!action) { posInitial = items.offsetLeft; }

      if (dir == 1) {
        items.style.left = (posInitial - slideSize) + "px";
        index++;
      } else if (dir == -1) {
        items.style.left = (posInitial + slideSize) + "px";
        index--;
      }

    };

    allowShift = false;
  }

  function checkIndex (){
    items.classList.remove('shifting');

    if (index == -1) {
      items.style.left = -(slidesLength * slideSize) + "px";
      index = slidesLength - 1;
    }

    if (index == slidesLength) {
      items.style.left = -(1 * slideSize) + "px";
      index = 0;
    }

    allowShift = true;
  }
}


//            <div id="post_slider_wrapper">
//<!--                <div id="post_slider" class="slider">-->
//<!--                    <div class="slide_wrapper">-->
//<!--                        <div id="post_items" class="items">-->
//<!--                          <span class="slide">Slide 1</span>-->
//<!--                          <span class="slide">Slide 2</span>-->
//<!--                          <span class="slide">Slide 3</span>-->
//<!--                          <span class="slide">Slide 4</span>-->
//<!--                          <span class="slide">Slide 5</span>-->
//<!--                        </div>-->
//<!--                    </div>-->
//<!--                    <a id="post_prev" class="control prev"><i class="fi fi-rr-angle-small-left"></i></a>-->
//<!--                    <a id="post_next" class="control next"><i class="fi fi-rr-angle-small-right"></i></a>-->
//<!--                </div>-->
//            </div>



    window.addEventListener('load', function() {
        document.querySelector('input[type="file"]').addEventListener('change', function() {
            if (this.files && this.files[0]) {

                post_slider_wrapper = document.getElementById("post_slider_wrapper")
                removeAllChildNodes(post_slider_wrapper)

                post_slider = document.createElement("div")
                post_slider.setAttribute("id", "post_slider")
                post_slider.setAttribute("class", "slider")
                post_slider_wrapper.appendChild(post_slider)

                slide_wrapper = document.createElement("div")
                slide_wrapper.setAttribute("class", "slide_wrapper")

                post_items = document.createElement("div")
                post_items.setAttribute("id", "post_items")
                post_items.setAttribute("class", "items")
                slide_wrapper.appendChild(post_items)

                post_slider.appendChild(slide_wrapper)

                post_prev = document.createElement("a")
                post_prev.setAttribute("id", "post_prev")
                post_prev.setAttribute("class", "control prev")
                post_slider.appendChild(post_prev)

                post_next = document.createElement("a")
                post_next.setAttribute("id", "post_next")
                post_next.setAttribute("class", "control next")
                post_slider.appendChild(post_next)

                i_prev = document.createElement("i")
                i_prev.setAttribute("class", "fi fi-rr-angle-small-left")
                post_prev.appendChild(i_prev)

                i_next = document.createElement("i")
                i_next.setAttribute("class", "fi fi-rr-angle-small-right")
                post_next.appendChild(i_next)



                for (let i=0; i<this.files.length; i++){


                    span = document.createElement("span")
                    span.setAttribute("class", "slide")

                    img = document.createElement("img")

                    img.src = URL.createObjectURL(this.files[i]); // set src to blob url

                    span.appendChild(img)
                    post_items.appendChild(span)


                    cropper = new Cropper(img, {
                      aspectRatio: 1/1,
                      crop(event) {
                        console.log(event.detail.x);
                        console.log(event.detail.y);
                        console.log(event.detail.width);
                        console.log(event.detail.height);
                        console.log(event.detail.rotate);
                        console.log(event.detail.scaleX);
                        console.log(event.detail.scaleY);
                      },
                    });

                }


                let slider = document.getElementById('post_slider'),
                    sliderItems = document.getElementById('post_items'),
                    prev = document.getElementById('post_prev'),
                    next = document.getElementById('post_next');

                slide(slider, sliderItems, prev, next);



          }
        });
    });




#post_slider_wrapper {

    width: 100%;
}

.slider {
    position: relative;

    width: 100%;
    aspect-ratio: 1;
    border: 1px dashed black;
}


.slide_wrapper {
  overflow: hidden;
  position: relative;
  background: #222;
  z-index: 1;
}

.items {
  width: 10000px;
  position: relative;
  top: 0;
  left: -300px;
}

.items.shifting {
  transition: left .2s ease-out;
}

.slide {
    position: relative;
    width: 1000px;
    cursor: pointer;
    float: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: all 1s;
    background: #FFCF47;



}

.slider .control {
  position: absolute;
  top: 50%;
  z-index: 2;
  font-size: 30px;

}

.slider .prev {
  left: 20px;
}

.slider .next {

  right: 20px;
}

