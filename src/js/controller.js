import * as model from './model.js'
import recipeView from './views/recipeView.js'
import 'core-js/stable';
import 'regenerator-runtime/runtime'
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
// if(module.hot){
//   module.hot.accept();
// }

document.addEventListener('DOMContentLoaded', () => {
  const recipeEl = document.querySelector('.recipe');
  //console.log('Recipe element:', recipeEl);
});

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlRecipe = async function(){
  try{
const id = window.location.hash.slice(1);


if(!id) return;

    //loading recipe

recipeView.renderSpinner();
// update results view to mark selected result
resultsView.update(model.getSearchResultsPage());

bookmarksView.update(model.state.bookmarks);

await model.loadRecipe(id);
    //rendering recipe

recipeView.render(model.state.recipe);



  } catch(err){
    recipeView.renderError();
  }
};

const controlSearchResults = async function(){
  try{

    resultsView.renderSpinner();
    //1.get search query
    const query = searchView.getQuery();
    if(!query) return;

    //2. Load search results
    await model.loadSearchResults(query);

    //3.render results
    resultsView.render(model.getSearchResultsPage(1));
    
    

    //4. Render initial pagination
    paginationView.render(model.state.search);

  }
  catch(err){
    console.log(err);
  }
};
const controlPagination = function(goToPage){
   //3.render  new results
   resultsView.render(model.getSearchResultsPage(goToPage));
    
    

   //4. Render new pagination
   paginationView.render(model.state.search);


console.log(goToPage);
}

const controlServings = function(newServings){
  // update the recipe servings
  model.updateServings(newServings);

  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

}

const controlAddBookmark = function(){
// add or remove bookmark
  if(!model.state.recipe.bookmarked){
      model.addBookmark(model.state.recipe)
  }
  else{  
    model.deleteBookmark(model.state.recipe.id)};

    //update view
  recipeView.update(model.state.recipe);

    // render bookmakrs
    bookmarksView.render(model.state.bookmarks);
}

//controlSearchResults();

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{

    //spinner
  addRecipeView.renderSpinner();

    //upload the new recipe data
  await model.uploadRecipe(newRecipe);
  //console.log(model.state.recipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //window.history.back()

    //close form
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, 2500)

} catch(err){
  console.error('error', err);
  addRecipeView.renderError(err.message);

}
}

const init = function (){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe)
}
init();

  


