import './topBar.css'
import UserButton from '../userButton/userButton'
import Image from '../image/image'
import { useNavigate } from 'react-router'

const TopBar = () => {
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`search?search=${e.target.searchInput.value}`)
    }

    return (
        <div className='topBar'>
            {/* 搜索 */}
            <form onSubmit={handleSubmit} className='search'>
                <Image path="/general/search.svg" alt="" />
                <input type="text" name="searchInput" placeholder='搜索' />
            </form>
            {/* 用户按钮 */}
            <UserButton />
        </div>

    )
}

export default TopBar