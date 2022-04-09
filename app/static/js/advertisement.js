function initAd(){
    if(window.innerWidth > 1600){

        for (div of document.querySelectorAll('.ad.fixed')){
            console.log(div)
            div.style.display='flex';
            div.innerHTML=getAdFixedVertical()
        }

    }
}

function getAdFixedVertical(){

    return `
    <H3><span style="font-size: 1.4rem">LOOKING FOR ADVERTISER</span></H3>

    <span>- for birder only</span>
    <span>- Ads here for PC only</span>
    <span>- 200px * 800px</span>
    <hr>
    <span style="font-size: .7rem">DM: @jazzbirb</span>
    <span style="font-size: .7rem">Email: jazztronomers@gmail.com</span>
    `
}

function getAdHorizontalGallery(){

    return `
    <div class="ad inline">
        <div class="ad inline block">
            <div>
                <span style="font-size: 1.2rem">LOOKING FOR ADVERTISER</span>
                <span style="font-size: .7rem">for birder only</span>

            </div>
            <div>
                <span style="font-size: .7rem">ads here for both PC and Mobile</span>
            </div>
            <div>
                <span style="font-size: .7rem">DM: @jazzbirb</span>
            </div>
            <div>
                <span style="font-size: .7rem">Email: jazztronomers@gmail.com</span>
            </div>
        </div>
        <div class="ad inline block">
            <div>새가 사진보다 소중합니다</div>
            <div>새를 괴롭히면서까지 사진을 찍지 마세요</div>
            <div>있는 그대로의 자연을 즐깁시다</div>
        </div>
    </div>
    `


}




