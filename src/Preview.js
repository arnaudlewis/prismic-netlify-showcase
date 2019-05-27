import { useEffect } from 'react';
import qs from 'qs';
import Cookies from 'js-cookie';
import Prismic from 'prismic-javascript';

import { linkResolver } from './components/prismic';
import config from './components/prismic/prismic-configuration.json';

const Preview = ({
  history,
  location,
}) => {

  useEffect(() => {
    const params = qs.parse(location.search.slice(1));
    if (!params.token) {
      return console.warn(`Unable to retrieve session token from provided url. \n
      Check https://prismic.io/docs/rest-api/beyond-the-api/the-preview-feature for more info`);
    }

    // Retrieve the correct URL for the document being previewed.
    // Once fetched, redirect to the given url
    Prismic.client(config.endpoint).previewSession(params.token, linkResolver, '/').then(url => {
      Cookies.set('io.prismic.preview', params.token, { path: '/', expires: 360000 })
      history.push(url)
    });
  });
  return null;
};

export default Preview;
