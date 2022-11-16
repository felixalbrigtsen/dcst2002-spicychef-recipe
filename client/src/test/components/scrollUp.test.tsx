import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent, getAllByLabelText, getByLabelText } from '@testing-library/react';
import '@testing-library/jest-dom'
import ScrollButton from '../../components/ScrollUp'

const spyScrollTo = jest.fn();

describe('Dynamic ScrollButton test', () => {
    beforeEach(() => {
        Object.defineProperty(global.window, 'scrollTo', { value: spyScrollTo });
        Object.defineProperty(global.window, 'scrollY', { value: 1 });
        spyScrollTo.mockClear();
    });

    test('Test visibility', () => {
        const {getByRole} = render(<ScrollButton/>)
        let button = getByRole("button", {hidden: true})
        expect(button).not.toBeVisible

        fireEvent.scroll(window, {target: {scrollY: 300}})
        expect(button).toBeVisible
    });

    test('Test scroll', () => {
        fireEvent.scroll(window, {target: {scrollY: 300}})

        const {getByRole} = render(<ScrollButton/>)
        let button = getByRole("button", {hidden: true})
        
        expect(button).toBeVisible
        fireEvent.click(button)
        expect(spyScrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth',
        });
    });
});