// import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { tweetsData } from './data.js';



document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.comment){
        handleCommentClick(e.target.dataset.comment)
    }
    else if(e.target.dataset.replylikes){
        handleReplyLikeClick(e.target.dataset.replylikes )
    }
    else if(e.target.dataset.replyretweets){
        handleReplyRetweetClick(e.target.dataset.replyretweets)
    }
    else if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
    else if(e.target.dataset.replydelete){
        handleReplyDeleteClick(e.target.dataset.replydelete)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()

    if (targetTweetObj.repliesOpen){
        document.getElementById(`replies-${tweetId}`).classList.remove('hidden')
        document.getElementById(`reply-${tweetId}`).classList.remove('hidden2')
        }
}

function handleRetweetClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    
    if (targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++ 
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()

    if (targetTweetObj.repliesOpen){
        document.getElementById(`replies-${tweetId}`).classList.remove('hidden')
        document.getElementById(`reply-${tweetId}`).classList.remove('hidden2')
       }

}


function handleDeleteClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
    return tweet.uuid === tweetId
    })[0]
    targetTweetObj.deletedTweet = true
    // const indexToRemove = tweetsData.findIndex(tweet => tweet.uuid === tweetId)
    // if (indexToRemove !== -1){
    //     tweetsData.splice(indexToRemove, 1)
    // }
    render()
    
}

function handleReplyRetweetClick(replyId){
    let foundItem = null 
    let parentTweetId = null
        tweetsData.forEach(function(tweet){
        const targetReplyObj = tweet.replies.filter(function(reply){
                return reply.uuid === replyId
            })
            if (targetReplyObj.length > 0){
                foundItem = targetReplyObj[0]
                parentTweetId = tweet.uuid
            }
        })

            if(foundItem){
        if(foundItem.isRetweeted){
            foundItem.retweets--
        }
            
        else{
            foundItem.retweets++
        }
        foundItem.isRetweeted = !foundItem.isRetweeted
        render()


        if (parentTweetId) {
            const parentTweet = tweetsData.find(tweet => tweet.uuid === parentTweetId)
            if (parentTweet && parentTweet.repliesOpen) {
                document.getElementById(`replies-${parentTweetId}`).classList.remove('hidden')
                document.getElementById(`reply-${parentTweetId}`).classList.remove('hidden2')
            }
       
        }
    }
}

function handleReplyDeleteClick(replyId) {
    let parentTweetId = null

    tweetsData.forEach(function(tweet) {

        const replyIndex = tweet.replies.findIndex(function(reply) {
            return reply.uuid === replyId
        })
        
   
        if (replyIndex !== -1) {
            parentTweetId = tweet.uuid
            
           
            tweet.replies.splice(replyIndex, 1)
            

            if (tweet.replies.length === 0) {
                tweet.hasReplies = false
            }
        }
    })

    render()


    if (parentTweetId) {
        const parentTweet = tweetsData.find(tweet => tweet.uuid === parentTweetId)
        if (parentTweet && parentTweet.repliesOpen) {
            document.getElementById(`replies-${parentTweetId}`).classList.remove('hidden')
            document.getElementById(`reply-${parentTweetId}`).classList.remove('hidden2')
        }
    }
}

function handleReplyLikeClick(replyId){
    let foundItem = null
    let parentTweetId = null

    tweetsData.forEach(function(tweet){
        const filteredReplies = tweet.replies.filter(function(reply){
            return reply.uuid === replyId
        })
        if (filteredReplies.length > 0){
            foundItem = filteredReplies[0]
            parentTweetId = tweet.uuid  
        }
    })

    if(foundItem){
        if (foundItem.isLiked){
            foundItem.likes--
        }
        else{
            foundItem.likes++ 
        }
        foundItem.isLiked = !foundItem.isLiked
        
        render()
        
        if (parentTweetId) {
            const parentTweet = tweetsData.find(tweet => tweet.uuid === parentTweetId)
            if (parentTweet && parentTweet.repliesOpen) {
                document.getElementById(`replies-${parentTweetId}`).classList.remove('hidden')
                document.getElementById(`reply-${parentTweetId}`).classList.remove('hidden2')
            }
        }
    }
}


function handleReplyClick(tweetId){
const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    targetTweetObj.repliesOpen = !targetTweetObj.repliesOpen

        document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
        document.getElementById(`reply-${tweetId}`).classList.toggle('hidden2')
}


function handleCommentClick(commentId){
    const replyInput = document.getElementById(`comment-${commentId}`)
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === commentId
        })[0]
        if(replyInput.value){
            targetTweetObj.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0, 
            retweets: 0,
            tweetText: replyInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            hasReplies: false,
            uuid: uuidv4(),
            parentId: commentId
        })
        targetTweetObj.hasReplies = true

    render()
    replyInput.value = ''

   

    if (targetTweetObj.repliesOpen){
        document.getElementById(`replies-${commentId}`).classList.remove('hidden')
        document.getElementById(`reply-${commentId}`).classList.remove('hidden2')
       }

    }
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0, 
            retweets: 0,
            tweetText: tweetInput.value,  
            replies: [],
            isLiked: false,
            isRetweeted: false,
            hasReplies: false,
            deletedTweet: false,
            repliesOpen: false,
            deletedReply: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let hasReplies =  ''

        if(tweet.hasReplies){
            hasReplies = 'makeshorter'
        }

        let removeTweetClass = ''

        if(tweet.deletedTweet){
            removeTweetClass = 'removeTweet'
        }

        let replyTextBox = `
    <div class="replyArea" >
            <textarea 
            placeholder="Post your reply" 
            id="comment-${tweet.uuid}"
            class="reply-input ${hasReplies}"></textarea>
            <button id='reply-btn'class=reply-btn data-comment="${tweet.uuid}">Reply</button>
    </div>`
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                let likeReplyIconClass = ''
                let retweetReplyIconClass = ''

                if(reply.isLiked){
                    likeReplyIconClass = 'liked'
                }

                if(reply.isRetweeted){
                    retweetReplyIconClass = 'retweeted'
                }

                let removeReplyClass = ' '

                if(reply.deletedReply){
                    removeReplyClass ='hidden'
                }
                repliesHtml+=`
<div class="tweet-reply ${removeReplyClass}">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            <div class="reply-details">
                <span class="reply-detail">
                    <i class="fa-solid fa-heart ${likeReplyIconClass}"
                    data-replylikes="${reply.uuid}"
                    ></i>
                    ${reply.likes}
                </span>
                <span class=reply-detail">
                    <i class="fa-solid fa-retweet ${retweetReplyIconClass}"
                    data-replyretweets="${reply.uuid}"
                    ></i>
                    ${reply.retweets}
                </span>
                <span class="reply-detail">
                <i class="fa-solid fa-trash"
                data-replydelete="${reply.uuid}"
                ></i>
                </span>
            </div>
        </div>
    </div>
</div>
` 
                
            })
        }  
        feedHtml += `
<div class="tweet ${removeTweetClass}">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-trash"
                data-delete="${tweet.uuid}"
                ></i>
                </span>
            </div>  
        </div>            
    </div>
    <div class="hidden2" id='reply-${tweet.uuid}'>
    ${replyTextBox}
    </div>
    <div class='hidden' id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()


