import { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Link, useNavigate } from 'react-router-dom';
import { SigninInput, SignupInput } from '../utils/types';
import { userLogin, userRegistration } from '../api/auth';
import { useSetRecoilState } from 'recoil';
import { authAtom } from '../store/atom';

export const Auth = ({ type }: { type: 'Login' | 'Register' }) => {
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(authAtom);
  const [loading, setLoading] = useState(false);
  const [signupInput, setSignupInput] = useState<SignupInput>({
    name: '',
    email: '',
    password: '',
  });

  const [signinInput, setSigninInput] = useState<SigninInput>({
    email: '',
    password: '',
  });

  const onSignupInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setSignupInput((prevInput: any) => ({ ...prevInput, [name]: value }));
  };

  const onSigninInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setSigninInput((prevInput: any) => ({ ...prevInput, [name]: value }));
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'Register') {
        const registrationResponse = await userRegistration({ ...signupInput });
        if (registrationResponse) {
          navigate('/signin');
        }
      } else if (type === 'Login') {
        const loginResponse = await userLogin({ ...signinInput });
        if (loginResponse) {
          setAuthState({
            user: loginResponse,
            isAuthenticated: true,
          });
          localStorage.setItem('user', JSON.stringify(loginResponse));
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full w-full flex justify-center items-center'>
      <div className='bg-white h-auto w-full p-8 flex flex-col gap-6 justify-center'>
        {type === 'Register' ? (
          <div className='flex flex-col gap-1 text-center'>
            <h2 className='font-bold text-4xl'>Create an account</h2>
            <p className='text-gray-500'>
              Already have an account?{' '}
              <Link to={'/signin'} className='underline'>
                Login
              </Link>
            </p>
          </div>
        ) : (
          <div className='flex flex-col gap-1 text-center'>
            <h2 className='font-bold text-4xl'>Welcome Back! Please Sign In</h2>
            <p className='text-gray-500'>
              Not Registered Yet?{' '}
              <Link to={'/signup'} className='underline'>
                Register
              </Link>
            </p>
          </div>
        )}

        <form className='flex flex-col gap-4' onSubmit={onSubmitHandler}>
          {type === 'Register' && (
            <Input
              type='text'
              placeholder='Durgesh Dubey'
              name='name'
              label='Username'
              value={signupInput.name}
              onChange={onSignupInputChange}
            />
          )}
          <Input
            type='email'
            placeholder='me@example.com'
            name='email'
            label='Email'
            value={type === 'Register' ? signupInput.email : signinInput.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              type === 'Register'
                ? onSignupInputChange(e)
                : onSigninInputChange(e)
            }
          />
          <Input
            type='password'
            placeholder='*******'
            name='password'
            label='Password'
            value={
              type === 'Register' ? signupInput.password : signinInput.password
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              type === 'Register'
                ? onSignupInputChange(e)
                : onSigninInputChange(e)
            }
          />
          <Button
            text={
              loading
                ? 'Loading...'
                : type === 'Register'
                ? 'Sign Up'
                : 'Sign In'
            }
            type='submit'
            className='mt-4'
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};
