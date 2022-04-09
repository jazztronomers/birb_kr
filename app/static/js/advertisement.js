function initAd(){
    if(window.innerWidth > 1600){

        for (div of document.querySelectorAll('.ad.fixed')){
            console.log(div)
            div.style.display='flex';
            div.innerHTML=`

            <h3>광고주 모십니다</h3>

            <span>- 탐조관련 컨텐츠 only</span>
            <span>- pc노출 only</span>
            <span>- 고정위치</span>
            <span>- 200px * 800px</span>


            `
        }

    }
}

function getAdFixedVertical(){

    return `
    <h3>광고주 모십니다</h3>

    <span>- 탐조관련 컨텐츠 only</span>
    <span>- pc노출 only</span>
    <span>- 고정위치</span>
    <span>- 200px * 800px</span>

    `
}

function getAdHorizontalGallery(){

    return `
    <div class="ad inline">
        <div>
            <span style="font-size: 1.2rem"> LOOKING FOR ADVERTISER</span>
            <span style="font-size: .7rem">for birder only</span>
        </div>
        <div>
            <span style="font-size: .7rem">DM: @jazzbirb</span>
        </div>
        <div>
            <span style="font-size: .7rem">Email: jazztronomers@gmail.com</span>
        </div>
    </div>
    `


}




