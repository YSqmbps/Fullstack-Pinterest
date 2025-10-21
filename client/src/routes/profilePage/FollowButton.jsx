import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import apiRequest from '../../utils/apiRequest';
import NotificationModal from '../../components/modal/NotificationModal';

const followUser = async (username) => {
    const res = await apiRequest.post(`/users/follow/${username}`);
    return res.data;
};

const FollowButton = ({ isFollowing, username }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation(); // 获取当前位置
    
    // 检查用户是否已登录
    const isLoggedIn = !!user;

    const mutation = useMutation({
        mutationFn: followUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', username] });
        },
        onError: (err) => {
            // 处理未登录错误
            if (err.response?.status === 401) {
                setShowLoginModal(true);
            }
        }
    });

    const handleButtonClick = () => {
        if (isLoggedIn) {
            // 用户已登录，执行关注/取消关注操作
            mutation.mutate(username);
        } else {
            // 用户未登录，直接显示登录提示弹窗
            setShowLoginModal(true);
        }
    };

    const handleLoginRedirect = () => {
        setShowLoginModal(false);
        // 保存当前路径作为重定向目标
        navigate('/auth', { state: { redirectUrl: location.pathname } });
    };

    return (
        <>
            <button
                onClick={handleButtonClick}
                disabled={mutation.isPending}
                style={{
                    backgroundColor:'#ff0000ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '24px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    opacity: isLoggedIn ? 1 : 0.7,
                    transition: 'all 0.2s'
                }}
            >
                {mutation.isPending 
                    ? '处理中...' 
                    : isLoggedIn 
                        ? (isFollowing ? '取消关注' : '关注') 
                        : '关注'}
            </button>

            {/* 使用可复用的通知弹窗组件 */}
            <NotificationModal
                isOpen={showLoginModal}
                title="请先登录"
                message="登录后才能关注其他用户"
                primaryButtonText="去登录"
                secondaryButtonText="取消"
                onPrimaryClick={handleLoginRedirect}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    );
};

export default FollowButton;