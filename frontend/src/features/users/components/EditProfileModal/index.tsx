import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Form, Input, Select, Button } from 'antd';
import { CameraOutlined, CloseOutlined } from '@ant-design/icons';
import { useEditProfileForm } from './useEditProfileForm';
import type { UserProfileDTO } from '../../types';
import styles from './EditProfileModal.module.scss';

const { Option } = Select;
const { TextArea } = Input;

const PREDEFINED_CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
  'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'San Francisco',
  'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Washington',
  'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City',
  'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore',
  'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento',
  'Kansas City', 'Mesa', 'Atlanta', 'Omaha', 'Colorado Springs',
  'Miami', 'Raleigh', 'Virginia Beach', 'Oakland', 'Minneapolis'
];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfileDTO;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const {
    form,
    isSubmitting,
    initForm,
    clearForm,
    handleSubmit,
    avatarPreviewUrl,
    handleAvatarChange
  } = useEditProfileForm(onClose);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let mountTimer: number;
    let unmountTimer: number;

    if (isOpen) {
      setIsRendered(true);
      // 10ms delay forces the browser to paint the initial CSS state before transitioning, ensuring 100% reliable animations
      mountTimer = window.setTimeout(() => {
        setIsVisible(true);
      }, 10);
      initForm(currentUser);
    } else {
      setIsVisible(false);
      unmountTimer = window.setTimeout(() => {
        setIsRendered(false);
        clearForm();
      }, 400);
    }

    return () => {
      window.clearTimeout(mountTimer);
      window.clearTimeout(unmountTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentUser]);

  const onAvatarClick = () => {
    fileInputRef.current?.click();
  };

  if (!isRendered) return null;

  const modalNode = (
    <div className={`${styles.modalOverlay} ${isVisible ? styles.visible : ''}`} onMouseDown={onClose}>
      <div 
        className={`${styles.modalCard} ${isVisible ? styles.visible : ''}`} 
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}><CloseOutlined /></button>
        <div className={styles.modalTitle}>Edit Profile</div>

        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper} onClick={onAvatarClick}>
            {avatarPreviewUrl ? (
              <img src={avatarPreviewUrl} alt="Avatar Preview" className={styles.avatarPreview} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {currentUser.nickname?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className={styles.avatarOverlay}>
              <CameraOutlined className={styles.cameraIcon} />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <div className={styles.avatarHint}>Click to upload new avatar</div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className={styles.form}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="nickname"
              label="Nickname"
              rules={[{ required: true, message: 'Please input your nickname' }]}
              style={{ flex: 1, marginBottom: '16px' }}
            >
              <Input size="large" className={styles.inputField} placeholder="Display name" />
            </Form.Item>

            <Form.Item name="gender" label="Gender" style={{ flex: 1, marginBottom: '16px' }}>
              <Select size="large" className={styles.selectField}>
                <Option value={0}>Secret</Option>
                <Option value={1}>Male</Option>
                <Option value={2}>Female</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="city" label="City" style={{ marginBottom: '16px' }}>
            <Select 
              size="large" 
              className={styles.selectField} 
              placeholder="Select a city"
              showSearch
            >
              {PREDEFINED_CITIES.map(city => (
                <Option key={city} value={city}>{city}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="intro" label="Bio" style={{ marginBottom: '16px' }}>
            <TextArea 
              rows={2} 
              className={styles.inputField} 
              placeholder="Tell us about yourself..." 
              maxLength={128}
              showCount
            />
          </Form.Item>

          <Form.Item className={styles.actionRow}>
            <Button size="large" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className={styles.saveBtn}
              loading={isSubmitting}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};
