import './comments.css'
import Image from '../image/image'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest' 
import Comment from './comment'

const Comments = ({id}) => {
    // emoji选择器
    const [open, setOpen] = useState(false)

    const {isPending, error, data} = useQuery({
        queryKey: ['comments',id],
        queryFn: () => apiRequest.get(`/comments/${id}`).then((res) => res.data),
    })
     if (isPending) return <div>Loading...</div>;
     if (error) return <div>Error: {error.message}</div>;
     if (!data) return <div>Comments not found</div>;
     console.log(data);


    return (
        <div className='comments'>
            <div className='commentList'>
                <span className='commentCount'>{data.length===0 ? '暂无评论' : `${data.length} 条评论`}</span>
            </div>
            {/* 评论 */}
             {data.map((comment) => (
                <Comment key={comment._id} comment={comment} />
             ))}

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
    )
}

export default Comments