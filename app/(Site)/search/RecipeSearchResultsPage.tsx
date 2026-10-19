import Link from "next/link";
import { useEffect, useState } from "react";
import * as reviewClient from "../Clients/reviewClient";
import * as recipeClient from "../Clients/recipeClient";
import SearchBar from "./SearchBar";
import { useSearchParams } from "next/navigation";
import { Image, OverlayTrigger, Popover, Table } from "react-bootstrap";
import { IoMdInformationCircleOutline } from "react-icons/io";
import "../(Account)/profile/infoCardStyles.css";
import { Review } from "../UtilClasses/Types";
import { ApiRecipe } from "../UtilClasses/Types";
import ReviewSummaryPopover from "./ReviewSummaryPopover";
import FlexGap from "../UtilClasses/FlexGap";
import type { OverlayTriggerRenderProps } from "react-bootstrap/OverlayTrigger";

export default function RecipeSearchResultsPage() {
  const [recipes, setRecipes] = useState<ApiRecipe[]>([]);
  const [apiRecipeReviews, setApiRecipeReviews] = useState<Review[][]>([]);
  const criteria = useSearchParams().get("criteria");
  const searchApiRecipes = async (searchParam: string) => {
    const recipes = await recipeClient.filterRecipesByTitle(searchParam);
    setRecipes(recipes instanceof Array ? recipes : []);
  };

  const fetchReviews = async () => {
    const ids = recipes.map((recipe) => recipe.idMeal);
    const reviews = await reviewClient.getReviewsForSomeRecipes(ids, true);
    setApiRecipeReviews(reviews);
  };
  useEffect(() => {
    fetchReviews();
  }, [recipes]);

  useEffect(() => {
    if (criteria) searchApiRecipes(criteria);
  }, [criteria]);

  const popover = (
    recipeDetails: ApiRecipe,
    triggerProps: OverlayTriggerRenderProps
  ) => (
    <ReviewSummaryPopover
      triggerProps={triggerProps}
      isApiRecipeReview={true}
      recipeReviews={apiRecipeReviews}
      recipeDetails={recipeDetails}
    />
  );

  return (
    <div className="wdf-search-container">
      <SearchBar placeholder="Search For Recipes" />
      {recipes.length > 0 ? (
        <div className="wdf-search-results">
          {recipes.map((recipe) => (
            <div
              key={recipe.idMeal}
              className="wdf-search-result wdf-border-light shadow"
            >
              <div className="wdf-info-card wdf-vertical">
                <Link href={`/details/${recipe.idMeal}/api`}>
                  <div className="wdf-info-card-image">
                    <Image
                      src={recipe.strMealThumb}
                      className="wdf-info-card-image-thumbnail"
                    />
                  </div>
                </Link>
                <div className="wdf-info-card-body">
                  <div className="wdf-info-card-body-header">
                    <Link href={`/details/${recipe.idMeal}/api`}>
                      <span className="wdf-info-card-title">
                        {recipe.strMeal}
                      </span>
                    </Link>
                    <FlexGap />
                    <OverlayTrigger
                      trigger="click"
                      placement="top"
                      overlay={(triggerProps) =>
                        popover(recipe, triggerProps)
                      }
                    >
                      <IoMdInformationCircleOutline className="wdf-info-card-review-summary-button  wdf-cursor-pointer" />
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1 className="mt-5">No recipes found...</h1>
      )}
    </div>
  );
}
