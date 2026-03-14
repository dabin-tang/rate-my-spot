import React, { useState } from 'react';
import { CategoryFilter } from '../../../spots/components/CategoryFilter';
import { PostFeed } from '../../components/PostFeed';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { NeumorphicSpotButton } from '../../../../shared/components/NeumorphicSpotButton';

export const DiscoverFeedPage: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<string>('latest');

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fafbfc' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 24px -4px rgba(0,0,0,0.02)' }}>
        <div style={{ width: '100%' }}>
          
          {/* Header Search Area (matches prototype padding 16px 24px) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px 0 240px', marginBottom: 12 }}>
            <Input 
              placeholder="Search posts" 
              prefix={<SearchOutlined style={{ color: '#aaa', fontSize: '16px', marginRight: 4 }} />} 
              style={{ borderRadius: 100, backgroundColor: '#f0f2f5', border: '1px solid transparent', width: '100%', maxWidth: 460, padding: '8px 16px', fontSize: '15px', color: '#333', transition: 'all 0.3s' }}
              onPressEnter={(e) => console.log('Search:', e.currentTarget.value)}
            />
            
            <NeumorphicSpotButton />
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
