import './postPage.css'
import Image from '../../components/image/image'
import PostInteractions from '../../components/postInteractions/postInteractions'
import { Link } from 'react-router'
import Comments from '../../components/comments/comments'

const postPage = () => {
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
                    <Image path="/pins/pin1.jpeg" alt="" w={736} />
                </div>
                <div className='postDetails'>
                    <PostInteractions />
                    <Link to="/limulu" className='postUser'>
                        <Image path="/general/noAvatar.png" alt=""/>
                        <span>利姆露</span>
                    </Link>
                    <Comments />
                </div>
            </div>
        </div>
    )
}

export default postPage