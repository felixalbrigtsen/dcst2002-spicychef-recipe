import React from 'react';
import 'bulma/css/bulma.min.css';
import { Button, Card, Image, Media, Heading, Content, Icon } from 'react-bulma-components';
import {useState} from 'react';
import { FaArrowRight, FaThumbsUp } from 'react-icons/fa';
import { useLogin } from '../hooks/Login';
import { Link } from 'react-router-dom';

import recipeService from '../services/recipe-service';
import { Recipe } from '../models/Recipe';

import { useAlert } from '../hooks/Alert';

interface RecipeCardProps {
    recipe: Recipe;
}

function RecipeCard(props: RecipeCardProps) {

    const { appendAlert } = useAlert();
    const { user } = useLogin();

    return(
        <>
            <Card style={{ width: 300, margin: 'auto' }}>
            <Link to={`/recipes/${props.recipe.id}`}><Card.Image size="4by3" src={props.recipe.imageUrl} /></Link>
                <Card.Content style={{minHeight: 150}}>
                    <Media>
                        <Media.Item>
                        <Link to={`/recipes/${props.recipe.id}`} className='is-flex is-vcentered'>
                            <Heading size={4}>
                                {props.recipe.title}
                            </Heading>
                        </Link>
                        </Media.Item>
                    </Media>
                    <Content>
                        {props.recipe.summary}
                    </Content>
                </Card.Content>
                <Card.Footer>
                    { user.googleId ? 
                        <Card.Footer.Item>
                        { user.googleId && user.likes.includes(props.recipe.id) ?
                            <>
                            <Button className="is-rounded" color="success">
                                <Icon>
                                     <FaThumbsUp size={18} onClick={() => 
                                    recipeService.removeLike(props.recipe.id)
                                    .then(() => {appendAlert('Recipe removed from favorites', 'info')})
                                    .catch(() => {appendAlert('Failed to remove recipe from favorites', 'danger')})
                                    }/>
                                </Icon>
                            </Button>
                            <span>{props.recipe.likes != null ? props.recipe.likes : 0}</span>
                            </>
                            : 
                            <>
                            <Button className="is-rounded" color="info" outlined>
                                <Icon>
                                     <FaThumbsUp size={18} onClick={() => 
                                    recipeService.addLike(props.recipe.id)
                                    .then(() => {appendAlert('Recipe added to favorites', 'success')})
                                    .catch(() => {appendAlert('Failed to add recipe to favorites', 'danger')})
                                    }/>
                                </Icon>
                            </Button>
                            <span>{props.recipe.likes != null ? props.recipe.likes : 0}</span>
                            </>
                        }
                        </Card.Footer.Item>
                        : 
                        <Card.Footer.Item>
                            <Button className="is-rounded" color="info" outlined disabled>
                                <Icon>
                                    <FaThumbsUp size={18} />
                                </Icon>
                            </Button>
                            <span>{props.recipe.likes != null ? props.recipe.likes : 0}</span>
                        </Card.Footer.Item>
                    }
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