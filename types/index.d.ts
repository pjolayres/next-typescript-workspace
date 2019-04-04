import { NextFunctionComponent } from 'next';

interface LocalizedProps {
  t: (key: string) => string;
  lng: string;
  namespacesRequired: string[];
}

interface LocalizationInitialProps {
  namespacesRequired: string[];
}

interface LocalizedNextFunctionComponent<P = LocalizedProps, IP = LocalizationInitialProps, C = NextContext> extends NextFunctionComponent<P, IP, C> {}
