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

describe('Dynamic ScrollButton test', () => {
    test('Test visibility', () => {
        const {getByRole} = render(<ScrollButton/>)
        let icon = getByRole("button", {hidden: true})
        expect(icon).not.toBeVisible

        fireEvent.scroll(window, {target: {scrollY: 300}})
        expect(icon).toBeVisible
    })
    test.skip('Test scroll', () => {
        fireEvent.scroll(window, {target: {scrollY: 300}})

        const {getByRole} = render(<ScrollButton/>)
        let icon = getByRole("button", {hidden: true})
        
        expect(icon).toBeVisible
        fireEvent.click(icon)
        expect(window.scrollY).toBe(0);
    })
})