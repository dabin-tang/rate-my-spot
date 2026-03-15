import React, { useState } from 'react';
import { CloseOutlined, LeftOutlined, EnvironmentOutlined, StarFilled, HeartOutlined, MessageOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useSpotDetail } from './useSpotDetail';
import styles from './SpotDetailCard.module.scss';

export interface SpotDetailCardProps {
  spotId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SpotDetailCard: React.FC<SpotDetailCardProps> = ({ spotId, isOpen, onClose }) => {
  const [isRendered, setIsRendered] = useState(isOpen);

  if (isOpen && !isRendered) {
    setIsRendered(true);
  }

  const onAnimationEnd = () => {
    if (!isOpen) setIsRendered(false);
  };

  const { spot, recentPosts, isLoading, error } = useSpotDetail(isOpen ? spotId : null);

  if (!isRendered || !spotId) return null;

  return (
    <>
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.fadeIn : styles.fadeOut}`} 
        onClick={onClose} 
      />
      <div 
        className={`${styles.panelContainer} ${isOpen ? styles.slideIn : styles.slideOut}`}
        onAnimationEnd={onAnimationEnd}
      >
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onClose}>
            <LeftOutlined style={{ fontSize: '16px', marginRight: '8px' }} />
            Back
          </button>
          
          <div className={styles.headerActions}>
            <button className={styles.iconButton} onClick={onClose} aria-label="Close detail">
              <CloseOutlined />
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
              <p>Loading spot details...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>Failed to load spot details.</p>
            </div>
          ) : spot ? (
            <>
              <div 
                className={styles.imageHeader}
                style={{ backgroundImage: `url(${spot.images?.split(',')[0] || 'https://via.placeholder.com/500x300'})` }}
              >
                <div className={styles.imageOverlay}>
                  <h2 className={styles.spotName}>{spot.name}</h2>
                  <div className={styles.spotMetaContainer}>
                    <div className={styles.scoreBadge}>
                      <StarFilled /> {spot.score?.toFixed(1) || '0.0'}
                    </div>
                    <span>({spot.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <div className={styles.addressRow}>
                  <EnvironmentOutlined />
                  <span>{spot.address}</span>
                </div>
                <div className={styles.descriptionBlock}>
                  <h3>About</h3>
                  <p>{spot.description}</p>
                </div>
              </div>

              <div className={styles.postsSection}>
                <div className={styles.sectionHeader}>
                  <h3>Recent Posts</h3>
                </div>
                
                {recentPosts && recentPosts.length > 0 ? (
                  <div className={styles.postList}>
                    {recentPosts.map(post => (
                      <div key={post.id} className={styles.postCard}>
                        <div className={styles.postHeader}>
                          <div className={styles.userInfo}>
                            <img src={post.userIcon || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.userId} alt="avatar" className={styles.avatar} />
                            <span className={styles.userName}>{post.userNickname}</span>
                          </div>
                          <span className={styles.postDate}>
                            {new Date(post.createTime).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {post.images && (
                          <div 
                            className={styles.postImage}
                            style={{ backgroundImage: `url(${post.images.split(',')[0]})` }}
                          />
                        )}
                        
                        <div className={styles.postContent}>
                          <h4 className={styles.postTitle}>{post.title}</h4>
                          <p className={styles.postText}>{post.content}</p>
                        </div>
                        
                        <div className={styles.postFooter}>
                          <div className={styles.actionItem}>
                            <HeartOutlined /> {post.liked}
                          </div>
                          <div className={styles.actionItem}>
                            <MessageOutlined /> Reply
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyPosts}>No recent posts for this spot yet.</div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};
