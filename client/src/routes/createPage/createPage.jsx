import './createPage.css'
import Image from '../../components/image/image'

const CreatePage = () => {
    return (
        <div className='createPage'>
            <div className="createTop">
                <h1>创建图片</h1>
                <button>发布</button>
            </div>
            <div className="createBottom">
                <div className="upload">
                    <div className="uploadTitle">
                        <Image path="/general/upload.svg" alt="" />
                        <span>选择一个文件或拖放到这里</span>
                    </div>
                    <div className="uploadInfo">
                        我们建议少使用高质量的超过20 MB的jpg文件或大于200 MB的.mp4文件
                    </div>
                </div>
                <form  className='createForm' action="">
                    <div className="createFormItem">
                        <label htmlFor="title">标题</label>
                        <input 
                            type="text"
                            placeholder='添加一个标题'
                            name="title"
                            id="title"
                        />
                    </div>
                    <div className="createFormItem">
                        <label htmlFor="description">描述</label>
                        <textarea
                            rows={6}
                            type="text"
                            placeholder='添加一个详细的描述'
                            name="description"
                            id="description"
                        />
                    </div>
                    <div className="createFormItem">
                        <label htmlFor="link">链接</label>
                        <input 
                            type="text"
                            placeholder='添加一个链接'
                            name="link"
                            id="link"
                        />
                    </div>
                    <div className="createFormItem">
                        <label htmlFor="board">模板</label>
                        <select name="board" id="board">
                            <option>选择一个模板</option>
                            <option value="1">模板1</option>
                            <option value="2">模板2</option>
                            <option value="3">模板3</option>
                        </select>
                    </div>
                    {/* tags */}
                    <div className="createFormItem">
                        <label htmlFor="tags">标签</label>
                        <input 
                            type="text"
                            placeholder='添加一些标签'
                            name="tags"
                            id="tags"
                        />
                        <small>不用担心，大家不会看到这些标签</small>
                    </div>
                </form>


            </div>
        </div>
    )
}

export default CreatePage