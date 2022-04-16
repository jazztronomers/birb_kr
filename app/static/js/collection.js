// RENDERING-WHOLE PAGE
// RENDERING-PARTIAL PAGE
// RENDERING-FILL DATA TO SECTION
// API

let collection_image_api_idle = true
let collection_image_has_next = true
let collection_image_data = []
let collection_image_last_batch = []
let collection_scroll_image_has_next = []



function getItemBySpecies(species, callback){


    console.log(species, callback)
    // post 를 선택하면 해당 아이템 안에 모든 아이템이 리턴되도록
    // 식별자와 시각화목적 Attribute 만 리턴
    if (collection_image_api_idle == true){

        collection_image_api_idle = false
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




                    collection_image_last_batch = req.response.data
                    collection_image_has_next = req.response.has_next
                    collection_image_data = collection_image_data.concat(collection_image_last_batch)

                    console.log(' * collection has next', collection_image_has_next)
                    console.log(' * response data size', collection_image_last_batch.length)
                    console.log(' * response data', collection_image_last_batch)
                    console.log(' * current collcetion data size', collection_image_data.length)

                    collection_image_api_idle = true

                    if(callback!=null){
                        callback(collection_image_last_batch)
                    }


                }
            }
        }



        data = JSON.stringify({"species": species})
        console.log(data, species)
        console.log(data, species)
        req.open('POST', '/items/get/collection')
        req.setRequestHeader("Content-type", "application/json")
        req.send(data)
    }
}


function initCollection(){

    new Collection(document.querySelector('#collection'))
    new CollectionOrder(document.querySelector('.order_selector .content'), dropDuplicates(df_birds.order_kr.values), {})
    new CollectionFamily(document.querySelector('.family_selector .content'), dropDuplicates(df_birds.family_kr.values), {})
    new CollectionSpecies(document.querySelector('.species_selector .content'), dropDuplicates(df_birds.species_kr.values), {})

    showSpeciesCollection("Nycticorax nycticorax")

    const selectors = document.querySelectorAll(".horizontal_div_slider .content")
    for (let selector of selectors){
        console.log(selector)
        selector.addEventListener("wheel", (evt) => {
            evt.preventDefault();
            selector.scrollLeft += evt.deltaY;
        });
    }


}



function actionOrderSelect(a_tag){


    order_selected = a_tag.querySelector("span").getAttribute('order')
    // family_selected = a_tag.querySelector("span").getAttribute('family'))

    new CollectionOrder(document.querySelector('.order_selector .content'), dropDuplicates(df_birds.order_kr.values), {'order':order_selected})
    new CollectionFamily(document.querySelector('.family_selector .content'), dropDuplicates(df_birds.family_kr.values), {'order':order_selected})
    new CollectionSpecies(document.querySelector('.species_selector .content'), dropDuplicates(df_birds.species_kr.values), {'order':order_selected})

    // console.log(document.querySelector('.family_selector .content').scrollTop)
    document.querySelector('.order_selector .content').scrollLeft=0
    document.querySelector('.family_selector .content').scrollLeft=0
    document.querySelector('.species_selector .content').scrollLeft=0

}





function actionFamilySelect(a_tag){


    order_selected = a_tag.querySelector("span").getAttribute('order')
    family_selected = a_tag.querySelector("span").getAttribute('family')


    new CollectionOrder(document.querySelector('.order_selector .content'), dropDuplicates(df_birds.order_kr.values), {'order':order_selected, 'family':family_selected})
    new CollectionFamily(document.querySelector('.family_selector .content'), dropDuplicates(df_birds.family_kr.values),  {'order':order_selected, 'family':family_selected})
    new CollectionSpecies(document.querySelector('.species_selector .content'), dropDuplicates(df_birds.species_kr.values),  {'family':family_selected})

    document.querySelector('.order_selector .content').scrollLeft=0
    document.querySelector('.family_selector .content').scrollLeft=0
    document.querySelector('.species_selector .content').scrollLeft=0

}


