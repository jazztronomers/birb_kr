document.addEventListener("DOMContentLoaded", function(){


    // INIT MAP, SET LISTENER
    initNaverMap(x=37.4832059, y=126.8231877, zoom_level=15, zoom_min=13, zoom_max=20)


    // WEB(HORIZONTAL)

    column_container = document.getElementById('gallery');
    column_container.addEventListener('scroll',()=>{

        clientHeight = document.documentElement.clientHeight
        scrollHeight = column_container.scrollHeight;
        scrollTop = column_container.scrollTop;

        if(scrollTop + clientHeight > scrollHeight - 20){

            createPost(3, column_container)

        }
    });

    grid_container = document.getElementById('user');
    grid_container.addEventListener('scroll',()=>{

        clientHeight = document.documentElement.clientHeight
        scrollHeight = grid_container.scrollHeight;
        scrollTop = grid_container.scrollTop;

        if(scrollTop + clientHeight > scrollHeight - 20){

            createPost(3, grid_container)

        }
    });



    window.addEventListener('load', function() {
        document.querySelector('input[type="file"]').addEventListener('change', function() {
            if (this.files && this.files[0]) {

                image_here = document.getElementById("image_here")
                page_here = document.getElementById("page_here")
                removeAllChildNodes(image_here)
                removeAllChildNodes(page_here)

                for (let i=0; i<this.files.length; i++){


                    div = document.createElement("div")
                    div.setAttribute("class", "mySlides fade")

                    img = document.createElement("img")
                    img.style.width="100%"
                    img.src = URL.createObjectURL(this.files[i]); // set src to blob url

                    div.appendChild(img)
                    image_here.appendChild(div)


                    span = document.createElement("span")
                    span.setAttribute("class", "dot")
                    span.setAttribute("onclick", "currentSlide("+i+1+")")
                    page_here.appendChild(span)


                }
                showSlides(1);
          }
        });
    });



    // MOBILE(VERTICAL)


    showSlides(slideIndex);



});



function toggle(divid){


    panes = document.getElementsByClassName('pane')

    for (let i=0; i<panes.length; i++){

        panes[i].style.display='none'

    }

    input_div = document.getElementById(divid)
    input_div.style.display='flex'


}


function setImageInfo(){
    alert("지도 센터 이동해서\n해당이미지 촬영위치에다 마커 표시하고 어쩌고 저쩌고\n아무튼 추후 연동")
}

function createPost(cnt=3, container){

    for (let i=0; i<cnt; i++){
        const post = document.createElement('div');

        if(container.id == 'gallery'){
            console.log('createPost for column...')
            post.className = 'content';
            post.innerHTML = '인피닛스크롤'

            column = document.getElementById("column")
            column.appendChild(post);
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



