import recipeService from '../src/recipe-service';
import mealdbService, {Meal} from '../src/mealdb-service';

// This script is invoked by `npm run mealdb [--] action [args]`

function help() {
  console.log('Usage: npm run mealdb [--] action [args]');
  console.log('Actions:');
  console.log('  help           :Show this help');
  console.log('  getMeal <id>   :Fetch a meal from the MealDB API, and print it to the console');
  console.log('  random         :Fetch a random meal from the MealDB API, and print it to the console');

  console.log('\n commands that fetch recipes will prompt you to save them to the recipe database.');
}


const args = process.argv.slice(2);

const [action, ...rest] = args;

switch (action) {
  case 'getMeal':
    const id = getId(rest);

    mealdbService.getMeal(id)
      .then(meal => displayMeal(meal))
      .catch(err => {console.log(err); process.exit(1);});

    break;
  case 'random':
    mealdbService.getRandomMeal()
      .then(meal => displayMeal(meal))
      .catch(err => {console.log(err); process.exit(1);});

  case 'help':
  default:
    help();
    
}


// Get a single number from arguments
function getId(args: string[]) {
  if (args.length < 1) {
    console.error('Missing argument: id');
    help();
    process.exit(1);
  }

  if (args.length > 1) {
    console.error('Too many arguments');
    help();
    process.exit(1);
  }

  const id = Number(args[0]);

  if (isNaN(id)) {
    console.log('Id must be a number');
    help();
    process.exit(1);
  }

  return id;
}

// Display a meal, and prompt the user to save it to the recipe database
function displayMeal(meal: Meal) {
  console.log(meal);
  console.log('Save this recipe? (y/n)');

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', async function (inputBuffer) {
    let text = inputBuffer.toString().trim();
    if (text === 'y') {
      console.log('Saving...');
      const recipeId = await recipeService.saveMeal(meal);
      console.log('Saved recipe with id =', recipeId);
    } else {
      console.log('Not saved');
    }
    process.exit(0);
  });
}
