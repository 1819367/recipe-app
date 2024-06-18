import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/Recipe.Excerpt";
import "./App.css";

const App = () => {
  const [recipes, setRecipes] = useState([]);

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

  return (
    <div className='recipe-app'>
      <Header />
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeExcerpt key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default App;
