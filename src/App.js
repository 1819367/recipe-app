import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import "./App.css";

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    servings: 1, // conservative default
    description: "",
    image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  });
  const [searchTerm, setSearchTerm] = useState("");

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
        console.error("An error occurred during the request:", e);
        console.log("An unexpected error occurred. Please try again later.");
      }
    };

    fetchAllRecipes();
  }, []);

  const handleNewRecipe = async (e, newRecipe) => {
    e.preventDefault(); // prevents the form from refreshing

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRecipe)
      });

      if (response.ok) {
        const data = await response.json();

        setRecipes([...recipes, data.recipe]);

        console.log("Recipe added successfully!");

        setShowNewRecipeForm(false);
        setNewRecipe({
          title: "",
          ingredients: "",
          instructions: "",
          servings: 1,
          description: "",
          image_url:
            "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        });
      } else {
        console.error("Oops - could not add recipe!");
      }
    } catch (e) {
      console.error("An error occurred during the request:", e);
      console.log("An unexpected error occurred. Please try again later.");
    }
  };

  const handleUpdateRecipe = async (e, selectedRecipe) => {
    e.preventDefault(); // prevents the form from refreshing

    const { id } = selectedRecipe;

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedRecipe)
      });

      if (response.ok) {
        const data = await response.json();

        setRecipes (
          recipes.map((recipe) => {
            if (recipe.id === id) {
              //return the saved data from the db
              return data.recipe;
            }
            return recipe;
          })
        );
        console.log("Recipe updated successfully!");
      
      } else {
        console.error("Could not update the recipe!");
      }
    } catch (e) {
      console.error("An error occurred during the request:", e);
      console.log("An unexpected error occurred. Please try again later.");
    }

    setSelectedRecipe(null);
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  };

  const hideRecipeForm = () => {
    setShowNewRecipeForm(false);
  };

  const showRecipeForm = () => {
    setShowNewRecipeForm(true);
    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      //you can use recipeId or selectedRecipe.id in the fetch request
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        //if ok, we want to update our state and filter out the recipe to be deleted
        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
        setSelectedRecipe(null);
        console.log("Recipe deleted successfully!");
      } else {
        console.error("The selected recipe could not be deleted!");
      }
        
    } catch (e) {
      console.error("An error occurred during the request:", e);
      console.log("An unexpected error occured. Try again.");
    }
  };

  const onUpdateForm = (e, action = "new") => {
    const { name, value } = e.target;
    if (action === "update") {
      setSelectedRecipe({ ...selectedRecipe, [name]: value });
    } else if (action === "new") {
      setNewRecipe({ ...newRecipe, [name]: value });
    }
  };

  const updateSearchTerm = (text) => {
    setSearchTerm(text);
  };

  const handleSearch = () => {
    //filter of each recipe in state
    const searchResults = recipes.filter((recipe) => {
      //if recipe passes this search it is returned in searchResults
      const valuesToSearch = [recipe.title, recipe.ingredients, recipe.description];
      //does at least one of the lowercase 'values' include the lowercase 'searchterm'?
      return valuesToSearch.some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
      
    })
    //if yes to the some method, it will pass the 'some' to searchResults
    return searchResults;
  };

  const displayedRecipes = searchTerm ? handleSearch() : recipes;

  return (
    <div className="recipe-app">
      <Header 
        showRecipeForm={showRecipeForm} 
        searchTerm={searchTerm}
        updateSearchTerm={updateSearchTerm}/>
      
      {showNewRecipeForm && (
        <NewRecipeForm
          newRecipe={newRecipe}
          hideRecipeForm={hideRecipeForm}
          onUpdateForm={onUpdateForm}
          handleNewRecipe={handleNewRecipe}
        />
      )}
      {selectedRecipe && (
        <RecipeFull
          selectedRecipe={selectedRecipe}
          handleUnselectRecipe={handleUnselectRecipe}
          handleUpdateRecipe={handleUpdateRecipe}
          onUpdateForm={onUpdateForm}
          handleDeleteRecipe={handleDeleteRecipe}
        />
      )}
      {!selectedRecipe && !showNewRecipeForm && (
        <div className="recipe-list">
          {displayedRecipes.map((recipe) => (
            <RecipeExcerpt
              key={recipe.id}
              recipe={recipe}
              handleSelectRecipe={handleSelectRecipe}
            />
          ))}
        </div>
      )}
      <p>Your recipes here!</p>
    </div>
  );

};

export default App;
