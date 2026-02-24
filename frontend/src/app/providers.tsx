import React from 'react';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#ff2442',
            borderRadius: 12, // Default border radius for inputs/buttons
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          },
          components: {
            Card: {
              borderRadiusLG: 16, // Larger border radius for cards
            },
            Modal: {
              borderRadiusLG: 16,
            },
            Button: {
              controlHeightLG: 48,
              controlHeight: 40,
            }
          }
        }}
      >
        {children}
      </ConfigProvider>
    </QueryClientProvider>
  );
};
