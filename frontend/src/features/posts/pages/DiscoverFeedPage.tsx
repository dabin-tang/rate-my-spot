import React, { useState } from 'react';
import { CategoryFilter } from '../../spots/components/CategoryFilter';
import { PostFeed } from '../components/PostFeed';
import { Input, Select, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

export const DiscoverFeedPage: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<string>('latest');

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fafbfc' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 24px -4px rgba(0,0,0,0.02)' }}>
        <style>
          {`
            .bili-primary-btn {
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 8px 24px;
              background: linear-gradient(135deg, #ff4d64, #ff2442);
              color: #fff;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(255, 36, 66, 0.2);
              transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
              user-select: none;
            }
            .bili-primary-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(255, 36, 66, 0.35);
              background: linear-gradient(135deg, #ff5c77, #ff3355);
            }
            .bili-primary-btn:active {
              transform: translateY(1px);
              box-shadow: 0 2px 8px rgba(255, 36, 66, 0.15);
            }
          `}
        </style>
        <div style={{ width: '100%' }}>
          
          {/* Header Search Area (matches prototype padding 16px 24px) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px 0 240px', marginBottom: 12 }}>
            <Input 
              placeholder="Search posts" 
              prefix={<SearchOutlined style={{ color: '#aaa', fontSize: '16px', marginRight: 4 }} />} 
              style={{ borderRadius: 100, backgroundColor: '#f0f2f5', border: '1px solid transparent', width: '100%', maxWidth: 460, padding: '8px 16px', fontSize: '15px', color: '#333', transition: 'all 0.3s' }}
              onPressEnter={(e) => console.log('Search:', e.currentTarget.value)}
            />
            
            <div 
              className="bili-primary-btn"
              onClick={() => message.info({ content: 'The Spot feature is currently under development.', duration: 3, style: { marginTop: '10vh' } })}
            >
              <PlusOutlined style={{ fontSize: '14px', strokeWidth: 10, stroke: 'currentColor' }} />
              <span>Spot</span>
            </div>
          </div>

          {/* Filter Tabs Area (matches prototype padding 12px 16px) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 16px 12px 16px' }}>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <CategoryFilter 
                value={selectedCategoryId} 
                onChange={setSelectedCategoryId} 
              />
            </div>
            <div style={{ flexShrink: 0, paddingLeft: 16 }}>
              <Select
                value={sortOrder}
                onChange={setSortOrder}
                variant="borderless"
                disabled={false}
                options={[
                  { value: 'latest', label: 'Sort: Latest' },
                  { value: 'default', label: 'Sort: Trending' },
                ]}
                style={{ width: 130, fontSize: '13px', color: '#666' }}
              />
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Grid Container (matches prototype padding 20px) */}
      <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        <PostFeed categoryId={selectedCategoryId} sort={sortOrder} />
      </div>
    </div>
  );
};
