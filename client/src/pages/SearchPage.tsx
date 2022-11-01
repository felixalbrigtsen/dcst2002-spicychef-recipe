import * as React from 'react';
import { Heading, Hero, Tile, Tabs } from 'react-bulma-components';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';


export default function SearchPage() {
  let activeTab = 1
  const tabList : {id: number, name: string, results: string}[] = [
    {
      id: 1,
      name: "Recipes",
      results: "Stuff 1"
    }, {
      id: 2,
      name: "Ingredients",
      results: "Stuff 2"
    }
  ];

  return (
    <Hero>
      <Hero.Body>
        <Heading>Search</Heading>
        <Tile>
          <Tabs>
            <Tabs.Tab><a>Oppskrifter</a></Tabs.Tab>
            <Tabs.Tab active={true}><a>Ingredienser</a></Tabs.Tab>
          </Tabs>
        </Tile>
      </Hero.Body>
    </Hero>
  );
}