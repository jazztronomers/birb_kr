function initAd(){
    if(window.innerWidth > 1600){

        for (div of document.querySelectorAll('.adsense.fixed')){
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
    <h3>광고주 모십니다</h3>
    <span>- 탐조관련 컨텐츠 only</span>
    <span>- pc노출 only</span>
    <span>- Scroll 컨텐츠 사이사이 </span>
    <span>- 1000px * 100px (10:1)</span>
    <span>- 300px * 60px (5:1)</span>

    `


}




