import { useMutation } from '@tanstack/react-query';
import { submitReport } from '../api/submitReport';
import { message } from 'antd';
import type { ReportCreateDTO } from '../types';

export const useSubmitReport = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: (data: ReportCreateDTO) => submitReport(data),
    onSuccess: () => {
      message.success({
        content: 'Report submitted successfully. We will review it shortly.',
        style: {
          marginTop: '20vh',
        },
      });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: () => {
      message.error('Failed to submit report. Please try again later.');
    }
  });
};
