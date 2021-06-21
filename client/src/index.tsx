import React from 'react';
import { Router } from '@reach/router';
import ReactDOM from 'react-dom';

import { useUser } from './state';
import './index.css';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Register from './Pages/Register';
import HashedPass from './Pages/HashedPass';
import { AuthRoute } from './Components';

ReactDOM.render(<App />, document.getElementById('root'));

function App() {
  const [user, _setUser] = useUser();

  return (
    <div>
      <Router>
        <AuthRoute
          only="in"
          path="/hashedPass"
          user={user}
          Component={HashedPass}
        />
        <AuthRoute only="in" path="/" user={user} Component={Home} />
        <AuthRoute
          only="out"
          path="/register"
          user={user}
          Component={Register}
        />
        <AuthRoute only="out" path="/login" user={user} Component={Login} />
      </Router>
    </div>
  );
}

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
