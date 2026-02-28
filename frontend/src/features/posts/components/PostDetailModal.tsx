import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Avatar, Empty, message } from 'antd';
import { HeartOutlined, MessageOutlined, HeartFilled } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getPostById } from '../api/getPostById';
import { useAuthStore } from '../../auth/stores/useAuthStore';
import './PostDetailModal.scss';

interface PostDetailModalProps {
  postId: number | null;
  visible: boolean;
  onClose: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ postId, visible, onClose }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['postDetail', postId],
    queryFn: () => getPostById(postId!),
    enabled: !!postId && visible,
  });

  const post = data?.data;
  const { token } = useAuthStore();
  const isLoggedIn = !!token;

  const requireAuth = (action: () => void) => {
    if (!isLoggedIn) {
      message.warning('Please log in to continue.');
      return;
    }
    action();
  };

  const [isAnimating, setIsAnimating] = useState(false);

  // Custom Hook to prevent body scroll
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      // Trigger animation frame after mount for entry transition
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      document.body.style.overflow = 'auto';
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setIsAnimating(false);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [visible]);

  const images = post?.images?.split(',') || [];
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIdx((prev: number) => Math.max(0, prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIdx((prev: number) => Math.min(images.length - 1, prev + 1));  
  };

  if (!visible) return null;

  const modalContent = (
    <div 
      className={`post-detail-overlay ${isAnimating ? 'animating' : ''}`}
      onClick={() => {
        setIsAnimating(false);
        setTimeout(onClose, 200); // Wait for exit animation
      }}
    >
      <div 
        className={`post-detail-modal ${isAnimating ? 'animating' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >

        {isLoading || !post ? (
           <div className="post-detail-loading">
             Loading...
           </div>
        ) : (
          <>
            {/* Left Pane: Image Area */}
            <div className="post-detail-image-pane">
              {images.length > 0 && (
                <>
                  <div 
                    className="image-track"
                    style={{ transform: `translateX(-${currentImageIdx * 100}%)` }}
                  >
                    {images.map((imgSrc, idx) => (
                      <div key={idx} className="image-slide">
                        <img 
                          src={imgSrc} 
                          alt={`Post content ${idx + 1}`} 
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Native Carousel Controls */}
                  {images.length > 1 && (
                    <>
                      {currentImageIdx > 0 && (
                        <div 
                          className="nav-btn prev"
                          onClick={handlePrev}
                        >
                          ‹
                        </div>
                      )}
                      {currentImageIdx < images.length - 1 && (
                        <div 
                          className="nav-btn next"
                          onClick={handleNext}
                        >
                          ›
                        </div>
                      )}
                      <div className="dot-indicators">
                        {images.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`dot ${idx === currentImageIdx ? 'active' : ''}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Right Pane: Content & Comments */}
            <div className="post-detail-content-pane">
              
              {/* Header */}
              <div className="header">
                <div className="user-info">
                  <Avatar src={post.userIcon} size={32} className="avatar">
                    {post.userNickname?.charAt(0).toUpperCase()}
                  </Avatar>
                  <span className="nickname">{post.userNickname}</span>
                </div>
                <button 
                  className="follow-btn"
                  onClick={() => requireAuth(() => console.log('Follow clicked'))}
                >
                  Follow
                </button>
              </div>

              {/* Body */}
              <div className="body">
                <h3 className="title">{post.title}</h3>
                <p className="content">
                  {post.content}
                </p>
                
                <div className="location-tag">
                  <span className="icon">📍</span>
                  <div className="name">
                    {post.spotName || 'View Location'}
                  </div>
                  <span className="score">
                    {post.rating || 5.0} ★
                  </span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                <div className="title">
                  Comments
                </div>
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  description={<span className="empty-desc">No comments yet.</span>} 
                />
              </div>

              {/* Footer Actions */}
              <div className="footer-actions">
                <div className="actions-container">
                  <span 
                    className="action-item"
                    onClick={() => requireAuth(() => console.log('Like clicked'))}
                  >
                    {post.isLiked ? <HeartFilled className="like-icon active" /> : <HeartOutlined className="like-icon" />}
                    Like
                    </span>
                  <span 
                    className="action-item"
                    onClick={() => requireAuth(() => console.log('Comment clicked'))}
                  >
                    <MessageOutlined className="comment-icon" />
                    Comment
                  </span>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
