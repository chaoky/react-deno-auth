export type UserDB = {
  [key: string]: User;
};

interface User extends RegisterForm {
  devices: string[];
}

export type LoginForm = {
  name: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type RegisterForm = {
  name: string;
  email: string;
  pos: string;
  password: string;
};
