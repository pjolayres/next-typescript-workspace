import { NextFunctionComponent } from 'next';
import App from 'next/app';

// React props

interface LocalizedProps {
  t: (key: string) => string;
  lng: string;
  namespacesRequired: string[];
}

interface LocalizationInitialProps {
  namespacesRequired: string[];
}

interface LocalizedNextFunctionComponent<P = LocalizedProps, IP = LocalizationInitialProps, C = NextContext> extends NextFunctionComponent<P, IP, C> {}

// Repository types

type SearchableEntityProperties<T> = Pick<T, { [K in keyof T]: T[K] extends string ? K : never }[keyof T]>;

interface FetchListOptions<TEntity> {
  skip?: number;
  take?: number;
  order?: { [P in keyof TEntity]?: 'ASC' | 'DESC' | 1 | -1 };
  searchText?: string;
  searchFields?: Array<keyof SearchableEntityProperties<TEntity>>;
}

// API Response types

interface ApiResponse<T = any> {
  success: boolean;
  status: string;
  data?: any;
  message?: string;
  errorCode?: number;
}

interface ApiListResponse<T = any> extends ApiResponse<ListData<T>> {}

interface ListData<T = any> {
  items: Array<T>;
  skip: number;
  take: number;
  totalItems: number;
}

// Miscellaneous types

interface AppWindow extends Window {
  [key: string]: any;
}
