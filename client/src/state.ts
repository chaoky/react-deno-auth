import { useState, useEffect } from 'react';

//access tokens should be stored in memory, maybe use react context?
let acessToken = '';

export function setToken(token: string) {
  acessToken = token;
}

export function getToken() {
  return acessToken;
}

//store user in local storage as a proxy to the http only refresh token cookie
export function setUser(user: string) {
  localStorage.setItem('user', user);
  dispatchEvent(new Event('userChange'));
}
export function getUser() {
  return localStorage.getItem('user') || '';
}

//temporary way to sync react state with local storage, migrate to something like redux if too much info should be stored
export function useUser(): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
] {
  const [user_, setUser_] = useState(() => getUser());
  const handler = () => setUser_(getUser());

  useEffect(() => {
    addEventListener('userChange', handler);
    return () => {
      removeEventListener('userChange', handler);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('user', user_);
  }, [user_]);

  return [user_, setUser_];
}