function actionSpeciesSelect(a_tag){


    order_selected = a_tag.querySelector("span").getAttribute('order')
    family_selected = a_tag.querySelector("span").getAttribute('family')
    species_selected = a_tag.querySelector("span").getAttribute('species')

    new CollectionOrder(document.querySelector('.order_selector .content'), dropDuplicates(df_birds.order_kr.values), {'order':order_selected, 'family':family_selected, "species": species_selected})
    new CollectionFamily(document.querySelector('.family_selector .content'), dropDuplicates(df_birds.family_kr.values),  {'order':order_selected, 'family':family_selected, "species": species_selected})
    new CollectionSpecies(document.querySelector('.species_selector .content'), dropDuplicates(df_birds.species_kr.values),  {'family':family_selected, "species": species_selected})

    document.querySelector('.order_selector .content').scrollLeft=0
    document.querySelector('.family_selector .content').scrollLeft=0
    document.querySelector('.species_selector .content').scrollLeft=0



    showSpeciesCollection(species_selected)

}

function showSpeciesCollection(species){



    bird = dfToDict(df_birds.query(df_birds["species_sn"].eq(species)))[0]
    species = bird.bid
    console.log(bird)
    new Species(document.querySelector(".species-selected .content"), bird)

    getItemBySpecies(species, renderSpeciesImage)

}


function renderSpeciesImage(images){

    new SpeciesImageSlider(document.querySelector(".species-selected .horizontal_div_slider .content"), images)
}


class Species extends Component {

    setup() {
        // this.$state = { items: this.$state };
        void(0)
    }

    template () {




        let bird = this.$state

        console.log(bird)
        //<div class="horizontal_div_slider"><img src="/static/images/square.PNG"></div>
        return `
        <div class="horizontal_div_slider">
            <div class="content"></div>
        </div>
        <div>
            종,과, 목: ${bird.species_kr} ${bird.family_kr} ${bird.order_kr}
        </div>
        <div>
            도래현황: ${bird.seasonal_spec}
        </div>
        <div>
            관찰등급: ${bird.observe_level} | 관찰빈도: ${bird.observe_level_kr}
        </div>
        <div>
            IUCN-${bird.iucn} | SITES- ${bird.sites} | 천연기념물: ${bird.nm}
        </div>

        `
    }

}


class SpeciesImageSlider extends Component {

    setup() {
        this.$state = { items: this.$state };
    }

    template () {

        const { items } = this.$state;


        console.log(items)
        let html = ''
        // let family_selected = this.$option.family

        if (items.length>0){


            for (let item of items){

                html += `
                    <div class="slider_item_wrapper">
                        <div class="square_button image_wrapper">
                            <img class="image" src="${item.object_storage_url}">
                            <div class="meta">
                                <div class="top-left" style='display:none'>TOP-LEFT</div>
                                <div class="top-right">
                                    <span><a onclick="showImageInformation(this.parentElement.parentElement.parentElement, '${item.object_key}')"><i class="icon_info fi fi-rr-info"></i></a></span>
                                    <span><a onclick="goToPost('${item.post_id}')"><i class="icon_info fi fi-rr-search-alt"></i></a></span>
                                    <span><a onclick="moveToBird('${item.object_key}', 'collection')"><i class="icon_info fi fi-rr-map-marker"></i></a></span>
                                </div>
                                <div class="bottom-left" style='display:none'>BOTTOM-LEFT</div>
                                <div class="bottom-right" style='display:none'>BOTTOM-RIGHT</div>
                            </div>
                        </div>





                    </div>
                `
            }

        }

        else {

                html += `
                    <div class="slider_item_wrapper">
                        <div class="square_button">
                            <span>NO DATA</span>
                        </div>
                    </div>
            `
        }

        return html

    }

}


// 도
class Collection extends Component {

    setup() {
        void(0)
    }

    template () {

        //<div class="horizontal_div_slider"><img src="/static/images/square.PNG"></div>
        return `
        <div class="order_selector block horizontal_div_slider">
            <div class="title"><span>Order Selector</span></div>
            <div class="content" id="order_selector_menu">
            </div>
        </div>
        <div class="family_selector block horizontal_div_slider">
            <div class="title"><span>Family Selector</span></div>
            <div class="content" id="family_selector_menu">
            </div>
        </div>
        <div class="species_selector block horizontal_div_slider">
            <div class="title"><span>Species Selector</span></div>
            <div class="content" id="species_selector_menu"></div>
        </div>
        <div class="species-selected block">
            <div class="title"><span>Species Information</span></div>
            <div class="content">
                <div class="horizontal_div_slider">{{Sound Horizontal slide with inifinite scroll}}</div>
                <div class="horizontal_div_slider">{{Species information}}</div>
            </div>

        </div>

        `
    }

}



class CollectionOrder extends Component {

    setup() {
        this.$state = { items: this.$state };
    }

