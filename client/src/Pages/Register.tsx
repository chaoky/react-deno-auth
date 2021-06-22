import React from 'react';
import { useForm } from 'react-hook-form';
import type { RouteComponentProps } from '@reach/router';
import { sendRegister } from '../auth';
import { Layout, FormField, FormHead } from '../Components';

export default function Register({ navigate }: RouteComponentProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: { name: '', email: '', pos: '', password: '' },
  });

  return (
    <Layout>
      <FormHead kind="register" />
      <form
        onSubmit={handleSubmit((e) => {
          sendRegister(e)
            .then(() => navigate!('/login'))
            .catch((e) => alert(e));
        })}
      >
        <FormField
          placeHolder="Your name"
          register={register('name', { required: 'please enter a name' })}
          error={errors.name?.message}
        />
        <FormField
          placeHolder="Email address"
          register={register('email', {
            required: 'please enter an email address',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'please enter a valid email address',
            },
          })}
          error={errors.email?.message}
        />
        <FormField
          placeHolder="I would describe my user type as"
          register={register('pos', { required: 'please select one' })}
          error={errors.pos?.message}
          kind="select"
          options={['Developer', 'Foo', 'Bar']}
          watch={watch('pos', '')}
        />
        <FormField
          placeHolder="Password"
          register={register('password', {
            required: 'please enter a password',
            minLength: { value: 8, message: 'minimum 8 characters' },
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
      <Disclaimer />
    </Layout>
  );
}

function Disclaimer() {
  return (
    <div style={{ fontSize: '.7em' }}>
      <span>
        By clicking the "Next" button, you agree to creating a free account, and
        to
      </span>
      <span style={{ color: '#286EFA' }}> Terms of Service </span>
      <span> and </span>
      <span style={{ color: '#286EFA' }}>Privacy Policy</span>
    </div>
  );
}
