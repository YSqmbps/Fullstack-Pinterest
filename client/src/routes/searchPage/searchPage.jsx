import Gallery from '../../components/gallery/gallery'
import { useSearchParams } from 'react-router'

import './searchPage.css'

const SearchPage = () => {

    let [searchParams] = useSearchParams();
    const search = searchParams.get('search');
    const boardId = searchParams.get('boardId');

    return (
 <div className="searchPage">
      {!search && !boardId && (
        <div className="searchHint">请输入搜索内容</div>
      )}
      <Gallery search={search} boardId={boardId} />
    </div>    )       
}

export default SearchPage