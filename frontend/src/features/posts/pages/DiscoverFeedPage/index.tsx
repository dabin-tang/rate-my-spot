import React, { useState } from 'react';
import { CategoryFilter } from '../../../spots/components/CategoryFilter';
import { PostFeed } from '../../components/PostFeed';
import { Input, Select, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { NeumorphicSpotButton } from '../../../../shared/components/NeumorphicSpotButton';
import { useGlobalSearch } from '../../../../shared/components/Layout/useGlobalSearch';

export const DiscoverFeedPage: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<string>('latest');

  const {
    keyword,
    results: searchResults,
    isDropdownVisible,
    isLoading: isSearchLoading,
    dropdownRef,
    handleInputChange,
    handleFocus,
    handleResultClick,
  } = useGlobalSearch();

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fafbfc' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 24px -4px rgba(0,0,0,0.02)' }}>
        <div style={{ width: '100%' }}>
          
          {/* Header Search Area (matches prototype padding 16px 24px) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px 0 24px', marginBottom: 12 }}>
            <div style={{ flex: 1 }}></div>
            
            <div style={{ position: 'relative', flex: 2, maxWidth: 500, margin: '0 20px' }} ref={dropdownRef}>
              <Input 
                placeholder="Search posts or spots..." 
                prefix={<SearchOutlined style={{ color: '#aaa', fontSize: '16px', marginRight: 4 }} />} 
                style={{ borderRadius: 100, backgroundColor: '#f0f2f5', border: '1px solid transparent', width: '100%', padding: '8px 16px', fontSize: '15px', color: '#333', transition: 'all 0.3s' }}
                value={keyword}
                onChange={handleInputChange}
                onFocus={handleFocus}
                allowClear
              />
              {isDropdownVisible && keyword.trim() !== '' && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                  background: '#fff', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  zIndex: 1000, maxHeight: 400, overflowY: 'auto', border: '1px solid #eee', padding: '8px 0'
                }}>
                  {isSearchLoading ? (
                    <div style={{ padding: 16, textAlign: 'center', color: '#888' }}><Spin size="small"/> Loading...</div>
                  ) : searchResults.length > 0 ? (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {searchResults.map(spot => (
                        <li 
                          key={spot.id} 
                          onClick={() => handleResultClick(spot.id)} 
                          style={{ padding: '12px 20px', cursor: 'pointer', borderBottom: '1px solid #f9f9f9', transition: 'background 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ fontSize: 15, fontWeight: 500, color: '#333', marginBottom: 4 }}>{spot.name}</div>
                          <div style={{ fontSize: 13, color: '#888' }}>{spot.address}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ padding: 16, textAlign: 'center', color: '#888' }}>No results found</div>
                  )}
                </div>
              )}
            </div>
            
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <NeumorphicSpotButton />
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
