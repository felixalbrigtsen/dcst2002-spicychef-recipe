import React from 'react';
import 'bulma/css/bulma.min.css';
import { Footer } from 'react-bulma-components';

function RecipeFooter() {
    return (
        <>
            <Footer className='has-text-centered is-narrow'>
                        <strong>SpicyChef</strong> by <a href="https://ctftime.org/team/200667">WackAttack</a>. All rights reserved.
            </Footer>
        </>
    )
}

export default RecipeFooter;