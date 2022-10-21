import React from 'react';
import 'bulma/css/bulma.min.css';
import { Button, Card, Image, Media, Heading, Content, Icon } from 'react-bulma-components';
import {useState} from 'react';
import { FaArrowRight, FaThumbsUp } from 'react-icons/fa';

function RecipeCard() {
    return(
        <>
            <Card style={{ width: 300, margin: 'auto' }}>
                <Card.Image size="4by3" src="https://cdn.discordapp.com/attachments/894239765430419549/1032295931435036772/unknown.png" />
                <Card.Content>
                    <Media>
                        <Media.Item>
                            <Image size={64} alt="64x64" src="https://media.discordapp.net/attachments/894239765430419549/1032296471632019466/unknown.png" />
                        </Media.Item>
                        <Media.Item>
                            <Heading size={4}>
                                Brunost
                            </Heading>
                            <Heading subtitle size={6}>
                                @Norwegian
                            </Heading>
                        </Media.Item>
                    </Media>
                    <Content>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Phasellus nec iaculis mauris.
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
                    <Card.Footer.Item renderAs="a" href="/recipe/{id}">
                        Read more 
                        <br />
                        <Icon>
                            <FaArrowRight />
                        </Icon>
                    </Card.Footer.Item>
                </Card.Footer>
            </Card>
        </>
    )
}

export default RecipeCard;