    template () {

        const { items } = this.$state;

        let html_selected = ''
        let html_selected_not = ''

        let order_selected = this.$option.order
        // let family_selected = this.$option.family


        for (let item of items){

            let bird = df_birds.query(df_birds["order_kr"].eq(item))
            let order = bird.order_sn.values[0]

            if (order_selected != undefined && order == order_selected) {

                html_selected += `
                    <div>
                        <a onclick="actionOrderSelect(this,'${item}')">
                            <div class="slider_item_wrapper vertical_button selected">
                                <span order='${order}'>${item}</span>
                            </div>
                        </a>
                    </div>
                `
            }

            else {
                html_selected_not += `
                    <div>
                        <a onclick="actionOrderSelect(this,'${item}')">
                            <div class="slider_item_wrapper vertical_button">
                                <span order='${order}'>${item}</span>
                            </div>
                        </a>
                    </div>
                `
            }
        }
        let html = html_selected+html_selected_not
        return html

    }

}

class CollectionFamily extends Component {

    setup() {
        this.$state = { items: this.$state };

    }

    template () {

        const { items } = this.$state;
        console.log('CollectionFamily option:', this.$option)

        let order_selected = this.$option.order
        let family_selected = this.$option.family

        let html_prior = ''
        let html_selected = ''
        let html_selected_not = ''



        for (let item of items){


            let bird = df_birds.query(df_birds["family_kr"].eq(item))
            let order = bird.order_sn.values[0]
            let family = bird.family_sn.values[0]

            if (family_selected != undefined && family == family_selected) {

                html_prior += `
                    <div>
                        <a onclick="actionFamilySelect(this,'${item}')">
                            <div class="slider_item_wrapper vertical_button selected">
                                <span order='${order}' family='${family}'>${item}</span>
                            </div>
                        </a>
                    </div>
                `
            }

            else if (order_selected != undefined && order == order_selected) {

                html_selected += `
                    <div>
                        <a onclick="actionFamilySelect(this,'${item}')">
                            <div class="slider_item_wrapper vertical_button active">
                                <span order='${order}' family='${family}'>${item}</span>
                            </div>
                        </a>
                    </div>
                `
            }
            else {

                html_selected_not += `
                    <div>
                        <a onclick="actionFamilySelect(this,'${item}')">
                            <div class="slider_item_wrapper vertical_button">
                                <span order='${order}' family='${family}'>${item}</span>
                            </div>
                        </a>
                    </div>
                `
            }



        }

        let html = html_prior + html_selected+html_selected_not
        return html
    }
}

class CollectionSpecies extends Component {

    setup() {
        this.$state = { items: this.$state };
    }

    template () {

        const { items } = this.$state;


        let order_selected = this.$option.order
        let family_selected = this.$option.family
        let species_selected = this.$option.species

        let html_prior = ''
        let html_selected = ''
        let html_selected_not = ''



        for (let item of items){


            let bird = df_birds.query(df_birds["species_kr"].eq(item))
            let order = bird.order_sn.values[0]
            let family = bird.family_sn.values[0]
            let species = bird.species_sn.values[0]



            if (species_selected != undefined && species == species_selected) {

                html_prior += `
                    <div>
                        <a onclick="actionSpeciesSelect(this,'${item}')">
                            <div class="slider_item_wrapper vertical_button selected">
                                <span order='${order}' family='${family}' species='${species}'>${item}</span>
                            </div>
                        </a>
                    </div>
                `
            }

            else if (order_selected != undefined && order == order_selected) {

                html_selected += `
                    <div>
                        <a onclick="actionSpeciesSelect(this,'${item}')">
                            <div class="slider_item_wrapper vertical_button active">
                                <span order='${order}' family='${family}' species='${species}'>${item}</span>
                            </div>
                        </a>
                    </div>
                `
            }

            else if (family_selected != undefined && family == family_selected) {

                html_selected += `
                    <div>
                        <a onclick="actionSpeciesSelect(this,'${item}')">
                            <div class="slider_item_wrapper vertical_button active">
                                <span order='${order}' family='${family}' species='${species}'>${item}</span>
                            </div>
                        </a>
                    </div>
                `
            }

            else {

                html_selected_not += `
                    <div>
                        <a onclick="actionSpeciesSelect(this,'${item}')">
                            <div class="slider_item_wrapper vertical_button">
                                <span order='${order}' family='${family}' species='${species}'>${item}</span>
                            </div>
                        </a>
                    </div>
                `
            }

        }

        let html = html_prior + html_selected+html_selected_not
        return html

    }

}

