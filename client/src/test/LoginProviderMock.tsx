import { render } from '@testing-library/react'
import * as React from 'react'

import { LoginContext } from '../hooks/Login';
import type { User } from '../models/User';

export const getSessionUser = jest.fn();
export const logout = jest.fn();

export const sampleUsers = {
  normal: {
    googleId: '1',
    name: 'Test User 1',
    email: '1',
    picture: '1',
    isadmin: false,
    likes: [1, 3, 5],
    shoppingList: [2, 4, 6],
  } as User,
  admin: {
    googleId: '2',
    name: 'Test User 2',
    email: '2',
    picture: '2',
    isadmin: true,
    likes: [],
    shoppingList: [],
  } as User,
  invalid: null
};


function renderWithLoginContext(child: React.ReactNode, user: User) {
  return render(
    <LoginContext.Provider value={{user: user, getSessionUser: getSessionUser, logout: logout}}>
      {child}
    </LoginContext.Provider>
  )
}

export default renderWithLoginContext;