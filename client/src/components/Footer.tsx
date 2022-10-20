import React from 'react';
import 'bulma/css/bulma.min.css';
import { Footer, Content } from 'react-bulma-components';

function RecipeFooter() {
    return (
        <>
            <Footer>
                <Content className="has-text-centered">
                    <p>
                        <strong>SpicyChef</strong> by <a href="https://ctftime.org/team/200667">WackAttack</a>. All rights reserved.
                    </p>
                </Content>
            </Footer>
        </>
    )
}

export default RecipeFooter;