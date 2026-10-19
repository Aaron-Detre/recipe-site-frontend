import axios from "axios";
import { ApiRecipe } from "../UtilClasses/Types";
const MEALDB_API =
  process.env.MEALDB_API ?? "https://www.themealdb.com/api/json/v1/1";
type MealDbResponse = { meals: ApiRecipe[] | null };

export const filterRecipesByTitle = async (query: string) => {
  const response = await axios.get<MealDbResponse>(
    `${MEALDB_API}/search.php?s=${query}`
  );
  return response.data.meals;
};
export const getRecipeById = async (recipeId: string) => {
  const response = await axios.get<MealDbResponse>(
    `${MEALDB_API}/lookup.php?i=${recipeId}`
  );
  if (response.data.meals?.length === 1) {
    return response.data.meals[0];
  }
};
