import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import { Hero, Section, Tile, Heading, Box, Image, Notification, Form, Button } from 'react-bulma-components';

import Icon from '@mdi/react'
// @ts-ignore
import { mdiCart, mdiBasket, mdiShakerOutline, mdiFoodDrumstick, mdiFoodSteak, mdiCarrot, mdiMagnify } from '@mdi/js';

import Footer from './components/Footer';
import RecipeCard from './components/RecipeCard';

function Home () {
    return (
        <>
            <Hero>
                <Hero.Body>
                        <Tile kind="ancestor">
                            <Tile size={8} vertical>
                                {/* <Tile kind="parent">
                                        <Tile kind="child" renderAs={Notification} color="danger">
                                            <Heading>Welcome</Heading>
                                            <Heading subtitle>This is the SpicyChef Recipe Book</Heading>
                                            <div className="content" />
                                        </Tile>
                                    </Tile> */}
                                <Tile>
                                <Tile kind="parent">
                                        <Tile kind="child" renderAs={Notification} color="info">
                                            <Heading>Recipes</Heading>
                                                <Form.Field>
                                                    <Form.Label style={{color:"white"}}>
                                                        <Heading subtitle>Explore Recipes</Heading>
                                                    </Form.Label>
                                                    <Form.Control className="has-icons-right">
                                                        <Form.Input placeholder="Search for a recipe"/>
                                                            <span className="icon is-small is-right">
                                                                <Icon path={mdiMagnify} size={1}/> 
                                                            </span>
                                                    </Form.Control>
                                                </Form.Field>
                                        </Tile>
                                    </Tile>
                                    <Tile kind="parent" vertical>
                                        <Tile kind="child" renderAs={Notification} color="primary">
                                            <Heading>Ingredients</Heading>
                                            <Heading subtitle>Explore Ingredients</Heading>
                                            <Button renderAs={Notification} color="primary" className='is-rounded'>
                                            <Icon path={mdiCarrot} size={1} color="white" />
                                            <Icon path={mdiFoodSteak} size={1} color="white" />
                                            <Icon path={mdiFoodDrumstick} size={1} color="white" />
                                            <Icon path={mdiShakerOutline} size={1} color="white" />
                                            </Button>
                                        </Tile>
                                        <Tile kind="child" renderAs={Notification} color="warning">
                                            <Heading>Shopping Cart</Heading>
                                            <Heading subtitle>Check out Your Shopping Cart</Heading>
                                            <Button renderAs={Notification} color="warning" className="is-rounded">
                                                <Icon path={mdiCart} size={1} />
                                            </Button>
                                            
                                        </Tile>
                                    </Tile>
                                </Tile>
                        </Tile>
                                <Tile kind="parent">
                                    <Tile kind="child" renderAs={Notification} color="success">
                                        <div className="content">
                                            <Heading>Selected Recipe</Heading>
                                            <RecipeCard />
                                        </div>
                                    </Tile>
                                </Tile>
                    </Tile>
                </Hero.Body>
                <Hero.Footer>
                    <Footer />
                </Hero.Footer>
            </Hero>
        </>
    );
}

export default Home;
