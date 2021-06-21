/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { useEffect } from 'react';
import { RouteComponentProps, useNavigate } from '@reach/router';

//TODO maybe use a HOC instead?
interface AuthSwitchProps extends RouteComponentProps {
  user: string;
  Component: any;
  only: 'in' | 'out';
}
export function AuthRoute({ Component, only, ...props }: AuthSwitchProps) {
  const { user, navigate } = props;
  useEffect(() => {
    if (!user && only == 'in') {
      navigate!('/register');
    }
    if (user && only == 'out') {
      navigate!('/');
    }
  }, [user]);

  return <Component {...props} />;
}

export function FormHead({ kind }: { kind: string }) {
  const navigate = useNavigate()
  const { big, small, action, thing } =
    kind == 'login'
      ? {
        big: "Let's sign you in",
        small: "Don't have an account?",
        action: () => navigate('/register'),
        thing: 'Sign up',
      }
      : {
          big: "Let's set up your account",
          small: 'Already have an account?',
          action: () => navigate('/login'),
          thing: 'Sign in',
        };

  return (
    <>
      <h1 style={{ fontSize: '1.7em', fontWeight: 'bold', margin: 0 }}>
        {big}
      </h1>
      <div
        style={{
          fontSize: '.9em',
          fontWeight: 400,
        }}
      >
        <span>{small} </span>
        <span style={{ color: '#286EFA', fontWeight: 'bold' }} onClick={action}>
          {thing}
        </span>
      </div>
    </>
  );
}

export function Layout({ children }: { children: any }) {
  return (
    <div
      css={{
        display: 'flex',
        backgroundColor: '#F9F9F9',
        '@media(max-width: 800px)': {
          flexDirection: 'column-reverse',
        },
      }}
    >
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: '65vw',
          minHeight: '100vh',
          flexShrink: 0,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '80%',
            maxWidth: '400px',
            gap: '5vh',
            margin: '7vw',
          }}
        >
          {children}
        </div>
      </div>
      <SidePanel />
    </div>
  );
}

function SidePanel() {
  return (
    <div
      style={{
        backgroundColor: '#286EFA',
        color: '#F9F9F9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1 style={{ fontSize: '1.7em', fontWeight: 'bold', margin: '8vh 0' }}>
        Dummy Heading
      </h1>
      <p style={{ margin: '0 8vw 8vh 8vw' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
  );
}

interface FormFieldProps {
  placeHolder: string;
  register: any;
  error?: string;
  kind?: 'password' | 'select';
  watch?: string;
  options?: string[];
}

export function FormField(props: FormFieldProps) {
  const style = {
    padding: '1em',
    backgroundColor: 'transparent',
    borderRadius: '.2em',
    border: '1px solid',
    width: '100%',
    boxSizing: 'border-box',
    '::placeholder': {
      color: '#999',
    },
    //TODO figure a better solution
    color: props.watch == '' ? '#999' : 'black',

    borderColor: props.error ? 'red' : '#EFEFEF',
    ':focus': {
      outlineColor: props.error ? 'red' : 'black',
    },
  };

  return (
    <div>
      {props.kind == 'select' ? (
        <select {...props.register} css={style}>
          <option value="">{props.placeHolder}</option>
          {props.options!.map((e, i) => (
              <option style={{ color: 'black' }} key={i} value={e}>
              {e}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...props.register}
          css={style}
          placeholder={props.placeHolder}
          type={props.kind ? 'password' : 'text'}
        />
      )}
      <p
        style={{
          color: 'red',
          fontSize: '.8em',
          margin: '.4em 0',
        }}
      >
        {props.error}&nbsp;
      </p>
    </div>
  );
}
