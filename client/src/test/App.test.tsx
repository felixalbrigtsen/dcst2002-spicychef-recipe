import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

test('Navbar is rendered', () => {
  render(<App />);

  waitFor(() => {
    const navbar = <nav className="navbar is-link" role=" navigation" />

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

});
