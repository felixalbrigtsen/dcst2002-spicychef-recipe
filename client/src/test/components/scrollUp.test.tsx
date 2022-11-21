import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, getAllByLabelText, act } from '@testing-library/react';
import '@testing-library/jest-dom'
import ScrollButton from '../../components/ScrollUp'

const spyScrollTo = jest.fn();

describe('Dynamic ScrollButton test', () => {
    beforeEach(() => {
        Object.defineProperty(global.window, 'scrollTo', { value: spyScrollTo });
        Object.defineProperty(global.window, 'scrollY', { value: 1 });
        spyScrollTo.mockClear();
    });

    test('Test visibility', async () => {
        act(() => {
            render(<ScrollButton/>)
        });
        await waitFor(() => {
            let button = screen.getByRole("button", {hidden: true})
            expect(button).not.toBeVisible

            act(() => {fireEvent.scroll(window, {target: {scrollY: 350}})});
            expect(button).toBeVisible
        });
        
    });

    test('Test scroll', async () => {
        act(() => {
            render(<ScrollButton/>)
        });
        await waitFor(() => {
            let button = screen.getByRole("button", {hidden: true})
            
            act(() => {fireEvent.scroll(window, {target: {scrollY: 350}})});
            expect(button).toBeVisible
            
            act(() => {fireEvent.click(button)});
            expect(spyScrollTo).toHaveBeenCalledWith({
                top: 0,
                behavior: 'smooth',
            });
            expect(button).not.toBeVisible();
        });
    });
});