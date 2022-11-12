import React from 'react';
import 'bulma/css/bulma.min.css';
import { Button, Card, Image, Media, Heading, Content, Icon } from 'react-bulma-components';
import {useState} from 'react';
import { FaArrowRight, FaThumbsUp } from 'react-icons/fa';
import { useLogin } from '../hooks/Login';
import { Link } from 'react-router-dom';

import recipeService from '../services/recipe-service';
import { Recipe } from '../models/Recipe';

interface RecipeCardProps {
    recipe: Recipe;
}

function RecipeCard(props: RecipeCardProps) {

    // const user = {
    //     googleId: 1,
    //     name: "hei",
    //     email: "hi",
    //     picture: "abc",
    //     isadmin: true,
    //     likes: [1,4],
    //     shoppingList: [1,2,3,4]
    // }
    // For development purposes

    const { user } = useLogin();

    return(
        <>
            <Card style={{ width: 300, margin: 'auto' }}>
            <Link to={`/recipe/${props.recipe.id}`}><Card.Image size="4by3" src={props.recipe.imageUrl} /></Link>
                <Card.Content style={{minHeight: 150}}>
                    <Media>
                        <Media.Item>
                        <Link to={`/recipes/${props.recipe.id}`} className='is-flex is-vcentered'>
                            <Heading size={4}>
                                {props.recipe.title}
                            </Heading>
                        </Link>
                            {/* <Heading subtitle size={6}>
                                {props.recipe.tags.map((tag) => (
                                    <Button color='dark' renderAs='span' style={{margin: '2px 2px'}} key={tag} onClick={
                                        () => {
                                            console.log(tag);
                                        }
                                    }>{tag}</Button>
                                ))}
                            </Heading> */}
                        </Media.Item>
                    </Media>
                    <Content>
                        {props.recipe.summary}
                    </Content>
                </Card.Content>
                <Card.Footer>
                    <Card.Footer.Item>
                    {/* If the recipe.id is in user.likes change the colour of the like button */}

                    { user.googleId && user.likes.includes(props.recipe.id) ?
                        <>
                        <Button className="is-rounded" color="success">
                            <Icon>
                                 <FaThumbsUp size={18} />
                            </Icon>
                        </Button>
                        <span>{props.recipe.likes != null ? props.recipe.likes : 0}</span>
                        </>
                        : 
                        <>
                        <Button className="is-rounded" color="info" outlined>
                            <Icon>
                                 <FaThumbsUp size={18}/>
                            </Icon>
                        </Button>
                        <span>{props.recipe.likes != null ? props.recipe.likes : 0}</span>
                        </>
                    }
                    
                    </Card.Footer.Item>
                    <Link to={`/recipes/${props.recipe.id}`} className='is-flex is-vcentered'>
                        <Card.Footer.Item>
                        <span>Read More</span>
                        <span className="icon">
                            <FaArrowRight />
                        </span>
                        </Card.Footer.Item>
                    </Link>
                </Card.Footer>
            </Card>
        </>
    )
}

export default RecipeCard;