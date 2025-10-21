import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import apiRequest from '../../utils/apiRequest';

const followUser = async (username) => {
    const res = await apiRequest.post(`/users/follow/${username}`);
    return res.data;
};

const FollowButton = ({ isFollowing, username }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
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
        navigate('/auth');
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

            {/* 登录提示弹窗 */}
            {showLoginModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={styles.modalTitle}>请先登录</h3>
                        <p style={styles.modalMessage}>登录后才能关注其他用户</p>
                        <div style={styles.modalActions}>
                            <button 
                                onClick={() => setShowLoginModal(false)}
                                style={styles.cancelButton}
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleLoginRedirect}
                                style={styles.loginButton}
                            >
                                去登录
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// 弹窗样式
const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        maxWidth: '320px',
        width: '90%',
        textAlign: 'center'
    },
    modalTitle: {
        margin: '0 0 12px 0',
        fontSize: '18px',
        fontWeight: '600',
        color: '#333'
    },
    modalMessage: {
        margin: '0 0 20px 0',
        fontSize: '14px',
        color: '#666'
    },
    modalActions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center'
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        color: '#333',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '24px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background-color 0.2s'
    },
    loginButton: {
        backgroundColor: '#e60023',
        color: 'white',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '24px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background-color 0.2s'
    }
};

export default FollowButton;