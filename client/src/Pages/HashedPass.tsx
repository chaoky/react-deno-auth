import React, { useState, useEffect } from 'react';
import type { RouteComponentProps } from '@reach/router';

import { Layout } from '../Components';
import { sendHashedPass } from '../auth';

interface HashedPassProps extends RouteComponentProps {}

export default function HashedPass({}: HashedPassProps) {
  const [hash, setHash] = useState('');
  useEffect(() => {
    sendHashedPass().then((e) => setHash(e));
  }, []);
  return (
    <Layout>
      <p style={{ wordWrap: 'break-word' }}>{JSON.stringify(hash, null, 4)}</p>
    </Layout>
  );
}
