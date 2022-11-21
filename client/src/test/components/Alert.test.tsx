import * as React from 'react';

import { Alerts } from '../../components/Alerts';

import { getByRole, render, screen, fireEvent, act, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'

import { AlertProvider, useAlert } from '../../hooks/Alert';

describe('Alert', () => {
  test('New Alert renders empty', async () => {
    act(() => {
      render(<AlertProvider><Alerts /></AlertProvider>);
    });
    await waitFor(() => {
     expect(screen.queryAllByRole('alert')).toHaveLength(0);
    });
  });

  test.skip('New Alert renders with message', async () => {
    act(() => {
      render(<AlertProvider><Alerts /></AlertProvider>);
    });
    await waitFor(() => {
      act(() => {
        const { appendAlert } = useAlert();
        appendAlert('TestContent', 'success');
      });
      expect(screen.queryByText('TestContent')).toBeInTheDocument();
    });
  });

});