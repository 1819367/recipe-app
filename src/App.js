import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/Recipe.Excerpt";
import RecipeFull from "./components/RecipeFull";
import "./App.css";

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const request = await fetch("/api/recipes");
        if (request.ok) {
          const result = await request.json();
          setRecipes(result);
        } else {
          console.log("Oops, something went wrong");
        }
      } catch (e) {
        console.error("An error occurred during the request", e)
        console.log("An unexpected error occured. Please try again later.");
      }
    };

    fetchAllRecipes();
  }, []);

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className='recipe-app'>
      <Header />
      {selectedRecipe && <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} />}
    
      {!selectedRecipe && (
        <div className="recipe-list">
        {recipes.map((recipe) => (
            <RecipeExcerpt key={recipe.id} recipe={recipe} handleSelectRecipe={handleSelectRecipe}/>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
