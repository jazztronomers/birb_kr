const CONTENTS_PER_PAGE= 30


function initContents(){
    getBoard(CONTENTS_PER_PAGE, 1, [])
}


// =======================================================================
// T E M P L A T E
// =======================================================================


CONTENTS = []



function getBoard(row_per_page, current_page, filter){



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

                response_data = req.response.data
                new BoardHeader(document.querySelector("#board_contents"), response_data)
                // new BoardHeader(document.querySelector("#board_contents"), response_data)

            }
        }
    }

    data = JSON.stringify({'row_per_page':row_per_page, 'current_page': current_page, 'filter':filter})
    req.open('POST', '/getBoard')
    req.setRequestHeader("Content-type", "application/json")
    req.send(data)


}


class BoardHeader extends Component {

    setup(){
        this.$state = { items: this.$state };
    }

    template () {
        const { items } = this.$state;

        return `
        ${items.map(item => `
            <div class="board_row">
                <div class="header">
                    <span class="category">[${item.category}]</span>
                    <span class="title"><a onclick=toggle('post','${item.post_id}')>${item.title}</a></span>
                    <span class="comment_count">[${item.comment_count}]</span>
                </div>
                <div class="body">
                    <span class="left">
                        <span class="writer">글쓴이: <a onclick=toggle('user','${item.user_id}')>${item.user_id}</a></span>
                        <span class="view">조회수: ${item.view}</span>
                        <span class="recomm">추천수: ${item.recomm.length}</span>
                    </span>
                    <span class="right">
                        <span class="timestamp">${item.publish_timestamp}</span>
                    </span>
                </div>
            </div>
        `).join('')}
        `
    }
}


//<div class="board_row">
//    <div class="header">
//
//        <span class="category">탐조기</span>
//        <span class="title"><a>홍제천 탐조기</a></span>
//
//    </div>
//    <div class="body">
//        <span class="left">
//            <span class="writer">글쓴이: jazzbirb</span>
//            <span class="view">조회수: 100</span>
//            <span class="recomm">추천수: 3</span>
//        </span>
//        <span class="right">
//            <span class="timestamp">2020-01-01</span>
//        </span>
//    </div>
//</div>