import { NextFunctionComponent } from 'next';

// React Props

interface LocalizedProps {
  t: (key: string) => string;
  lng: string;
  namespacesRequired: string[];
}

interface LocalizationInitialProps {
  namespacesRequired: string[];
}

interface LocalizedNextFunctionComponent<P = LocalizedProps, IP = LocalizationInitialProps, C = NextContext> extends NextFunctionComponent<P, IP, C> {}

// API Response Types

interface ApiResponse<T = any> {
  success: boolean;
  status: string;
  data?: any;
  message?: string;
  errorCode?: number;
}

interface ApiListResponse<T = any> extends ApiResponse<ApiListData<T>> {}

interface ApiListData<T = any> {
  items: T;
  skip: number;
  take: number;
  totalItems: number;
}
