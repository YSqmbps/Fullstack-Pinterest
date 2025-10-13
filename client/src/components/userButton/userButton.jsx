import './userButton.css'
import { useState,useEffect,useRef } from 'react'
import Image from '../image/image'
const UserButton = () => {
    // 下拉菜单状态
    const [open, setOpen] = useState(false)
    // 临时状态
    const currentUser = true
    // 创建引用，用于判断点击是否在下拉菜单或按钮内部
    const userButtonRef = useRef(null)
    const userOptionsRef = useRef(null)

    // 添加全局点击事件监听
    useEffect(()=>{
        const handleClickOutside = (e) => {
            // 如果菜单是打开的，并且点击目标不在菜单或按钮内部，则关闭菜单
            if(open && userButtonRef.current && userOptionsRef.current) {
                if(!userButtonRef.current.contains(e.target) && 
                !userOptionsRef.current.contains(e.target)) 
                {
                    setOpen(false)
                }
            }
        }
        // 给文档添加点击事件监听
        document.addEventListener('click',handleClickOutside)
        // 组件卸载时移除事件监听
        return () => {
            document.removeEventListener('click',handleClickOutside)
        }
    },[open])


    return currentUser ? (
        <div className='userButton'>
            <Image path="/general/noAvatar.png" alt=""  ref={userButtonRef} />
            <Image
             onClick={() => setOpen((prev) => !prev)} 
             path="/general/arrow.svg"
             alt="" 
             className='arrow'
             ref={userButtonRef}
             />
             {/* 下拉菜单 */}
             { open && (
                <div className='userOptions' ref={userOptionsRef}>
                    <div className='userOption'>个人简介</div>
                    <div className='userOption'>设置</div>
                    <div className='userOption'>退出登录</div>
                </div>
             )}
        </div>
    ):(
        <a href="/" className='loginLink'>
            登录 / 注册
        </a>
    )
}

export default UserButton