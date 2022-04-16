function initPost(post_id){


    div_post = document.querySelector("#post")
    removeAllChildNodes(div_post)
    getPost(post_id)

//    div_post.addEventListener('scroll', throttle(scrollEndShowComment, 200), {
//        capture: true,
//        passive: true
//    });

}


//function scrollEndShowComment(){
//
//    div_post = document.querySelector("#post_body")
//    clientHeight = document.documentElement.clientHeight
//    scrollHeight = div_post.scrollHeight;
//    scrollTop = div_post.scrollTop;
//
//    console.log(clientHeight, scrollTop, clientHeight+scrollTop, scrollHeight)
//
//    if(scrollTop + clientHeight >= scrollHeight ){
//        showComment()
//    }
//}


function getPost(post_id){

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

                post = req.response.data.post
                comments = req.response.data.comments


                new Post(document.querySelector("#post"), post)
                new PostComment(document.querySelector("#post_comments"), comments)

                div_post = document.querySelector("#post_body")
                clientHeight = document.documentElement.clientHeight
                scrollHeight = div_post.scrollHeight;

                // if (clientHeight > scrollHeight) showComment('35%')


            }
        }
    }
    data = JSON.stringify({'post_id':post_id})
    console.log(data)
    req.open('POST', '/posts/get/post')
    req.setRequestHeader("Content-type", "application/json")
    req.send(data)

}

function submitCommentPost(){

    comment_content = document.querySelector("#post_comment_input input").value
    post_id = document.querySelector("#post_header .post_id").innerHTML

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
                getPostComment(post_id)
            }
        }
    }
    data = JSON.stringify({'content':comment_content, 'post_id': post_id})
    req.open('POST', '/submitCommentPost')
    req.setRequestHeader("Content-type", "application/json")
    req.send(data)


}

function likePost(){

    // CLIENT SIDE 에서 LIKE 를 확인하고, LIKE하지 않은글만 실제 API가 호출되도록 한다

    post_id = document.querySelector("#post_header .post_id").innerHTML
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
                console.log(req.response)
                document.querySelector("#post_footer .like").style.color = 'red'
            }
        }
    }
    data = JSON.stringify({'post_id': post_id})
    req.open('POST', '/likePost')
    req.setRequestHeader("Content-type", "application/json")
    req.send(data)

}

function getPostComment(post_id){

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

                comments = req.response.data.comments

                post_comments = document.querySelector("#post_comments")
                new PostComment(post_comments, comments)
                console.log(window.scrollHeight)
                console.log(window.scrollTop)
                window.scrollTo(0, document.body.scrollHeight);

            }
        }
    }
    data = JSON.stringify({'post_id':post_id})
    req.open('POST', '/posts/get/post-comment')
    req.setRequestHeader("Content-type", "application/json")
    req.send(data)

}


function foldComment(){


//    post_comments = document.getElementById("post_comments")
//    if (post_comments.style.maxHeight== '0%' || post_comments.style.maxHeight== ''){
//        showComment()
//    }
//    else {
//        hideComment()
//    }

}


function showComment(percent='75%'){
    document.getElementById("post_comments").style.maxHeight=percent
}

function hideComment(){
    document.getElementById("post_comments").style.maxHeight='0%'
}






class Post extends Component {

    setup(){
        this.$state = { item: this.$state };
    }

    template () {
        const { item } = this.$state;



        return `
        <div id="post_header">
            <div class="row upper">
                <span class="category">[${item.category}]</span>
                <span class="title">${item.title}</span>
                <span class="post_id">${item.post_id}</span>
                <span class="comment">[0]</span>

            </div>
            <div class="row lower">
                <span class="user_name">by ${item.user_id}</span>
                <span class="view">조회수: ${item.view}</span>
                <span class="timestamp">작성시각: ${item.publish_timestamp}</span>
            </div>
        </div>
        <div id="post_body">
            <span class="title">${item.content}</span>
        </div>
        <div id="post_footer">
            <span class="left">
                <span class='like'><a onclick="likePost()"><i class="icon fi fi-rr-thumbs-up"></i></a></span>
                <span><a><i class="icon fi fi-rr-eye-crossed"></i></a></span>
                <span><a><i class="icon fi fi-rr-trash"></i></a></span>
                <span><a><i class="icon fi fi-rr-info"></i></a></span>
                <span><a><i class="icon fi fi-rr-compress-alt"></i></a></span>
                <span><a><i class="icon fi fi-rr-expand-arrows-alt"></i></a></span>
            </span>
            <span class="right">
                <span><a onclick="foldComment()"><i class="icon fi fi-rr-comment-alt"></i></a></span>

            </span>
        </div>
        <div id="post_comments">
        </div>
        <div id="post_comment_input">
            <input type="text" placeholder="매너부탁">
            <button id="editor_submit" onclick="submitCommentPost()">submit</button>
        </div>
        `
    }
}





class PostComment extends Component {
    setup(){
        this.$state = { items: this.$state };
    }

    template () {
        const { items } = this.$state;

        // 댓글 수 업데이트
        document.querySelector("#post_header .comment").innerHTML = '['+items.length+']'

        // 작성된 댓글내용 지우기
        document.querySelector("#post_comment_input input").value=''


        return `
        ${items.map(item => `
            <div class="comment">
                <div class="comment_header">
                    <span class="left">
                        <span class="writer"><a onclick=toggle('user','${item.user_id}')>${item.user_id}</a></span>
                        <span class="timestamp">${item.publish_timestamp}</span>
                    </span>
                    <span class="right">
                        <span><a><i class="icon fi fi-rr-thumbs-up"></i></a></span>
                        <span><a><i class="icon fi fi-rr-trash"></i></a></span>
                    </span>
                </div>
                <div class="comment_body">
                    <span>${item.content}</span>
                </div>
            </div>
        `).join('')}
        `
    }
}


