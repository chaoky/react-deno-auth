import React from 'react';
import logo from './logo.svg';
import { Link, RouteComponentProps } from '@reach/router';

import { sendLogout } from '../auth';
import { Layout } from '../Components';

interface HomeProps extends RouteComponentProps {
  user: string;
}

export default function Home({ user }: HomeProps) {
  return (
    <Layout>
      <div>
        <p>Welcome, {user}</p>
        <p
          className="App-link"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            sendLogout().catch((e) => alert(e));
          }}
        >
          Logout
        </p>
        <Link to="/hashedPass" style={{ textDecoration: 'none' }}>
          <p className="App-link">Private Route</p>
        </Link>
      </div>
    </Layout>
  );
}
