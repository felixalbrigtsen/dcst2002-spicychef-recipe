import React from 'react';
import 'bulma/css/bulma.min.css';
import { Button, Card, Image, Media, Heading, Content, Icon } from 'react-bulma-components';
import {useState} from 'react';
import { FaArrowRight, FaThumbsUp } from 'react-icons/fa';

import recipeService from '../services/recipe-service';
import { Recipe } from '../models/Recipe';

interface RecipeCardProps {
    recipe: Recipe;
}

function RecipeCard(props: RecipeCardProps) {

    return(
        <>
        {/* TODO: Fix standard card height */}
            <Card style={{ width: 300, margin: 'auto' }}>
                <Card.Image size="4by3" src={props.recipe.imageUrl} />
                <Card.Content style={{minHeight: 250}}>
                    <Media>
                        <Media.Item>
                            <Heading size={4}>
                                {props.recipe.title}
                            </Heading>
                            <Heading subtitle size={6}>
                                {props.recipe.tags.map((tag) => (
                                    <Button color='dark' renderAs='span' style={{margin: '2px 2px'}} key={tag} onClick={
                                        () => {
                                            // search for tag
                                            console.log(tag);
                                        }
                                    }>{tag}</Button>
                                ))}
                            </Heading>
                        </Media.Item>
                    </Media>
                    <Content>
                        {props.recipe.summary}
                    </Content>
                </Card.Content>
                <Card.Footer>
                    <Card.Footer.Item>
                        <Button className="is-rounded" color="primary">
                            <Icon>
                                {/* If person who is logged in has liked this recipe, change the colour o the icon */}
                                <FaThumbsUp />
                            </Icon>
                        </Button>
                    </Card.Footer.Item>
                    <a href={`/recipe/${props.recipe.id}`}>
                        <Card.Footer.Item>
                        <span>Read More</span>
                        <span className="icon">
                            <FaArrowRight />
                        </span>
                        </Card.Footer.Item>
                    </a>
                </Card.Footer>
            </Card>
        </>
    )
}

export default RecipeCard;