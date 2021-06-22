import React from 'react';
import type { RouteComponentProps } from '@reach/router';
import { useForm } from 'react-hook-form';

import { sendLogin } from '../auth';
import { Layout, FormField, FormHead } from '../Components';

export default function Login({ navigate }: RouteComponentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: { name: '', email: '', pos: '', password: '' },
  });

  return (
    <Layout>
      <FormHead kind="login" />
      <form
        onSubmit={handleSubmit((e) => {
          sendLogin(e)
            .then(() => navigate!('/'))
            .catch((e) => alert(e));
        })}
      >
        <FormField
          placeHolder="Your name"
          register={register('name', { required: 'please enter a name' })}
          error={errors.name?.message}
        />
        <FormField
          placeHolder="Password"
          register={register('password', {
            required: 'please enter a password',
          })}
          error={errors.password?.message}
          kind="password"
        />
        <button
          style={{
            backgroundColor: isValid ? '#286EFA' : '#EFEFEF',
            color: isValid ? 'white' : '#999',
            border: 'none',
            fontWeight: 'bold',
            padding: '1.5em',
            borderRadius: '.2em',
            fontSize: '.7em',
            width: '100%',
          }}
        >
          Next
        </button>
      </form>
    </Layout>
  );
}
