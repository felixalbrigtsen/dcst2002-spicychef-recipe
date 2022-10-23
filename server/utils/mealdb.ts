import recipeService from '../src/recipe-service';
import mealdbService from '../src/mealdb-service';

// This script is invoked by `npm run mealdb [--] action [args]`

const args = process.argv.slice(2);

const [action, ...rest] = args;

switch (action) {
  case 'getMeal':
    const [id] = rest;
    if (!id) {
      console.log('Missing id');
      break;
    }

    if (isNaN(Number(id))) {
      console.log('Id must be a number');
      break;
    }
    
    mealdbService.getMeal(parseInt(id))
      .then(meal => {
        console.log(meal);
      })
      .catch(err => {
        console.log(err);
      }
    );
    break;
}


