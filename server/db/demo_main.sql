INSERT INTO recipe SET title='Burek', summary='Burek is a popular Balkan dish made of filo pastry, filled with spiced minced meat and onions, and baked until golden brown.', instructions='1. Preheat oven to 400 degrees F (200 degrees C). Lightly grease a 9x13 inch baking dish.\n2. In a large skillet over medium heat, cook the ground beef, onion, and garlic until meat is browned and onion is tender. Drain off excess grease. Stir in the paprika, salt, pepper, and cumin. Cook for 1 minute, then remove from heat.\n3. Place 1 sheet of phyllo dough on a clean work surface. Brush lightly with melted butter. Top with another sheet of phyllo, and brush with butter. Continue layering phyllo and butter until you have 6 sheets stacked. Cut the stack in half lengthwise, then cut each half crosswise into 3 strips. Spoon 1/3 of the meat mixture down the center of each strip. Fold the ends of the dough over the filling, then roll up to enclose. Place the rolls, seam side down, in the prepared baking dish. Repeat with remaining phyllo, butter, and meat mixture.\n4. Bake in the preheated oven until golden brown, about 30 minutes. Serve hot.', servings=4, imageUrl='https://www.allrecipes.com/recipe/228183/burek/', videoUrl='https://www.youtube.com/watch?v=Z9Z9Z9Z9Z9Z9';

INSERT INTO ingredient SET name='ground beef';
INSERT INTO ingredient SET name='onion';
INSERT INTO ingredient SET name='garlic';
INSERT INTO ingredient SET name='paprika';
INSERT INTO ingredient SET name='salt';
INSERT INTO ingredient SET name='pepper';

INSERT INTO unit SET name='lb';
INSERT INTO unit SET name='cup';
INSERT INTO unit SET name='tsp';
INSERT INTO unit SET name='tbsp';
INSERT INTO unit SET name='g';
INSERT INTO unit SET name='kg';
INSERT INTO unit SET name='oz';
INSERT INTO unit SET name='ml';
INSERT INTO unit SET name='l';
INSERT INTO unit SET name='gal';
INSERT INTO unit SET name='dl';

INSERT INTO recipe_ingredient SET recipeId=1, ingredientId=1, unitId=1, quantity=1;
INSERT INTO recipe_ingredient SET recipeId=1, ingredientId=2, unitId=2, quantity=2;
INSERT INTO recipe_ingredient SET recipeId=1, ingredientId=3, unitId=2, quantity=5;
INSERT INTO recipe_ingredient SET recipeId=1, ingredientId=4, unitId=5, quantity=2;
INSERT INTO recipe_ingredient SET recipeId=1, ingredientId=5, unitId=6, quantity=1;
INSERT INTO recipe_ingredient SET recipeId=1, ingredientId=6, unitId=7, quantity=2;

INSERT INTO recipe_tag SET recipeId=1, name='meat';
INSERT INTO recipe_tag SET recipeId=1, name='dinner';
