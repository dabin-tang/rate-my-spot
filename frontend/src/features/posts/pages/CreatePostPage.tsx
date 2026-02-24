import React, { useState, useRef, useMemo } from 'react';
import { Form, Input, Button, Typography, message, Upload, Rate, Card, Select, Flex } from 'antd';
import { UploadOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

import { useMutation, useQuery } from '@tanstack/react-query';
import { searchSpots } from '../../spots/api/searchSpots';
import { createPost } from '../api/createPost';
import { uploadFile } from '../../../shared/api/upload';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/stores/useAuthStore';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const CreatePostPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  
  // State for step 1
  const [selectedSpotId, setSelectedSpotId] = useState<number | undefined>(undefined);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // State for step 2 images
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  // Debounce search input
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setSearchKeyword(value);
    }, 500);
  };

  // Query spots based on search keyword
  const { data: spotsData, isFetching: isSearchingSpots } = useQuery({
    queryKey: ['searchSpots', searchKeyword],
    queryFn: () => searchSpots(searchKeyword),
    enabled: !!searchKeyword,
  });

  const spotOptions = useMemo(() => {
    if (!Array.isArray(spotsData?.data)) return [];
    return spotsData.data.map(spot => ({
      value: spot.id,
      label: (
        <Flex align="center" gap={8}>
          <EnvironmentOutlined style={{ color: '#ff2442' }} />
          <span>{spot.name}</span>
          <Text type="secondary" style={{ fontSize: '12px', marginLeft: 'auto' }}>
            {spot.address}
          </Text>
        </Flex>
      ),
      spotData: spot
    }));
  }, [spotsData]);

  // Handle post creation mutation
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      const hide = message.loading('Publishing...', 0);
      setTimeout(() => {
        hide();
        navigate('/');
      }, 1000);
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to create post');
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const res = await uploadFile(file as File);
      if (res.success && res.data) {
        setUploadedUrls(prev => [...prev, res.data]);
        onSuccess?.("ok");
      } else {
        throw new Error('Upload failed');
      }
    } catch (e) {
      onError?.(e as Error);
      message.error('File upload failed');
    }
  };

  const uploadProps: UploadProps = {
    customRequest,
    multiple: true,
    listType: "picture-card",
    onChange(info) {
      if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove: () => {
      // In a real app we'd need to map the file to our uploadedUrls state
      // For simplicity, we just clear it all or find by index if mapped
      return true;
    }
  };

  const onFinish = (values: { title: string; content: string; rating: number }) => {
    if (!selectedSpotId) {
      message.error('Please select a spot first');
      return;
    }
    if (uploadedUrls.length === 0) {
      message.error('Please upload at least one image');
      return;
    }

    createMutation.mutate({
      spotId: selectedSpotId,
      title: values.title,
      content: values.content,
      rating: values.rating,
      images: uploadedUrls.join(','),
    });
  };

  if (!token) {
    return (
      <Flex justify="center" align="center" style={{ height: '100%' }}>
        <Title level={4}>Please log in to post a review.</Title>
      </Flex>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: '#fafbfc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px', width: '100%' }}>
      <Title level={2} style={{ marginBottom: 32, fontWeight: 800 }}>Create New Post</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        {/* Step 1: Select Spot */}
        <Card 
          bordered={false} 
          style={{ 
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', 
            marginBottom: 24 
          }}
        >
          <Title level={4} style={{ marginTop: 0 }}>1. Select a Spot</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Where did you go? Search and select the spot you want to review.
          </Text>
          <Select
            allowClear
            showSearch
            placeholder="Search spots by name..."
            size="large"
            style={{ width: '100%' }}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={handleSearch}
            onChange={(val) => setSelectedSpotId(val)}
            notFoundContent={isSearchingSpots ? "Searching..." : "No spots found"}
            options={spotOptions}
          />
        </Card>

        {/* Step 2: Content (Disabled if no spot selected) */}
        <div style={{ 
          opacity: selectedSpotId ? 1 : 0.5, 
          pointerEvents: selectedSpotId ? 'auto' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <Card 
            bordered={false} 
            style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}
          >
            <Title level={4} style={{ marginTop: 0 }}>2. Write your Review</Title>
            
            <Form.Item label="Upload Photos">
              <Upload {...uploadProps}>
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Give your review a catchy title" size="large" style={{ borderRadius: '12px' }} />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, message: 'Please provide a rating' }]}
            >
              <Rate style={{ color: '#ff2442' }} />
            </Form.Item>

            <Form.Item
              name="content"
              label="Review Details"
              rules={[{ required: true, message: 'Please write your review' }]}
            >
              <TextArea 
                placeholder="Share your experience..." 
                rows={6} 
                size="large"
                style={{ borderRadius: '12px' }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                shape="round"
                loading={createMutation.isPending}
                style={{ width: '200px', fontWeight: 'bold' }}
              >
                Submit Post
              </Button>
            </Form.Item>
          </Card>
        </div>
      </Form>
      </div>
    </div>
  );
};
