import './comments.css'
import { useQuery } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest' 
import Comment from './comment'
import CommentForm from './commentForm'

const Comments = ({id}) => {
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
             <CommentForm pinId={id} />
        </div>
    )
}

export default Comments