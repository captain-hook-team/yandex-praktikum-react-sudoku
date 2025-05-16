/* eslint-disable operator-linebreak */
/* eslint-disable prefer-template */
import { useEffect } from 'react';
import { PageInitArgs, PageInitContext } from '../routes-object';
import {
  setPageHasBeenInitializedOnServer,
  selectPageHasBeenInitializedOnServer,
} from '../store/slices/ssrSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { store } from '../store';

type PageProps = {
  initPage: (data: PageInitArgs) => Promise<unknown>
}

const getCookie = (name: string) => {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

const createContext = (): PageInitContext => ({
  clientToken: getCookie('token'),
});

const usePage = ({ initPage }: PageProps) => {
  const dispatch = useAppDispatch();

  const pageHasBeenInitializedOnServer = useAppSelector(selectPageHasBeenInitializedOnServer);

  useEffect(() => {
    if (pageHasBeenInitializedOnServer) {
      dispatch(setPageHasBeenInitializedOnServer(false));
      return;
    }
    initPage({ dispatch, state: store.getState(), ctx: createContext() });
  }, []);
};

export default usePage;
