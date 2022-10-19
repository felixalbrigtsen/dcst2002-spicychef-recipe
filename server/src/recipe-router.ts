import express from 'express';
import recipeService from './recipe-service';

const router = express.Router();
export default router;

router.get('/' , (req, res) => {
  res.send('Hello World! You have reached the Recipe API server. Did you mean to go <a href="/">home</a>?');
});

router.get('/allRecipes' , (req, res) => {
  recipeService.getRecipes().then((recipes) => {
    res.json(recipes);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

router.get('/recipe/:id' , (req, res) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).send('Bad request');
    return;
  }
  
  recipeService.getRecipeFull(id)
    .then((recipe) => {
      if (recipe) {
        res.json(recipe);
      } else {
        res.status(404).send('Recipe not found');
      }

    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
