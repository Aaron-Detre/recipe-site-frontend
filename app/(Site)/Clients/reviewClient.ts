import axios from "axios";
import { Review } from "../UtilClasses/Types";
const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const REVIEWS_API = `${HTTP_SERVER}/api/reviews`;

export const getAllReviewsForRecipe = async (
  recipeId: string,
  isApiRecipe: boolean
) => {
  const response = await axiosWithCredentials.get<Review[]>(
    `${REVIEWS_API}/${isApiRecipe ? "api" : "local"}/${recipeId}`
  );
  return response.data;
};
export const getAllReviews = async () => {
  const response = await axiosWithCredentials.get<Review[]>(`${REVIEWS_API}`);
  return response.data;
};
export const getFollowingReviews = async (userId: string) => {
  const response = await axiosWithCredentials.get<Review[]>(
    `${REVIEWS_API}/following/${userId}`
  );
  return response.data;
};
export const getReviewById = async (reviewId: string) => {
  const response = await axiosWithCredentials.get<Review>(
    `${REVIEWS_API}/${reviewId}`
  );
  return response.data;
};
export const createReview = async (review: Review) => {
  const response = await axiosWithCredentials.put(
    `${REVIEWS_API}/create`,
    review
  );
  return response.data;
};
export const getReviewsForSomeRecipes = (
  recipeIds: string[],
  isApiRecipe: boolean
) => {
  return Promise.all(
    recipeIds.map((id) => getAllReviewsForRecipe(id, isApiRecipe))
  );
};
export const deleteReview = async (reviewId: string) => {
  const response = await axiosWithCredentials.put(
    `${REVIEWS_API}/delete/${reviewId}`
  );
  return response.data;
};
