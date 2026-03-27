import React, { useState, useEffect } from 'react';
import { Modal, Switch, Button, Form, Input, Typography, Flex, message, Divider } from 'antd';
import { useAuthStore } from '../../../auth/stores/useAuthStore';
import { useToggleLikesPrivacy } from '../../hooks/useToggleLikesPrivacy';
import { useUpdatePassword } from '../../hooks/useUpdatePassword';
import { authSendCode } from '../../../auth/api/authSendCode';
import styles from './SettingsModal.module.scss';

const { Title, Text } = Typography;

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrivacy?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialPrivacy }) => {
  const { user } = useAuthStore();
  const { mutate: togglePrivacy, isPending: isPrivacyPending } = useToggleLikesPrivacy();
  const [form] = Form.useForm();
  
  // Local state for UI
  const [isPrivate, setIsPrivate] = useState<boolean>(!!initialPrivacy);
  const [isChangePasswordActive, setIsChangePasswordActive] = useState(false);

  useEffect(() => {
    setIsPrivate(!!initialPrivacy);
  }, [initialPrivacy]);

  const { mutate: updatePassword, isPending: isPasswordPending } = useUpdatePassword(() => {
    // on success
    setIsChangePasswordActive(false);
    form.resetFields();
  });
  
  // Countdown State
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePrivacyChange = (checked: boolean) => {
    setIsPrivate(checked);
    togglePrivacy(checked);
  };

  const handleSendCode = async () => {
    if (!user?.email) {
      message.error("No email associated with this account.");
      return;
    }
    try {
      await authSendCode(user.email, 1);
      message.success('Verification code sent to your email.');
      setCountdown(60);
    } catch (e: any) {
      message.error(e.message || 'Failed to send verification code.');
    }
  };

  const onPasswordFinish = (values: Record<string, string>) => {
    const { newPassword, code } = values;
    updatePassword({ newPassword, code });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        onClose();
        setIsChangePasswordActive(false);
        form.resetFields();
      }}
      footer={null}
      centered
      className={styles.settingsModal}
      title={<Title level={3} style={{ margin: 0, paddingBottom: 16 }}>Settings</Title>}
      width={480}
    >
      <div className={styles.section}>
        <Title level={5} className={styles.sectionTitle}>Privacy</Title>
        <Flex justify="space-between" align="center" className={styles.settingRow}>
          <div>
            <Text strong>Make my likes private</Text>
            <div className={styles.subtext}>When ON, other users cannot see the posts you've liked.</div>
          </div>
          <Switch 
            checked={isPrivate} 
            onChange={handlePrivacyChange} 
            loading={isPrivacyPending} 
            className={styles.neumorphicSwitch}
          />
        </Flex>
      </div>

      <Divider className={styles.divider} />

      <div className={styles.section}>
        <Title level={5} className={styles.sectionTitle}>Account Security</Title>
        
        {!isChangePasswordActive ? (
          <Flex justify="space-between" align="center" className={styles.settingRow}>
            <Text strong>Password</Text>
            <Button 
              type="primary" 
              ghost 
              shape="round" 
              onClick={() => setIsChangePasswordActive(true)}
            >
              Update
            </Button>
          </Flex>
        ) : (
          <Form layout="vertical" form={form} onFinish={onPasswordFinish} className={styles.passwordForm}>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[{ required: true, message: 'Please enter a new password' }, { min: 6, message: 'Minimum 6 characters' }]}
            >
              <Input.Password placeholder="Enter new password" size="large" />
            </Form.Item>

            <Flex gap={12} align="flex-end">
              <Form.Item
                name="code"
                label="Verification Code"
                rules={[{ required: true, message: 'Please enter verification code' }]}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <Input placeholder="Enter 6-digit code" size="large" />
              </Form.Item>
              <Button 
                size="large" 
                onClick={handleSendCode} 
                disabled={countdown > 0} 
                style={{ minWidth: 120 }}
              >
                {countdown > 0 ? `${countdown}s` : 'Get Code'}
              </Button>
            </Flex>

            <Flex justify="flex-end" gap={12} style={{ marginTop: 24 }}>
              <Button shape="round" onClick={() => {
                setIsChangePasswordActive(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" shape="round" loading={isPasswordPending}>
                Save Password
              </Button>
            </Flex>
          </Form>
        )}
      </div>
    </Modal>
  );
};
