function initCollection(){

    new Collection(document.querySelector('#collection'))
    new CollectionOrder(document.querySelector('.order_selector .content'), dropDuplicates(df_birds.order_kr.values))
    const family_selector = document.querySelector(".horizontal_div_slider .content")
    family_selector.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        family_selector.scrollLeft += evt.deltaY;
    });

}



function setSpeciesBasedOnOrder(order_name){

    list =''
    for (bird of BIRD.birds_list){
        if (order_name==bird.order_kr){
            list+=`<div>${bird.species_kr}</div>`
        }
    }



    document.querySelector(".species_list").querySelector(".content").innerHTML=list

}

// 도
class Collection extends Component {

    setup() {
        void(0)
    }

    template () {


        return `
        <div class="species-selected block">
            <div class="title"><span>Selected Species</span></div>
            <div class="content">
                <div class="horizontal_div_slider">{{Photo Horizontal slide with inifinite scroll}}</div>
                <div class="horizontal_div_slider">{{Sound Horizontal slide with inifinite scroll}}</div>
                <div class="horizontal_div_slider">{{Species information}}</div>
            </div>

        </div>
        <div class="order_selector block horizontal_div_slider">
            <div class="title"><span>Order Selector</span></div>
            <div class="content">
            </div>
        </div>
        <div class="species_list block">
            <div class="title"><span>species list</span></div>
            <div class="content"></div>
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

        return `
        ${items.map(item => `
            <div>
                <a onclick="setSpeciesBasedOnOrder('${item}')">
                    <div class="slider_item_wrapper">
                        <span>${item}</span>
                    </div>
                </a>
            </div>
        `).join('')}

        `
    }

}
