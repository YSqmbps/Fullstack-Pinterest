import './comments.css'
import Image from '../image/image'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest' 

const Comments = ({id}) => {
    // emoji选择器
    const [open, setOpen] = useState(false)

    const {isPending, error, data} = useQuery({
        queryKey: ['comments'],
        queryFn: () => apiRequest.get(`/comments${id}`).then((res) => res.data),
    })
     if (isPending) return <div>Loading...</div>;
     if (error) return <div>Error: {error.message}</div>;
     if (!data) return <div>Comments not found</div>;
     console.log(data);


    return (
        <div className='comments'>
            <div className='commentList'>
                <span className='commentCount'>5 条评论</span>
            {/* 评论 */}
            <div className="comment">
                <Image path="/general/noAvatar.png" alt="" />
                <div className="commentContent">
                    <span className='commentUsername'>用户123</span>
                    <p className='commentText'>怎样的雨 怎样的夜，怎样的我能让你更想念，雨要多大，天要多黑 才能够有你的体贴，其实 没有我你分不清那些差别，结局还能多明显，别说你会难过，别说你想改变。</p>
                    <span className='commentTime'>1小时</span>
                </div>
            </div>
            <div className="comment">
                <Image path="/general/noAvatar.png" alt="" />
                <div className="commentContent">
                    <span className='commentUsername'>用户123</span>
                    <p className='commentText'>怎样的雨 怎样的夜，怎样的我能让你更想念，雨要多大，天要多黑 才能够有你的体贴，其实 没有我你分不清那些差别，结局还能多明显，别说你会难过，别说你想改变。</p>
                    <span className='commentTime'>1小时</span>
                </div>
            </div>
            <div className="comment">
                <Image path="/general/noAvatar.png" alt="" />
                <div className="commentContent">
                    <span className='commentUsername'>用户123</span>
                    <p className='commentText'>怎样的雨 怎样的夜，怎样的我能让你更想念，雨要多大，天要多黑 才能够有你的体贴，其实 没有我你分不清那些差别，结局还能多明显，别说你会难过，别说你想改变。</p>
                    <span className='commentTime'>1小时</span>
                </div>
            </div>
            <div className="comment">
                <Image path="/general/noAvatar.png" alt="" />
                <div className="commentContent">
                    <span className='commentUsername'>用户123</span>
                    <p className='commentText'>怎样的雨 怎样的夜，怎样的我能让你更想念，雨要多大，天要多黑 才能够有你的体贴，其实 没有我你分不清那些差别，结局还能多明显，别说你会难过，别说你想改变。</p>
                    <span className='commentTime'>1小时</span>
                </div>
            </div>
            <div className="comment">
                <Image path="/general/noAvatar.png" alt="" />
                <div className="commentContent">
                    <span className='commentUsername'>用户123</span>
                    <p className='commentText'>怎样的雨 怎样的夜，怎样的我能让你更想念，雨要多大，天要多黑 才能够有你的体贴，其实 没有我你分不清那些差别，结局还能多明显，别说你会难过，别说你想改变。</p>
                    <span className='commentTime'>1小时</span>
                </div>
            </div>

            <form className="commentForm">
                <input type="text" placeholder="添加一条评论吧" />
                <div className="emoji">
                    <div onClick={ () => setOpen(!open)}>😀</div>
                    { open && (
                        <div className="emojiPicker">
                        <EmojiPicker />
                    </div>
                    )}
                </div>
            </form>
            </div>
        </div>
    )
}

export default Comments