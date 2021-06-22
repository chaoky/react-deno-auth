import React, { useState } from 'react';
import { css } from '@emotion/css';
import { useEffect } from 'react';
import { RouteComponentProps, useNavigate } from '@reach/router';
import EyeSvg from './eye.svg';
import ArrowSvg from './arrow-down.svg';

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
  const navigate = useNavigate();
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
        <span
          style={{ color: '#286EFA', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={action}
        >
          {thing}
        </span>
      </div>
    </>
  );
}

export function Layout({ children }: { children: any }) {
  return (
    <div
      className={css({
        display: 'flex',
        backgroundColor: '#F9F9F9',
        '@media(max-width: 800px)': {
          flexDirection: 'column-reverse',
        },
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          minWidth: '65vw',
          minHeight: '100vh',
          flexShrink: 0,
          alignItems: 'center',
        })}
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
  const { options, watch, kind, error, register, placeHolder } = props;
  const [hidden, setHidden] = useState(() => kind == 'password');
  const style = css({
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
    color: watch == '' ? '#999' : 'black',

    borderColor: error ? 'red' : '#EFEFEF',
    ':focus-visible': {
      outlineColor: error ? 'red' : 'black',
      //fixes outline on firefox and breaks on chrome
      /* outlineStyle: 'solid', */
    },

    appearance: 'none',
  });

  const field =
    kind == 'select' ? (
      <select {...register} className={style}>
        <option value="">{placeHolder}</option>
        {options!.map((e, i) => (
          <option style={{ color: 'black' }} key={i} value={e}>
            {e}
          </option>
        ))}
      </select>
    ) : (
      <input
        {...register}
        className={style}
        placeholder={placeHolder}
        type={hidden ? 'password' : 'text'}
      />
    );

  const icon = kind && (
    <img
      src={kind == 'select' ? ArrowSvg : EyeSvg}
      style={{
        position: 'absolute',
        right: '3%',
        top: 'calc(50% - .4em)',
        height: 'auto',
        width: '.8em',
        cursor: 'pointer',
        pointerEvents: kind == 'select' ? 'none' : 'auto',
      }}
      onClick={() => setHidden(!hidden)}
    />
  );

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {field}
        {icon}
      </div>
      <p
        style={{
          color: 'red',
          fontSize: '.8em',
          margin: '.4em 0',
        }}
      >
        {error}&nbsp;
      </p>
    </div>
  );
}
