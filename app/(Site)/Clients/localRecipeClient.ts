import axios from "axios";
import { Recipe } from "../UtilClasses/Types";
const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const RECIPES_API = `${HTTP_SERVER}/api/recipes`;

export const filterRecipesByTitle = async (query: string) => {
  const response = await axiosWithCredentials.get<Recipe[]>(
    `${RECIPES_API}?title=${query}`
  );
  return response.data;
};
export const getRecipeById = async (recipeId: string) => {
  const response = await axiosWithCredentials.get<Recipe>(
    `${RECIPES_API}?id=${recipeId}`
  );
  return response.data;
};
export const getAllLocalRecipes = async () => {
  const response = await axiosWithCredentials.get<Recipe[]>(`${RECIPES_API}`);
  return response.data;
};
export const getFollowingRecipes = async (userId: string) => {
  const response = await axiosWithCredentials.get<Recipe[]>(
    `${RECIPES_API}/following/${userId}`
  );
  return response.data;
};
export const createRecipe = async (recipe: Recipe) => {
  const response = await axiosWithCredentials.put(
    `${RECIPES_API}/create`,
    recipe
  );
  return response.data;
};
export const deleteRecipe = async (recipeId: string) => {
  const response = await axiosWithCredentials.put(
    `${RECIPES_API}/delete/${recipeId}`
  );
  return response.data;
};
