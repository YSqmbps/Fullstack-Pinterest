import "./comments.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
import Comment from "./comment";
import CommentForm from "./commentForm";
import { useRef,useEffect } from "react";

const Comments = ({ id: pinId }) => {
  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending, 
    error, 
     } = useInfiniteQuery({
    queryKey: ["comments", pinId],
    queryFn: ({ pageParam = 1 }) => apiRequest.get(`/comments/${pinId}?page=${pageParam}`).then((res) => res.data),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    }
  });

  // 滚动加载监听
  const observerTarget = useRef(null);
  useEffect(() => {
    if (!observerTarget.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage&&!isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);


  if (isPending) return <div>加载评论中...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>没有发现评论</div>;
  console.log(data);

  // 扁平化评论数组
  const allComments = data?.pages.flatMap((page) => page.comments || []);

  return (
    <div className="comments">
      <div className="commentCount">
        {allComments.length === 0 ? "暂无评论" : `${allComments.length} 条评论`}
      </div>

      <div className="commentList">
        {/* 评论 */}
        {allComments.map((comment) => (
          <Comment key={comment._id} comment={comment} pinId={pinId} />
        ))}
      </div>
        {/* 加载更多评论 */}
        {hasNextPage  && (
          <div ref={observerTarget} className="loadMore">
            {isFetchingNextPage ? "加载更多评论中..." : "滚动加载更多"}
          </div>
        )}
      <CommentForm pinId={pinId} />
    </div>
  );
};

export default Comments;
