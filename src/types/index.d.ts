import { NextPage, NextPageContext } from 'next';
import App from 'next/app';

import DataLoaderFactory from '../src/server/api/graphql/utilities/data-loader-factory';
import { FunctionComponent } from 'react';
import { WithTranslation } from 'next-i18next';

// React props

interface LocalizedProps extends WithTranslation {
  lng: string;
  namespacesRequired: string[];
}

interface LocalizationInitialProps {
  namespacesRequired: string[];
}

interface LocalizedNextPage<P = LocalizedProps, IP = LocalizationInitialProps> extends NextPage<P, IP>, FunctionComponent<P> {}

// Repository types

type SearchableEntityProperties<T> = Pick<T, { [K in keyof T]: T[K] extends string ? K : never }[keyof T]>;

interface FetchListOptions<TEntity> {
  order?: { [P in keyof TEntity]?: 'ASC' | 'DESC' | 1 | -1 };
  searchText?: string;
  searchFields?: Array<keyof SearchableEntityProperties<TEntity>>;
  filters?: Array<FindConditions<TEntity>>;
}

interface IndexedEntity {
  [key: string]: any;
}

interface PaginatedFetchListOptions<TEntity> {
  skip?: number;
  take?: number;
  order?: { [P in keyof TEntity]?: 'ASC' | 'DESC' | 1 | -1 };
  searchText?: string;
  searchFields?: Array<keyof SearchableEntityProperties<TEntity>>;
  filters?: Array<FindConditions<TEntity>>;
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
  items: T[];
  skip: number;
  take: number;
  totalItems: number;
}

// GraphQL types

interface Context {
  dataLoaderFactory: DataLoaderFactory;
}

// Miscellaneous types

interface AppWindow extends Window {
  [key: string]: any;
}
