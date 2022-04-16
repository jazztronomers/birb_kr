const BOARD_ROW_PER_PAGE = 60 // GET BOARD(POSTS) FROM SERVER PER REQUEST
let board_api_idle = true
let board_has_next = true
let board_scroll_has_next = true
let board_data = []
let board_last_batch = []



function initBoard(){
    getBoardData(BOARD_ROW_PER_PAGE, 1, [], '2099-12-31', renderBoard)
}

function renderBoard(last_batch){
    new BoardBody(document.querySelector("#board_body"), last_batch)
}

function getBoardData(row_per_page, current_page, species, to_date, callback){

    if (board_api_idle == true){
        board_api_idle = false

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

                    board_last_batch = req.response.data
                    board_has_next = req.response.has_next
                    board_data = board_data.concat(last_batch)

                    console.log(' * board has next', board_has_next)
                    console.log(' * response data size', board_last_batch.length)
                    console.log(' * current board data size', board_data.length)

                    board_api_idle = true

                    if(callback!=null){
                        callback(board_last_batch)
                    }


                }
            }
        }

        data = JSON.stringify({'row_per_page':row_per_page, 'current_page': current_page, 'species':species, 'to_date':to_date})
        req.open('POST', '/board/get')
        req.setRequestHeader("Content-type", "application/json")
        req.send(data)
    }

}


class BoardBody extends ComponentAppend {

    setup(){
        this.$state = { items: this.$state };
    }

    template () {
        const { items } = this.$state;

        let i=0
        let html = ''

        for (let item of items){



            html+=`
                <div class="board_row row">
                    <div class="header">
                        <span class="left">
                            <span class="category">[${item.category}]</span>
                            <span class="title"><a onclick=toggle('post','${item.post_id}')>${item.title}</a></span>
                            <span class="comment_count">[${item.comment_count}]</span>
                        </span>
            `
            if (item.user_id == user_id){
                html+=`
                <span class="right">
                    <a><i class="fi fi-rr-eye-crossed"></i></a>
                    <a><i class="icon fi fi-rr-trash"></i></a>
                </span>
                `
            }
            html+=`
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
            `
            i+=1
            if (i%20==0){
                html += getAdHorizontal()
            }
        }

        return html
    }
}


