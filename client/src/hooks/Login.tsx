import React from 'react';
import axios from 'axios';
import type { User } from '../models/User';
import { useAlert } from './Alert';

export const LoginContext = React.createContext({
  user: {} as User,
  getSessionUser: () => {},
  logout: () => {},
})

interface LoginProviderChildren {
  children: React.ReactNode | React.ReactNode[];
}

export const LoginProvider = ({ children }: LoginProviderChildren) => {
  const [user, setUser] = React.useState<User>({} as User);
  const { appendAlert } = useAlert();

  //TODO: Move to user-service
  const getSessionUser = () => {
    axios.get(process.env.REACT_APP_API_URL + '/auth/profile')
      .then((response) => {
        if (response.data) {
          setUser(response.data);
        } else {
          setUser({} as User);
        }
      })
      .catch((error) => {
        console.log(error);
        appendAlert('Failed to get user', 'danger');
      });
  };

  const logout = () => {
    axios.get(process.env.REACT_APP_API_URL + '/auth/logout')
      .then((response) => {
        setUser({} as User);
      })
      .catch((error) => {
        console.log(error);
        appendAlert('Failed to logout', 'danger');
      });
  };

  return (
      <LoginContext.Provider 
        value={{ 
          user, 
          getSessionUser, 
          logout 
        }}>
      {children}
      </LoginContext.Provider>
      );
}

export const useLogin = () => React.useContext(LoginContext);
export default LoginProvider
