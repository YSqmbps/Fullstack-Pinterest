import Image from "../image/image"
import './postInteractions.css'

const postInteractions = () => {
    return (
        <div className='postInteractions'>
            <div className='interactionIcons'>
                <Image path="/general/react.svg" alt=""/>
                273
                <Image path="/general/share.svg" alt=""/>
                <Image path="/general/more.svg" alt=""/>
            </div>
            <button>保存</button>
        </div>
    )
}

export default postInteractions