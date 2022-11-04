import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';

import recipeService from '../services/recipe-service';
import { useEffect } from 'react';
import { useLogin } from '../hooks/Login';

import { Hero, Tile, Heading, Image, Notification, Form, Button, Media, Content } from 'react-bulma-components';

import Icon from '@mdi/react'
// @ts-ignore
import { mdiListBox, mdiShakerOutline, mdiFoodDrumstick, mdiFoodSteak, mdiCarrot, mdiMagnify, mdiArrowRight } from '@mdi/js';
import Footer from '../components/Footer';
import { Recipe } from '../models/Recipe';
import { Ingredient } from '../models/Ingredient';

import ImageSlider from '../components/ImageSlider';


function Home () {
  const { user } = useLogin();

    // // Demo of how to use the recipe service
    // useEffect(() => {
    //     recipeService.getRecipesShort().then((recipes) => {
    //         console.log(recipes);
    //     });
    //     let id : number = 1
    //     recipeService.getRecipe(id).then((recipe) => {
    //         console.log("---------Recipe 1?:-------------")
    //         console.log(recipe)
    //     })
    //     let querystring: string = "cho"
    //     recipeService.search(querystring).then((recipes) => {
    //         console.log("-----------Search---------------")
    //         console.log(recipes)
    //     })
    // }, []);

    // choose a random recipe from the list of recipes
    let [ recipeList, setRecipeList ] = React.useState<Recipe[]>([]);
    let [ randomRecipe, setRandomRecipe ] = React.useState<Recipe>({id: 0, title: "", summary: "", instructions: "", servings: 0, imageUrl: "", videoUrl: "", created_at: "", ingredients: [], tags: []});
    let [ query, setQuery ] = React.useState<string>("")

    React.useEffect(() => {
        recipeService.getRecipesShort()
        .then(data => {setRecipeList(data)});
    }, []);

    React.useEffect(() => {
        let randomRecipe = recipeList[Math.floor(Math.random() * recipeList.length)];
        setRandomRecipe(randomRecipe);
    }, [recipeList]);

    return (
        <>
            <Hero>
                <Hero.Body>
                        <Tile kind="ancestor">
                            <Tile size={8} vertical>
                                <Tile kind="parent">
                                        <Tile kind="child" renderAs={Notification} color="danger">
                                            <Heading>Welcome, {user.name || 'Guest'}</Heading>
                                            <Heading subtitle>This is the SpicyChef Recipe Book</Heading>
                                            <div className="content" />
                                        </Tile>
                                    </Tile>
                                <Tile>
                                <Tile kind="parent">
                                        <Tile kind="child" renderAs={Notification} color="info" className='is-centered'>
                                            <Heading>Recipes</Heading>
                                                <Form.Field>
                                                    <Form.Label style={{color:"white"}}>
                                                        <Link to={`/recipes`} style={{textDecoration: "none"}}>
                                                            <Button color="info" className='is-rounded'>
                                                            <span><Heading subtitle>Explore Recipes</Heading></span>
                                                            <span className="icon">
                                                                <Icon path={mdiArrowRight} size={1} />
                                                            </span>
                                                            </Button>
                                                        </Link>
                                                    </Form.Label>
                                                            <Form.Control className="has-icons-right">
                                                            <Form.Input placeholder="Search for a recipe" onChange={(event) => setQuery(event.currentTarget.value)} onKeyDown={
                                                            (event) => {
                                                                if (event.key === "Enter") {
                                                                    window.location.href = `/search/${query}`
                                                                }
                                                            }
                                                            }/>
                                                            <span className="icon is-small is-right">
                                                                <Icon path={mdiMagnify} size={1}/> 
                                                            </span>
                                                            </Form.Control>
                                                </Form.Field>
                                                { recipeList ? <ImageSlider slides={recipeList} /> : <></> }
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
                                            <Heading>Shopping List</Heading>
                                            <Heading subtitle>Check out Your Shopping List</Heading>
                                            <Link to="/list">
                                            <Button renderAs={Notification} color="warning" className="is-rounded">
                                                <Icon path={mdiListBox} size={1} />
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
                                            {randomRecipe ? 
                                            <Link to={`/recipe/${randomRecipe.id}`} style={{textDecoration: "none"}}>
                                            <Image size={256} alt="256x256" src={(randomRecipe && randomRecipe.imageUrl) ? randomRecipe.imageUrl : "https://bulma.io/images/placeholders/256x256.png" } />
                                            </Link>
                                            : <Heading subtitle>There are no images to display</Heading>}
                                            <Media>
                                                <Media.Item>
                                                    <Heading subtitle>{randomRecipe ? randomRecipe.title : ""}</Heading>
                                                    <Content>
                                                    {randomRecipe ? randomRecipe.summary : ""}
                                                    </Content>
                                                </Media.Item>
                                            </Media>
                                            <br />
                                            {randomRecipe ? 
                                            <Link to={`/recipe/${randomRecipe.id}`} style={{textDecoration: "none"}}>
                                                <Button color="success" className="is-rounded">
                                                    <span>Read more</span>
                                                    <span className="icon">
                                                        <Icon path={mdiArrowRight} size={1} />
                                                    </span>
                                                </Button>
                                            </Link>
                                            : ""}
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
