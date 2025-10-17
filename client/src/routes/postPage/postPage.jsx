import './postPage.css'
import Image from '../../components/image/image'
import PostInteractions from '../../components/postInteractions/postInteractions'
import { Link, useParams } from 'react-router'
import Comments from '../../components/comments/comments'
import { useQuery } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest'

const PostPage = () => {

    const {id} = useParams()
    
    const { isPending,error,data } = useQuery({
        queryKey: ['pin', id],
        queryFn: () => apiRequest.get(`/pins/${id}`).then(res => res.data),
    });

        if (isPending) return <div>Loading...</div>
        if (error) return <div>Error: {error.message}</div>
        if (!data) return <div>No data found</div>

    return (
        <div className='postPage'>
            <svg 
                height="24"  // 增加尺寸
                viewBox='0 0 24 24'
                width="24"   // 增加尺寸
                style={{ cursor: 'pointer'}}
                fill="currentColor"  // 使用当前文本颜色
                stroke="currentColor"  // 添加描边颜色
                strokeWidth="1"  // 添加描边宽度使箭头更粗
            >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
            </svg>
            <div className='postContainer'>
                <div className='postImg'>
                    <Image src={data.media} alt="" w={736} />
                </div>
                <div className='postDetails'>
                    <PostInteractions />
                    <Link to={`/${data.user.username}`} className='postUser'>
                        <Image src={data.user.img || "/general/noAvatar.png"} alt=""/>
                        <span>{data.user.username}</span>
                    </Link>
                    <Comments id={data._id} />
                </div>
            </div>
        </div>
    )
}

export default PostPage
