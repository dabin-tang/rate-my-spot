import React, { useState, useEffect, useRef } from 'react';
import { Spin, Dropdown } from 'antd';
import { StarFilled, MoreOutlined, FlagOutlined } from '@ant-design/icons';
import { useSpotReviews } from '../../hooks/useSpotReviews';
import { useAuthStore } from '../../../auth/stores/useAuthStore';
import { ReportModal } from '../../../../shared/components/ReportModal';
import styles from './ReviewList.module.scss';

interface ReviewListProps {
  spotId: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({ spotId }) => {
  const { 
    reviews, 
    data: queryData, 
    isLoading, 
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useSpotReviews(spotId);
  
  const user = useAuthStore(state => state.user);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { threshold: 0.1 });

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  const [reportingReviewId, setReportingReviewId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin />
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (isError) {
    return <div className={styles.errorText}>Failed to load reviews.</div>;
  }

  return (
    <div className={styles.reviewList}>
      <h3 className={styles.title}>Reviews ({(queryData as any)?.pages?.[0]?.total || 0})</h3>
      
      {reviews.length > 0 ? (
        <div className={styles.listContainer}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.header}>
                <div className={styles.userInfo}>
                  <img src={review.userIcon || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userId}`} alt="avatar" className={styles.avatar} />
                  <span className={styles.userName}>{review.userNickname}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className={styles.rating}>
                    <StarFilled /> {review.rating.toFixed(1)}
                  </div>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'report',
                          label: 'Report Review',
                          icon: <FlagOutlined />,
                          onClick: () => {
                            if (!user) {
                              import('antd').then(({ message }) => message.warning('Please log in first.'));
                              return;
                            }
                            setReportingReviewId(review.id);
                          }
                        }
                      ]
                    }}
                    trigger={['click']}
                    placement="bottomRight"
                  >
                    <div style={{ cursor: 'pointer', color: '#999', padding: '0 4px', fontSize: '18px' }}>
                      <MoreOutlined />
                    </div>
                  </Dropdown>
                </div>
              </div>
              
              <p className={styles.content}>{review.content}</p>
              
              {review.images && (
                <div className={styles.imageGrid}>
                  {(Array.isArray(review.images) ? review.images : review.images.split(',')).map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      className={styles.reviewImage}
                      style={{ backgroundImage: `url(${imgUrl})` }}
                    />
                  ))}
                </div>
              )}
              
              <div className={styles.footer}>
                <span className={styles.date}>{new Date(review.createTime).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {/* Infinite Scroll Review Sentinel Node */}
          <div ref={loadMoreRef} style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '12px 0' }}>
            {isFetchingNextPage && <Spin size="small" />}
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>No reviews yet. Be the first to review!</div>
      )}
      
      {reportingReviewId && (
        <ReportModal
          isOpen={true}
          targetId={reportingReviewId}
          targetType="REVIEW"
          onClose={() => setReportingReviewId(null)}
        />
      )}
    </div>
  );
};
