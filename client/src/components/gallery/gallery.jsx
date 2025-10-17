import './gallery.css'
import GalleryItem from '../galleryItem/galleryItem.jsx'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'

const fetchPins = async ({pageParam , search, userId, boardId}) => {
    const res = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/pins?cursor=${
        pageParam
    }&search=${search || ""}
        &userId=${userId || ""}
        &boardId=${boardId || ""}
        
    `);
    return res.data
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

    console.log( userId);

    console.log(data);
    
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