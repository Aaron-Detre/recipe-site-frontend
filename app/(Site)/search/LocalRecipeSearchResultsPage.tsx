"use client";
import { useEffect, useState } from "react";
import { Review } from "../UtilClasses/Types";
import { Recipe } from "../UtilClasses/Types";
import type { OverlayTriggerRenderProps } from "react-bootstrap/OverlayTrigger";
import { useSearchParams } from "next/navigation";
import * as localRecipeClient from "../Clients/localRecipeClient";
import * as reviewClient from "../Clients/reviewClient";
import ReviewSummaryPopover from "./ReviewSummaryPopover";
import SearchBar from "./SearchBar";
import Link from "next/link";
import { Image, OverlayTrigger } from "react-bootstrap";
import { IoMdInformationCircleOutline } from "react-icons/io";
import FlexGap from "../UtilClasses/FlexGap";

export default function LocalRecipeSearchResultsPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [localRecipeReviews, setLocalRecipeReviews] = useState<Review[][]>([]);
  const criteria = useSearchParams().get("criteria");

  const searchLocalRecipes = async (searchParam: string) => {
    const recipes = await localRecipeClient.filterRecipesByTitle(searchParam);
    setRecipes(recipes instanceof Array ? recipes : []);
  };

  const fetchReviews = async () => {
    const ids = recipes.map((recipe) => recipe._id);
    const reviews = await reviewClient.getReviewsForSomeRecipes(ids, false);
    setLocalRecipeReviews(reviews);
  };
  useEffect(() => {
    fetchReviews();
  }, [recipes]);

  useEffect(() => {
    if (criteria) searchLocalRecipes(criteria);
  }, [criteria]);

  const popover = (
    recipeDetails: Recipe,
    triggerProps: OverlayTriggerRenderProps
  ) => (
    <ReviewSummaryPopover
      triggerProps={triggerProps}
      isApiRecipeReview={false}
      recipeReviews={localRecipeReviews}
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
              key={recipe._id}
              className="wdf-search-result wdf-border-light shadow"
            >
              <div className="wdf-info-card wdf-vertical">
                <Link href={`/details/${recipe._id}/local`}>
                  <div className="wdf-info-card-image">
                    <Image
                      src={recipe.img ?? "/images/plate.svg"}
                      className="wdf-info-card-image-thumbnail"
                    />
                  </div>
                </Link>
                <div className="wdf-info-card-body">
                  <div className="wdf-info-card-body-header ">
                    <Link href={`/details/${recipe._id}/local`}>
                      <span>{recipe.recipeTitle}</span>
                    </Link>
                    <FlexGap />
                    <OverlayTrigger
                      trigger="click"
                      placement="top"
                      overlay={(triggerProps) => popover(recipe, triggerProps)}
                    >
                      <IoMdInformationCircleOutline className="float-end fs-3 wdf-cursor-pointer" />
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
