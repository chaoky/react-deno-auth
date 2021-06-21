import jwt_decode, { JwtPayload } from 'jwt-decode';
import { setToken, getToken, setUser } from './state';
import type { RegisterForm, LoginForm } from '../../types';

export async function sendRegister(body: RegisterForm) {
  const resp = await fetch('/api/register', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (resp.status != 200) throw new Error(await resp.json());
}

export async function sendLogin(body: LoginForm) {
  const resp = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const m = await resp.text();

  if (resp.status != 200) throw new Error(m);

  const { iss } = jwt_decode(m.replace('Bearer ', '')) as JwtPayload;
  setUser(iss!);
  setToken(m);
}

export async function sendLogout() {
  await fetch('/api/logout', { method: 'POST' });
  setUser('');
  setToken('');
}

export async function sendHashedPass(): Promise<string> {
  const resp = await fetch('/api/hashedPass', {
    headers: { Authorization: getToken() },
  });

  //if err refresh token and retry
  if (await refresh(resp)) {
    return sendHashedPass();
  }

  return await resp.json();
}

async function refresh(resp: Response) {
  if (resp.status == 200) return false;

  const jwt = await fetch('/api/token_refresh', { method: 'POST' });

  //user should login again
  if (jwt.status != 200) {
    setUser('');
    setToken('');
    throw new Error('Refresh Token Expired');
  }

  setToken(await jwt.text());

  return true;
}
