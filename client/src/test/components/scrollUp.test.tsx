import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import ScrollButton from '../../components/ScrollUp'

describe('Dynamic ScrollButton test', () => {
    test.skip('Test visibility', () => {
        const {getByRole} = render(<ScrollButton/>)

        let icon = getByRole("button")

        expect(icon).not.toBeVisible

        fireEvent.scroll(window, { target: { scrollY: 100 } })

        expect(icon).toBeVisible

        fireEvent.click(icon)

        expect(icon).not.toBeVisible
    })
})