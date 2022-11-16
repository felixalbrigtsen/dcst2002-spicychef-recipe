import * as React from 'react';

import { useAlert } from '../../hooks/Alert';
import { Alerts } from '../../components/Alerts';

import { getByRole, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'

describe('Alert', () => {
  test.skip('Should not render at first', () => {
    const { container } = render(<Alerts />);
    expect(container.firstChild).not.toBeInTheDocument();
  });
});