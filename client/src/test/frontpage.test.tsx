import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link
} from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import App from '../App';
import Home from '../pages/Frontpage'
import { randomBytes } from 'crypto';

const shortRecipes = [
  {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","likes":null,"tags":["Lamb","Soup","Tunisian"]},
  {"id":2,"title":"Choc Chip Pecan Pie","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/rqvwxt1511384809.jpg","likes":null,"tags":["American","Desert","Dessert","Nutty","Pie","Sweet"]},
  {"id":3,"title":"Bigos (Hunters Stew)","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/md8w601593348504.jpg","likes":null,"tags":["Polish","Pork"]},
  {"id":4,"title":"Turkey Meatloaf","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/ypuxtw1511297463.jpg","likes":null,"tags":["Alcoholic","British","Miscellaneous"]},
  {"id":5,"title":"Beef and Oyster pie","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/wrssvt1511556563.jpg","likes":null,"tags":["Beef","British","Pie"]}
]

const Recipes = [
  {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.\r\nKeep a tablespoon of fat in the casserole and discard the rest. Reduce to medium heat then add the garlic, onion and spinach and cook until the onion is translucent and the spinach wilted or about 5 minutes.\r\nReturn the lamb to the casserole with the onion-spinach mixture, add the tomato puree, cumin, harissa, chicken, chickpeas, lemon juice, salt and pepper in the pan. Simmer over low heat for about 20 minutes.\r\nAdd the pasta and cook for 15 minutes or until pasta is cooked.","servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":"2022-11-02T19:23:43.000Z","recipeId":null,"likes":null,"tags":["Lamb","Soup","Tunisian"],"ingredients":[{"id":1,"unitId":1,"quantity":500,"ingredientName":"Lamb Mince","unitName":"g"},{"id":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"},{"id":3,"unitId":3,"quantity":1,"ingredientName":"Onion","unitName":"units"},{"id":6,"unitId":4,"quantity":1,"ingredientName":"Cumin","unitName":"tbs"},{"id":5,"unitId":4,"quantity":3,"ingredientName":"Tomato Puree","unitName":"tbs"},{"id":4,"unitId":1,"quantity":300,"ingredientName":"Spinach","unitName":"g"},{"id":7,"unitId":5,"quantity":1,"ingredientName":"Chicken Stock","unitName":"Litre"},{"id":8,"unitId":6,"quantity":3,"ingredientName":"Harissa Spice","unitName":"tsp"},{"id":9,"unitId":1,"quantity":400,"ingredientName":"Chickpeas","unitName":"g"},{"id":10,"unitId":3,"quantity":0.5,"ingredientName":"Lemon Juice","unitName":"units"},{"id":11,"unitId":1,"quantity":150,"ingredientName":"Macaroni","unitName":"g"},{"id":12,"unitId":7,"quantity":1,"ingredientName":"Salt","unitName":"Pinch"},{"id":13,"unitId":7,"quantity":1,"ingredientName":"Pepper","unitName":"Pinch"}]},
  {"id":2,"title":"Choc Chip Pecan Pie","summary":"Meal from MealDB","instructions":"First, make the pastry. Tip the ingredients into a food processor with 1 /4 tsp salt. Blend until the mixture resembles breadcrumbs. Drizzle 2-3 tsp cold water into the funnel while the blade is running – the mixture should start to clump together. Tip onto a work surface and bring together, kneading briefly into a ball. Pat into a disc, wrap in cling film, and chill for at least 20 mins. Heat oven to 200C/180C fan/gas 6.\r\n\r\nRemove the pastry from the fridge and leave at room temperature for 5 mins to soften. Flour the work surface, then unwrap the pastry and roll to a circle the thickness of a £1 coin. Use the pastry to line a deep, 23cm round fluted tin – mine was about 3cm deep. Press the pastry into the corners and up the sides, making sure there are no gaps. Leave 1cm pastry overhanging (save some of the pastry scraps for later). Line with baking parchment (scrunch it up first to make it more pliable) and fill with baking beans. Blind-bake for 15-20 mins until the sides are set, then remove the parchment and beans and return to the oven for 5 mins until golden brown. Trim the pastry so it’s flush with the top of the tin – a small serrated knife is best for this. If there are any cracks, patch them up with the pastry scraps.\r\n\r\nMeanwhile, weigh the butter, syrup and sugars into a pan, and add 1 /4 tsp salt. Heat until the butter has melted and the sugar dissolved, stirring until smooth. Remove from the heat and cool for 10 mins. Reduce oven to 160C/140C fan/gas 3.\r\n\r\nBeat the eggs in a bowl. Add the syrup mixture, vanilla and pecans, and mix until well combined. Pour half the mixture into the tart case, scatter over half the chocolate chips, then cover with the remaining filling and chocolate chips. Bake on the middle shelf for 50-55 mins until set. Remove from the oven and leave to cool, then chill for at least 2 hrs before serving.","servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/rqvwxt1511384809.jpg","videoUrl":"https://www.youtube.com/watch?v=fDpoT0jvg4Y","created_at":"2022-11-02T19:23:51.000Z","recipeId":null,"likes":null,"tags":["American","Desert","Dessert","Nutty","Pie","Sweet"],"ingredients":[{"id":14,"unitId":1,"quantity":300,"ingredientName":"Plain Flour","unitName":"g"},{"id":15,"unitId":1,"quantity":75,"ingredientName":"Butter","unitName":"g"},{"id":16,"unitId":1,"quantity":100,"ingredientName":"Cream Cheese","unitName":"g"},{"id":17,"unitId":8,"quantity":1,"ingredientName":"Icing Sugar","unitName":"tbls"},{"id":15,"unitId":1,"quantity":150,"ingredientName":"Butter","unitName":"g"},{"id":18,"unitId":9,"quantity":200,"ingredientName":"Maple Syrup","unitName":"ml"},{"id":19,"unitId":1,"quantity":250,"ingredientName":"Light Brown Soft Sugar","unitName":"g"},{"id":20,"unitId":1,"quantity":100,"ingredientName":"Dark Brown Soft Sugar","unitName":"g"},{"id":21,"unitId":3,"quantity":4,"ingredientName":"Eggs","unitName":"units"},{"id":22,"unitId":6,"quantity":1,"ingredientName":"Vanilla Extract","unitName":"tsp"},{"id":23,"unitId":1,"quantity":400,"ingredientName":"Pecan Nuts","unitName":"g"},{"id":24,"unitId":1,"quantity":200,"ingredientName":"Dark Chocolate Chips","unitName":"g"}]},
  {"id":3,"title":"Bigos (Hunters Stew)","summary":"Meal from MealDB","instructions":"Preheat the oven to 350 degrees F (175 degrees C).\r\n\r\nHeat a large pot over medium heat. Add the bacon and kielbasa; cook and stir until the bacon has rendered its fat and sausage is lightly browned. Use a slotted spoon to remove the meat and transfer to a large casserole or Dutch oven.\r\n\r\nCoat the cubes of pork lightly with flour and fry them in the bacon drippings over medium-high heat until golden brown. Use a slotted spoon to transfer the pork to the casserole. Add the garlic, onion, carrots, fresh mushrooms, cabbage and sauerkraut. Reduce heat to medium; cook and stir until the carrots are soft, about 10 minutes. Do not let the vegetables brown.\r\n\r\nDeglaze the pan by pouring in the red wine and stirring to loosen all of the bits of food and flour that are stuck to the bottom. Season with the bay leaf, basil, marjoram, paprika, salt, pepper, caraway seeds and cayenne pepper; cook for 1 minute.\r\n\r\nMix in the dried mushrooms, hot pepper sauce, Worcestershire sauce, beef stock, tomato paste and tomatoes. Heat through just until boiling. Pour the vegetables and all of the liquid into the casserole dish with the meat. Cover with a lid.\r\n\r\nBake in the preheated oven for 2 1/2 to 3 hours, until meat is very tender.","servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/md8w601593348504.jpg","videoUrl":"https://www.youtube.com/watch?v=Oqg_cO4s8ik","created_at":"2022-11-02T19:24:07.000Z","recipeId":null,"likes":null,"tags":["Polish","Pork"],"ingredients":[{"id":25,"unitId":10,"quantity":2,"ingredientName":"Bacon","unitName":"sliced"},{"id":27,"unitId":11,"quantity":1,"ingredientName":"Pork","unitName":"lb"},{"id":26,"unitId":11,"quantity":1,"ingredientName":"Kielbasa","unitName":"lb"},{"id":2,"unitId":13,"quantity":3,"ingredientName":"Garlic","unitName":"chopped"},{"id":28,"unitId":12,"quantity":0.25,"ingredientName":"Flour","unitName":"cup"},{"id":3,"unitId":14,"quantity":1,"ingredientName":"Onion","unitName":"Diced"},{"id":29,"unitId":12,"quantity":1.5,"ingredientName":"Mushrooms","unitName":"cup"},{"id":30,"unitId":15,"quantity":4,"ingredientName":"Cabbage","unitName":"cups"},{"id":31,"unitId":16,"quantity":1,"ingredientName":"Sauerkraut","unitName":"Jar"},{"id":32,"unitId":12,"quantity":0.25,"ingredientName":"Red Wine","unitName":"cup"},{"id":33,"unitId":3,"quantity":1,"ingredientName":"Bay Leaf","unitName":"units"},{"id":34,"unitId":6,"quantity":1,"ingredientName":"Basil","unitName":"tsp"},{"id":35,"unitId":6,"quantity":1,"ingredientName":"Marjoram","unitName":"tsp"},{"id":36,"unitId":4,"quantity":1,"ingredientName":"Paprika","unitName":"tbs"},{"id":37,"unitId":17,"quantity":0.125,"ingredientName":"Caraway Seed","unitName":"teaspoon"},{"id":38,"unitId":18,"quantity":1,"ingredientName":"Hotsauce","unitName":"dash"},{"id":39,"unitId":15,"quantity":5,"ingredientName":"Beef Stock","unitName":"cups"},{"id":5,"unitId":4,"quantity":2,"ingredientName":"Tomato Puree","unitName":"tbs"},{"id":40,"unitId":12,"quantity":1,"ingredientName":"Diced Tomatoes","unitName":"cup"},{"id":41,"unitId":18,"quantity":1,"ingredientName":"Worcestershire Sauce","unitName":"dash"}]},
  {"id":4,"title":"Turkey Meatloaf","summary":"Meal from MealDB","instructions":"Heat oven to 180C/160C fan/gas 4. Heat the oil in a large frying pan and cook the onion for 8-10 mins until softened. Add the garlic, Worcestershire sauce and 2 tsp tomato purée, and stir until combined. Set aside to cool.\r\n\r\nPut the turkey mince, egg, breadcrumbs and cooled onion mix in a large bowl and season well. Mix everything to combine, then shape into a rectangular loaf and place in a large roasting tin. Spread 2 tbsp barbecue sauce over the meatloaf and bake for 30 mins.\r\n\r\nMeanwhile, drain 1 can of beans only, then pour both cans into a large bowl. Add the remaining barbecue sauce and tomato purée. Season and set aside.\r\n\r\nWhen the meatloaf has had its initial cooking time, scatter the beans around the outside and bake for 15 mins more until the meatloaf is cooked through and the beans are piping hot. Scatter over the parsley and serve the meatloaf in slices.","servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/ypuxtw1511297463.jpg","videoUrl":"https://www.youtube.com/watch?v=mTvlmY4vCug","created_at":"2022-11-02T19:24:16.000Z","recipeId":null,"likes":null,"tags":["Alcoholic","British","Miscellaneous"],"ingredients":[{"id":42,"unitId":19,"quantity":1,"ingredientName":"Olive Oil","unitName":"tblsp"},{"id":3,"unitId":20,"quantity":1,"ingredientName":"Onion","unitName":"large"},{"id":2,"unitId":21,"quantity":1,"ingredientName":"Garlic","unitName":"clove peeled crushed"},{"id":5,"unitId":6,"quantity":3,"ingredientName":"Tomato Puree","unitName":"tsp"},{"id":41,"unitId":19,"quantity":2,"ingredientName":"Worcestershire Sauce","unitName":"tblsp"},{"id":43,"unitId":1,"quantity":500,"ingredientName":"Turkey Mince","unitName":"g"},{"id":21,"unitId":20,"quantity":1,"ingredientName":"Eggs","unitName":"large"},{"id":44,"unitId":1,"quantity":85,"ingredientName":"Breadcrumbs","unitName":"g"},{"id":45,"unitId":19,"quantity":2,"ingredientName":"Barbeque Sauce","unitName":"tblsp"},{"id":46,"unitId":1,"quantity":800,"ingredientName":"Cannellini Beans","unitName":"g"},{"id":47,"unitId":19,"quantity":2,"ingredientName":"Parsley","unitName":"tblsp"}]},
  {"id":5,"title":"Beef and Oyster pie","summary":"Meal from MealDB","instructions":"Season the beef cubes with salt and black pepper. Heat a tablespoon of oil in the frying pan and fry the meat over a high heat. Do this in three batches so that you don’t overcrowd the pan, transferring the meat to a large flameproof casserole dish once it is browned all over. Add extra oil if the pan seems dry.\r\nIn the same pan, add another tablespoon of oil and cook the shallots for 4-5 minutes, then add the garlic and fry for 30 seconds. Add the bacon and fry until slightly browned. Transfer the onion and bacon mixture to the casserole dish and add the herbs.\r\nPreheat the oven to 180C/350F/Gas 4.\r\nPour the stout into the frying pan and bring to the boil, stirring to lift any stuck-on browned bits from the bottom of the pan. Pour the stout over the beef in the casserole dish and add the stock. Cover the casserole and place it in the oven for 1½-2 hours, or until the beef is tender and the sauce is reduced.\r\nSkim off any surface fat, taste and add salt and pepper if necessary, then stir in the cornflour paste. Put the casserole dish on the hob – don’t forget that it will be hot – and simmer for 1-2 minutes, stirring, until thickened. Leave to cool.\r\nIncrease the oven to 200C/400F/Gas 6. To make the pastry, put the flour and salt in a very large bowl. Grate the butter and stir it into the flour in three batches. Gradually add 325ml/11fl oz cold water – you may not need it all – and stir with a round-bladed knife until the mixture just comes together. Knead the pastry lightly into a ball on a lightly floured surface and set aside 250g/9oz for the pie lid.\r\nRoll the rest of the pastry out until about 2cm/¾in larger than the dish you’re using. Line the dish with the pastry then pile in the filling, tucking the oysters in as well. Brush the edge of the pastry with beaten egg.\r\nRoll the remaining pastry until slightly larger than your dish and gently lift over the filling, pressing the edges firmly to seal, then trim with a sharp knife. Brush with beaten egg to glaze. Put the dish on a baking tray and bake for 25-30 minutes, or until the pastry is golden-brown and the filling is bubbling.","servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/wrssvt1511556563.jpg","videoUrl":"https://www.youtube.com/watch?v=ONX74yP6JnI","created_at":"2022-11-02T19:24:29.000Z","recipeId":null,"likes":null,"tags":["Beef","British","Pie"],"ingredients":[{"id":48,"unitId":1,"quantity":900,"ingredientName":"Beef","unitName":"g"},{"id":42,"unitId":4,"quantity":3,"ingredientName":"Olive Oil","unitName":"tbs"},{"id":49,"unitId":3,"quantity":3,"ingredientName":"Shallots","unitName":"units"},{"id":25,"unitId":1,"quantity":125,"ingredientName":"Bacon","unitName":"g"},{"id":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"},{"id":50,"unitId":22,"quantity":1,"ingredientName":"Thyme","unitName":"tbs chopped"},{"id":33,"unitId":3,"quantity":2,"ingredientName":"Bay Leaf","unitName":"units"},{"id":51,"unitId":9,"quantity":330,"ingredientName":"Stout","unitName":"ml"},{"id":39,"unitId":9,"quantity":400,"ingredientName":"Beef Stock","unitName":"ml"},{"id":52,"unitId":4,"quantity":2,"ingredientName":"Corn Flour","unitName":"tbs"},{"id":53,"unitId":3,"quantity":8,"ingredientName":"Oysters","unitName":"units"},{"id":14,"unitId":1,"quantity":400,"ingredientName":"Plain Flour","unitName":"g"},{"id":12,"unitId":7,"quantity":1,"ingredientName":"Salt","unitName":"Pinch"},{"id":15,"unitId":1,"quantity":250,"ingredientName":"Butter","unitName":"g"},{"id":21,"unitId":23,"quantity":1,"ingredientName":"Eggs","unitName":"To Glaze"}]}
]

jest.mock('../services/recipe-service', () => {
  class TaskService {
    getRecipesShort() {
      return Promise.resolve(shortRecipes);
    }

    getRecipe(id: number) {
      return Promise.resolve(Recipes.find(t => t.id === id));
    }

    search(query: string) {
      return Promise.resolve(Recipes.find(t => t.title.indexOf(query) >= 0)); // Same as: return new Promise((resolve) => resolve(4));
    }
  }
  return new TaskService();
});

test('Navbar is rendered', () => {
  render(<App />);

  waitFor(() => {
    const navbar = <nav className="navbar is-link" role=" navigation" />

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

describe('Frontpage component tests', () => {
  test('Correct welcome text', async () => {
    const {getByText} = render(<Router><Home /></Router>)

    await (waitFor(() => {
      expect(getByText('Welcome, Guest')).toBeInTheDocument();
      expect(getByText('This is the SpicyChef Recipe Book')).toBeInTheDocument();
    }));
  });

  test('random selected recipe', async () => {
    const {getByText} = render(<Router><Home /></Router>)

    await (waitFor(() => {
      let randomRecipe = false
      expect(getByText('Selected Recipe')).toBeInTheDocument();
      for (let i = 0; i < Recipes.length; i++) {
        try {
          expect(getByText(Recipes[i].title)).toBeInTheDocument()
          expect(getByText(Recipes[i].summary)).toBeInTheDocument()
          
        } catch {
          continue
        }
        randomRecipe = true
      }
      expect(randomRecipe).toBe(true)
    }))
  })
});



