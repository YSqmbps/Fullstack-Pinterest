import './gallery.css'
import GalleryItem from '../galleryItem/galleryItem.jsx'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'

const fetchPins = async ({pageParam , search, userId, boardId}) => {
     
// 创建 URL 参数对象
  const params = new URLSearchParams();
  params
.append('cursor', pageParam); // 必传参数
  if (search) params.append('search', search); // 有值才添加
  if (userId) params.append('userId', userId); // 有值才添加
  if (boardId) params.append('boardId', boardId); // 有值才添加

  // 拼接 URL
  const res = await axios.get(
    `${import.meta.env.VITE_API_ENDPOINT}/pins?${params.toString()}`
  );
  return res.data;
}

const Gallery = ({search, userId, boardId}) => {

    const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
        queryKey: ['pins', search, boardId],
        queryFn: ({pageParam = 0}) => fetchPins({pageParam, search, userId, boardId}),
        initialPageParam: 0,
        getNextPageParam: (lastPage,pages) => lastPage.nextCursor
    })

    if (status === 'error') return <div>Something went wrong</div>

    if (status === 'pending') return <div>Loading...</div>

    
    const allPins = data?.pages.flatMap(page => page.pins) || [];

    return (
        <InfiniteScroll
            dataLength={allPins.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<h4>加载更多图片中...</h4>}
            endMessage={<h3>没有更多图片了</h3>}
        >
        <div className='gallery'>
            {
                allPins?.map((item) => (
                    <GalleryItem key={item._id} item={item} />
                ))
            }
        </div>
        </InfiniteScroll>
    )
}

export default Gallery