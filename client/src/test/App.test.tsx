import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

const shortRecipes = [
  {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","likes":null,"tags":["Lamb","Soup","Tunisian"]},
  {"id":2,"title":"Choc Chip Pecan Pie","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/rqvwxt1511384809.jpg","likes":null,"tags":["American","Desert","Dessert","Nutty","Pie","Sweet"]},
  {"id":3,"title":"Bigos (Hunters Stew)","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/md8w601593348504.jpg","likes":null,"tags":["Polish","Pork"]},
  {"id":4,"title":"Turkey Meatloaf","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/ypuxtw1511297463.jpg","likes":null,"tags":["Alcoholic","British","Miscellaneous"]},
  {"id":5,"title":"Beef and Oyster pie","summary":"Meal from MealDB","imageUrl":"https://www.themealdb.com/images/media/meals/wrssvt1511556563.jpg","likes":null,"tags":["Beef","British","Pie"]}
]

const Recipes = [
  {"id":1,"title":"Tunisian Lamb Soup","summary":"Meal from MealDB","instructions":"Add the lamb to a casserole and cook over high heat. When browned, remove from the heat and set aside.\r\nKeep a tablespoon of fat in the casserole and discard the rest. Reduce to medium heat then add the garlic, onion and spinach and cook until the onion is translucent and the spinach wilted or about 5 minutes.\r\nReturn the lamb to the casserole with the onion-spinach mixture, add the tomato puree, cumin, harissa, chicken, chickpeas, lemon juice, salt and pepper in the pan. Simmer over low heat for about 20 minutes.\r\nAdd the pasta and cook for 15 minutes or until pasta is cooked.","servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg","videoUrl":"https://www.youtube.com/watch?v=w1qgTQmLRe4","created_at":"2022-11-02T19:23:43.000Z","recipeId":null,"likes":null,"tags":["Lamb","Soup","Tunisian"],"ingredients":[{"id":1,"unitId":1,"quantity":500,"ingredientName":"Lamb Mince","unitName":"g"},{"id":2,"unitId":2,"quantity":2,"ingredientName":"Garlic","unitName":"cloves minced"},{"id":3,"unitId":3,"quantity":1,"ingredientName":"Onion","unitName":"units"},{"id":6,"unitId":4,"quantity":1,"ingredientName":"Cumin","unitName":"tbs"},{"id":5,"unitId":4,"quantity":3,"ingredientName":"Tomato Puree","unitName":"tbs"},{"id":4,"unitId":1,"quantity":300,"ingredientName":"Spinach","unitName":"g"},{"id":7,"unitId":5,"quantity":1,"ingredientName":"Chicken Stock","unitName":"Litre"},{"id":8,"unitId":6,"quantity":3,"ingredientName":"Harissa Spice","unitName":"tsp"},{"id":9,"unitId":1,"quantity":400,"ingredientName":"Chickpeas","unitName":"g"},{"id":10,"unitId":3,"quantity":0.5,"ingredientName":"Lemon Juice","unitName":"units"},{"id":11,"unitId":1,"quantity":150,"ingredientName":"Macaroni","unitName":"g"},{"id":12,"unitId":7,"quantity":1,"ingredientName":"Salt","unitName":"Pinch"},{"id":13,"unitId":7,"quantity":1,"ingredientName":"Pepper","unitName":"Pinch"}]},
  {"id":3,"title":"Bigos (Hunters Stew)","summary":"Meal from MealDB","instructions":"Preheat the oven to 350 degrees F (175 degrees C).\r\n\r\nHeat a large pot over medium heat. Add the bacon and kielbasa; cook and stir until the bacon has rendered its fat and sausage is lightly browned. Use a slotted spoon to remove the meat and transfer to a large casserole or Dutch oven.\r\n\r\nCoat the cubes of pork lightly with flour and fry them in the bacon drippings over medium-high heat until golden brown. Use a slotted spoon to transfer the pork to the casserole. Add the garlic, onion, carrots, fresh mushrooms, cabbage and sauerkraut. Reduce heat to medium; cook and stir until the carrots are soft, about 10 minutes. Do not let the vegetables brown.\r\n\r\nDeglaze the pan by pouring in the red wine and stirring to loosen all of the bits of food and flour that are stuck to the bottom. Season with the bay leaf, basil, marjoram, paprika, salt, pepper, caraway seeds and cayenne pepper; cook for 1 minute.\r\n\r\nMix in the dried mushrooms, hot pepper sauce, Worcestershire sauce, beef stock, tomato paste and tomatoes. Heat through just until boiling. Pour the vegetables and all of the liquid into the casserole dish with the meat. Cover with a lid.\r\n\r\nBake in the preheated oven for 2 1/2 to 3 hours, until meat is very tender.","servings":2,"imageUrl":"https://www.themealdb.com/images/media/meals/md8w601593348504.jpg","videoUrl":"https://www.youtube.com/watch?v=Oqg_cO4s8ik","created_at":"2022-11-02T19:24:07.000Z","recipeId":null,"likes":null,"tags":["Polish","Pork"],"ingredients":[{"id":25,"unitId":10,"quantity":2,"ingredientName":"Bacon","unitName":"sliced"},{"id":27,"unitId":11,"quantity":1,"ingredientName":"Pork","unitName":"lb"},{"id":26,"unitId":11,"quantity":1,"ingredientName":"Kielbasa","unitName":"lb"},{"id":2,"unitId":13,"quantity":3,"ingredientName":"Garlic","unitName":"chopped"},{"id":28,"unitId":12,"quantity":0.25,"ingredientName":"Flour","unitName":"cup"},{"id":3,"unitId":14,"quantity":1,"ingredientName":"Onion","unitName":"Diced"},{"id":29,"unitId":12,"quantity":1.5,"ingredientName":"Mushrooms","unitName":"cup"},{"id":30,"unitId":15,"quantity":4,"ingredientName":"Cabbage","unitName":"cups"},{"id":31,"unitId":16,"quantity":1,"ingredientName":"Sauerkraut","unitName":"Jar"},{"id":32,"unitId":12,"quantity":0.25,"ingredientName":"Red Wine","unitName":"cup"},{"id":33,"unitId":3,"quantity":1,"ingredientName":"Bay Leaf","unitName":"units"},{"id":34,"unitId":6,"quantity":1,"ingredientName":"Basil","unitName":"tsp"},{"id":35,"unitId":6,"quantity":1,"ingredientName":"Marjoram","unitName":"tsp"},{"id":36,"unitId":4,"quantity":1,"ingredientName":"Paprika","unitName":"tbs"},{"id":37,"unitId":17,"quantity":0.125,"ingredientName":"Caraway Seed","unitName":"teaspoon"},{"id":38,"unitId":18,"quantity":1,"ingredientName":"Hotsauce","unitName":"dash"},{"id":39,"unitId":15,"quantity":5,"ingredientName":"Beef Stock","unitName":"cups"},{"id":5,"unitId":4,"quantity":2,"ingredientName":"Tomato Puree","unitName":"tbs"},{"id":40,"unitId":12,"quantity":1,"ingredientName":"Diced Tomatoes","unitName":"cup"},{"id":41,"unitId":18,"quantity":1,"ingredientName":"Worcestershire Sauce","unitName":"dash"}]}
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


