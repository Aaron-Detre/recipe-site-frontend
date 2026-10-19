export type Path = { link: string; label: string };
export type User = {
  _id: string;
  username: string;
  password: string;
  role: string;
  following: string[];
  email?: string;
  phone?: string;
};
export type UserProfile = User & {
  authored: Recipe[];
  reviews: Review[];
};
export type Recipe = {
  _id: string;
  recipeTitle: string;
  img?: string;
  recipeAuthor: { _id: string; username: string };
  datePosted: Date | string;
  ingredients: Ingredient[];
  scalableIngredients: ScalableIngredient[];
  scalable: boolean;
  instructions: string[];
};
export type ApiRecipe = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: string | undefined;
};
export type Ingredient = {
  id?: string;
  ingredient: string;
  measure: string;
};
export type ScalableIngredient = {
  id?: string;
  ingredient: string;
  amount: number;
  unit: string;
};
export type Review = {
  _id: string;
  reviewTitle: string;
  stars: number;
  reviewAuthor: { _id: string; username: string };
  text: string;
  datePosted: Date | string;
  apiRecipeId?: string;
  localRecipeId?: string;
};

export type IngredientWithId = {
  id: string;
  ingredient: string;
  measure: string;
};
export type InstructionWithId = {
  id: string;
  instruction: string;
};
