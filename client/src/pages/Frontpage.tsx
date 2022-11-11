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
import { mdiListBox, mdiShakerOutline, mdiFoodDrumstick, mdiFoodSteak, mdiCarrot, mdiMagnify, mdiArrowRight, mdiLoginVariant} from '@mdi/js';
import Footer from '../components/Footer';
import { Recipe } from '../models/Recipe';

import ImageSlider from '../components/ImageSlider';


function Home () {
  const { user } = useLogin();

    // choose a random recipe from the list of recipes
    let [ recipeList, setRecipeList ] = React.useState<Recipe[]>([]);
    let [ randomRecipe, setRandomRecipe ] = React.useState<Recipe>({id: 0, title: "", summary: "", instructions: "", servings: 0, imageUrl: "", videoUrl: "", created_at: "", ingredients: [], tags: [], likes: 0});
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
                            <Tile size={8} vertical style={{alignItems: "center !important"}}>
                                <Tile kind="parent">
                                        <Tile kind="child" renderAs={Notification} color="danger">
                                            <Heading>Welcome, {user.name || 'Guest'}</Heading>
                                            <Heading subtitle>This is the SpicyChef Recipe Book</Heading>
                                        </Tile>
                                    </Tile>
                                <Tile>
                                <Tile kind="parent">
                                        <Tile kind="child" renderAs={Notification} color="info">
                                            <Heading>Recipes</Heading>
                                                <Form.Field style={{width: '100%'}}>
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
                                            <Heading>Explore SpicyChef</Heading>
                                            <Heading subtitle>Useful links</Heading>
                                            <Link to="/ingredients">
                                            <Button color="info" className='is-light is-rounded'>
                                                <span><Heading>Ingredients</Heading></span>
                                                <Icon path={mdiCarrot} size={1} />
                                                <Icon path={mdiFoodSteak} size={1} />
                                                <Icon path={mdiFoodDrumstick} size={1} />
                                                <Icon path={mdiShakerOutline} size={1} />
                                            </Button>
                                            </Link>
                                            <br />
                                            <Link to="/list">
                                            <Button color="info" className="is-light is-rounded mt-2">
                                                <span><Heading>Shopping List</Heading></span>
                                                <Icon path={mdiListBox} size={1} />
                                            </Button>
                                            </Link>                                            
                                            <br />
                                            <Link to="/search">
                                            <Button color="info" className="is-light is-rounded mt-2">
                                                <span><Heading>Search</Heading></span>
                                                <Icon path={mdiMagnify} size={1} />
                                            </Button>
                                            </Link>
                                            { user.googleId && <> 
                                            <br />
                                            <Link to="/login">
                                            <Button color="info" className="is-light is-rounded mt-2">
                                                <span><Heading>Login</Heading></span>
                                                <Icon path={mdiLoginVariant} size={1} />
                                            </Button>
                                            </Link>
                                            </> }
                                        </Tile>
                                        <Tile kind="child" renderAs={Notification} color="warning">
                                            <Heading>Most Liked Recipes</Heading>
                                            <Heading subtitle>Try out our favorites</Heading>

                                            { recipeList.sort((a, b) => b.likes - a.likes).slice(0, 3).map((recipe, index) => {
                                                return (
                                                    <Link to={`/recipes/${recipe.id}`} key={index}>
                                                        <Media className="columns">
                                                            <Media.Item renderAs="figure" className="column is-one-quarters">
                                                                <Image size={96} alt="96x96" src={recipe.imageUrl || "/logo.png"} />
                                                            </Media.Item>
                                                            <Media.Item renderAs="article" align="left" className="column is-three-quarters">
                                                                <Heading size={5} className="has-text-left">{recipe.title}</Heading>
                                                                <Heading subtitle size={6}>{recipe.summary}</Heading>
                                                            </Media.Item>
                                                        </Media>
                                                    </Link>
                                                )
                                            }) }
                                        </Tile>
                                    </Tile>
                                </Tile>
                        </Tile>
                                <Tile kind="parent">
                                    <Tile kind="child" renderAs={Notification} color="success">
                                        <div className="content" style={{margin:'auto'}}>
                                            <Heading className='has-text-centered'>Selected Recipe</Heading>
                                            {randomRecipe ? 
                                            <Link to={`/recipes/${randomRecipe.id}`} style={{textDecoration: "none"}}>
                                            <Image size={256} alt="256x256" src={(randomRecipe && randomRecipe.imageUrl) ? randomRecipe.imageUrl : "https://bulma.io/images/placeholders/256x256.png" } />
                                            </Link>
                                            : <Heading subtitle>There are no images to display</Heading>}
                                            <Media>
                                                <Media.Item>
                                                    <Heading subtitle className='has-text-centered'>{randomRecipe ? randomRecipe.title : ""}</Heading>
                                                    <Content>
                                                    {randomRecipe ? randomRecipe.summary : ""}
                                                    </Content>
                                                </Media.Item>
                                            </Media>
                                            <br />
                                            {randomRecipe ? 
                                            <Link to={`/recipes/${randomRecipe.id}`} style={{textDecoration: "none"}}>
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
