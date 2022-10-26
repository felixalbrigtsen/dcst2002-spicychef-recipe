import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';

import recipeService from '../services/recipe-service';
import { useEffect } from 'react';

import { Hero, Section, Tile, Heading, Box, Image, Notification, Form, Button, Media, Content } from 'react-bulma-components';

import Icon from '@mdi/react'
// @ts-ignore
import { mdiCart, mdiBasket, mdiShakerOutline, mdiFoodDrumstick, mdiFoodSteak, mdiCarrot, mdiMagnify, mdiArrowRight } from '@mdi/js';

import Footer from '../components/Footer';
import RecipeCard from '../components/RecipeCard';

function Home () {
    useEffect(() => {
        recipeService.getRecipesShort().then((recipes) => {
            console.log(recipes);
        });
        let id : number = 1
        recipeService.getRecipe(id).then((recipe) => {
            console.log("---------Recipe 1?:-------------")
            console.log(recipe)
        })
        let querystring: string = "cho"
        recipeService.search(querystring).then((recipes) => {
            console.log("-----------Search---------------")
            console.log(recipes)
        })
    }, []);


    return (
        <>
            <Hero>
                <Hero.Body>
                        <Tile kind="ancestor">
                            <Tile size={8} vertical>
                                <Tile kind="parent">
                                        <Tile kind="child" renderAs={Notification} color="danger">
                                            {/* Implement if user is logged in */}
                                            <Heading>Welcome User</Heading>
                                            <Heading subtitle>This is the SpicyChef Recipe Book</Heading>
                                            <div className="content" />
                                        </Tile>
                                    </Tile>
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
                                            <Link to="/ingredients">
                                            <Button renderAs={Notification} color="primary" className='is-rounded'>
                                            <Icon path={mdiCarrot} size={1} color="white" />
                                            <Icon path={mdiFoodSteak} size={1} color="white" />
                                            <Icon path={mdiFoodDrumstick} size={1} color="white" />
                                            <Icon path={mdiShakerOutline} size={1} color="white" />
                                            </Button>
                                            </Link>
                                            <Content>
                                                Ingredient of the Day
                                                <Image src="https://cdn.discordapp.com/attachments/894239765430419549/1032295931435036772/unknown.png" />
                                            </Content>
                                        </Tile>
                                        <Tile kind="child" renderAs={Notification} color="warning">
                                            <Heading>Shopping Cart</Heading>
                                            <Heading subtitle>Check out Your Shopping Cart</Heading>
                                            <Link to="/cart">
                                            <Button renderAs={Notification} color="warning" className="is-rounded">
                                                <Icon path={mdiCart} size={1} />
                                            </Button>
                                            </Link>                                            
                                        </Tile>
                                    </Tile>
                                </Tile>
                        </Tile>
                                <Tile kind="parent">
                                    <Tile kind="child" renderAs={Notification} color="success">
                                        <div className="content">
                                            <Heading>Selected Recipe</Heading>
                                            <Image size={256} alt="256x256" src="https://bulma.io/images/placeholders/256x256.png" />
                                            <Media>
                                                <Media.Item>
                                                    <Heading subtitle>Recipe Name</Heading>
                                                    <Content>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                                                    </Content>
                                                </Media.Item>
                                            </Media>
                                            <br />
                                            <Link to="/recipe">Read More <Icon path={mdiArrowRight} size={0.75} /></Link>
                                        </div>
                                    </Tile>
                                </Tile>
                    </Tile>
                </Hero.Body>
            </Hero>
        </>
    );
}

export default Home;
