import * as React from 'react';
import { Heading, Hero, Tile, Tabs, Box} from 'react-bulma-components';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';
import { Recipe } from '../models/Recipe';

type Tab = {id: number, name: string, recipes: Recipe[]}

interface TabContent {
  tabContent: Tab
}

function SingleTab(props : TabContent) {
  return (
    <>
      <Heading>{props.tabContent.name}</Heading>
        {props.tabContent.recipes.map((recipe) =>
        <>
          <Box>{recipe.title}</Box>
          <Box>{recipe.summary}</Box>
        </>
        )}
    </>
  )
}

interface TabList {
  tabList: Tab[]
}

function SearchTabs(props : TabList) {
  let activeTab : number = 1

  const changeActiveTab = (id: number) => {
    activeTab = id
  }

  return (
    <>
      {props.tabList.map((tab) => {
        <Tabs.Tab onClick={() => changeActiveTab(tab.id)} active={activeTab==tab.id}><SingleTab tabContent = {tab}/></Tabs.Tab>
      })}
    </>
  )
}

export default function SearchPage() {
  const tabList : Tab[] = [
    {
      id: 1,
      name: "Oppskrifter",
      recipes: []
    },
    {
      id: 1,
      name: "Ingredienser",
      recipes: []
    }
  ]

  return (
    <Hero>
      <Hero.Body>
        <Heading>Search</Heading>
        <Tile>
          <Tabs>         
             <SearchTabs tabList = {tabList}/>
          </Tabs>
        </Tile>
      </Hero.Body>
    </Hero>
  );
}