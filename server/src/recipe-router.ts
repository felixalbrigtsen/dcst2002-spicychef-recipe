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
