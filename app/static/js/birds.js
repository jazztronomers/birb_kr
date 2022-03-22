birds_list = null // [{}]
birds_dict = null // {'bid' : {}...}
df_birds = null
//
//function getBirds() {
//    var req = new XMLHttpRequest()
//    req.responseType = 'json';
//    req.onreadystatechange = function()
//    {
//        if (req.readyState == 4)
//        {
//            if (req.status != 200)
//            {
//                alert(''+req.status+req.response)
//            }
//            else
//            {
//
//
//                // danfo dataframe 을 유일한 데이터로
//                birds_list = req.response.data.birds_list
//
//                df_birds = new dfd.DataFrame(req.response.data.birds_list)
//
//
//                birds_list_div = document.getElementById('birds_list')
//                for (let bird of birds_list){
//
//                    let parent = document.getElementById('birds_list').children
//                    let idArray = Array.from(parent).map(x => x.id);
//
//
//                    if(! idArray.includes(bird.order_kr)){
//                        items = document.createElement('div')
//                        items.setAttribute("class", "grid-items")
//                        items.setAttribute("id", bird.order_kr)
//                        items.innerHTML = bird.order_kr
//                        birds_list_div.appendChild(items)
//
//                    }
//
//                    li = document.createElement('li')
//
//                    checkbox = document.createElement('input')
//                    checkbox.setAttribute("class", 'checkbox_bird')
//                    checkbox.setAttribute("id", 'checkbox_bird_'+bird.bid)
//                    checkbox.setAttribute("type", "checkbox")
//                    checkbox.setAttribute("onclick", "toggleSpecies(this.bid, this.species_kr)")
//                    checkbox.bid = bird.bid
//                    checkbox.species_kr = bird.species_kr
//                    a = document.createElement('a')
//                    a.innerHTML = bird.species_kr
//
//                    li.appendChild(checkbox)
//                    li.appendChild(a)
//
//                    item = document.getElementById(bird.order_kr)
//                    item.appendChild(li)
//
//                    // console.log(bird.species_kr, bird.order_kr, idArray.includes(bird.order_kr))
//
//
//                }
//
//
//
//            }
//        }
//    }
//
//
//
//    req.open('POST', '/getBirds')
//    req.setRequestHeader("Content-type", "application/json")
//    req.send()
//}



function getCollection(){

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
                    console.log(req.response.data)
                    birds_seen = document.getElementById("birds_seen")
                    select_year = document.getElementById('select_year')
                    for (let year_data of req.response.data){

                        birds_seen_year = document.createElement("div")
                        birds_seen_year.setAttribute("class", "birds_seen_year flex-items")
                        birds_seen_year.setAttribute("id", "birds_seen_"+year_data.year )
                        birds_seen_year.innerHTML = year_data.year
                        birds_seen.appendChild(birds_seen_year)

                        box = document.getElementById("birds_seen_"+  year_data.year)

                        console.log("here", year_data.bids)
                        for (let bid of year_data.bids){

                            species_kr = df_birds.query(df_birds['bid'].eq(bid)).species_kr.values[0]

                            li = document.createElement("li")
                            li.setAttribute("class","seen-bird")
                            li.setAttribute("bid", bid)
                            li.setAttribute("species_kr", species_kr)
                            li.setAttribute("year", year_data.year)
                            li.innerHTML=species_kr
                            box.appendChild(li)


                        }

                        option_year = document.createElement("option")
                        option_year.value=year_data.year
                        option_year.innerHTML=year_data.year
                        select_year.appendChild(option_year)
                    }

                }
            }
        }



    req.open('POST', '/getCollection.do')
    req.setRequestHeader("Content-type", "application/json")
    req.send()

}

function setCollection(){


    confirmation = confirm("개인도감 데이터가 현재 수정하신 기준으로 덮어쓰기 됩니다, 계속 하시겠습니까?")
    if (confirmation) {

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

                }
            }
        }

        birds_seen = document.querySelectorAll(".birds_seen_year")


        data = []
        for (let seen_year of birds_seen){


            label_year = seen_year.id.split("_").pop()
            list_data = []
            for (let species of seen_year.children){
                list_data.push(species.getAttribute('bid'))
            }
            data.push({"year": label_year, "bids":list_data})
        }

        collection = JSON.stringify({"collection":data})


        req.open('POST', '/setCollection.do')
        req.setRequestHeader("Content-type", "application/json")
        req.send(collection)
    }
}


function changeSelectedYear(selected_year){

    console.log(selected_year)
    box = document.getElementById("birds_seen_"+selected_year)


    checkboxes = document.querySelectorAll('.checkbox_bird')
    console.log(checkboxes)
    for (checkbox of checkboxes){
        checkbox.checked=false
    }

    for(let bird of box.querySelectorAll(".seen-bird")){
        console.log("checkbox_bird_"+bird.getAttribute('bid'))
        document.getElementById("checkbox_bird_"+bird.getAttribute('bid')).checked=true

    }

}



function toggleSpecies(bid, species_kr){

    selected_year = document.getElementById('select_year').value
    box = document.getElementById("birds_seen_"+selected_year)

    let parent = document.getElementById("birds_seen_"+selected_year).children
    let idArray = Array.from(parent).map(x => x.getAttribute('bid'));

    console.log("currently selected..:", selected_year, bid, species_kr)
    console.log(idArray)

    // 없으면 추가
    if(!idArray.includes(bid)){

        li = document.createElement("li")
        li.setAttribute("class","seen-bird")
        li.setAttribute("bid", bid)
        li.setAttribute("species_kr", species_kr)
        li.setAttribute("year", selected_year)
        li.innerHTML=species_kr
        box.appendChild(li)
    }

    // 있으면 삭
    else {
        for(let bird of box.querySelectorAll(".seen-bird")){
            if(bird.getAttribute('bid') == bid){
                bird.remove()
                break;
            }

        }

    }
}