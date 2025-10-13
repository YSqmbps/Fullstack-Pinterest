import './topBar.css'
import UserButton from '../userButton/userButton'
import Image from '../image/image'

const TopBar = () => {
    return (
        <div className='topBar'>
            {/* 搜索 */}
            <div className='search'>
                <Image path="/general/search.svg" alt="" />
                <input type="text" placeholder='搜索' />
            </div>
            {/* 用户按钮 */}
            <UserButton />
        </div>

    )
}

export default TopBar