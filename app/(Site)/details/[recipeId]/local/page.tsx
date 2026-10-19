"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as localRecipeClient from "../../../Clients/localRecipeClient";
import { Button, Col, Image, Row } from "react-bootstrap";
import "../../detailsStyles.css";
import {
  Ingredient,
  Recipe,
  ScalableIngredient,
} from "@/app/(Site)/UtilClasses/Types";
import InstructionsCard from "../InstructionsCard";
import IngredientsCard from "../IngredientsCard";
import ReviewsCard from "../ReviewsCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/(Site)/store";
import BackButton from "../BackButton";
import Link from "next/link";
import FlexGap from "@/app/(Site)/UtilClasses/FlexGap";
import { setTitle } from "@/app/(Site)/reducer";
const defaultImage = "/images/plate.svg";

export default function ApiRecipeDetails() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle("Recipe Details"));
  }, [dispatch]);

  const { currentUser } = useSelector((state: RootState) => state.account);
  const { recipeId } = useParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [scalable, setScalable] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [scalableIngredients, setScalableIngredients] = useState<
    ScalableIngredient[]
  >([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [hasImage, setHasImage] = useState(true);

  const fetchRecipeDetails = async () => {
    const recipeDetails = await localRecipeClient.getRecipeById(recipeId);
    setRecipe(recipeDetails);
    setIngredients(recipeDetails.ingredients);
    setScalableIngredients(recipeDetails.scalableIngredients);
    setInstructions(recipeDetails.instructions);
    setHasImage(recipeDetails.img !== undefined);
    setScalable(recipeDetails.scalable);
  };
  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId]);

  const reviewDisabled = () => !currentUser || currentUser.role === "AUTHOR";
  const remixDisabled = () => !currentUser || currentUser.role === "REVIEWER";

  const getReviewTooltip = () => {
    if (currentUser) {
      if (currentUser.role === "AUTHOR") {
        return "Change your role to review this recipe";
      } else {
        return "Write a review for this recipe";
      }
    } else {
      return "Only signed in users can review recipes";
    }
  };
  const getRemixTooltip = () => {
    if (currentUser) {
      if (currentUser.role === "REVIEWER") {
        return "Change your role to remix this recipe";
      } else {
        return "Make your own custom version of this recipe";
      }
    } else {
      return "Only signed in users can remix recipes";
    }
  };

  const isYourRecipe = () =>
    recipe && currentUser && recipe.recipeAuthor._id === currentUser._id;
  const handleDeleteClicked = async () => {
    if (!recipe) return;
    if (confirm("Are you sure you want to permanently delete this recipe?")) {
      await localRecipeClient.deleteRecipe(recipe._id);
      history.back();
    }
  };

  return (
    <div className="wdf-details-container">
      <div className="wdf-details-top-row">
        <Col xs={hasImage ? 8 : 12} className="wdf-details-left">
          <div className="d-flex align-items-center">
            <BackButton />
            <h1 className="wdf-details-title">{recipe?.recipeTitle}</h1>
            <FlexGap />
            <div className={hasImage ? "wdf-details-buttons" : ""}>
              <span
                className="d-inline-block"
                data-toggle="tooltip"
                title={getRemixTooltip()}
              >
                <Button
                  variant="warning"
                  className="me-2"
                  disabled={remixDisabled()}
                  href={`/editor?localRecipe=${recipeId}`}
                >
                  Remix
                </Button>
              </span>
              {isYourRecipe() ? (
                <Button variant="danger" onClick={handleDeleteClicked}>
                  Delete
                </Button>
              ) : (
                <span
                  className="d-inline-block"
                  data-toggle="tooltip"
                  title={getReviewTooltip()}
                >
                  <Button
                    variant="primary"
                    disabled={reviewDisabled()}
                    href={`/editor/review?localRecipe=${recipeId}`}
                  >
                    Review
                  </Button>
                </span>
              )}
            </div>
          </div>
          <div className="wdf-details-author">
            <span>
              By{" "}
              <Link href={`/profile/${recipe?.recipeAuthor._id}`}>
                {recipe?.recipeAuthor.username}
              </Link>
            </span>
          </div>

          <div className="wdf-details-body">
            <Row>
              <Col xl={5}>
                <IngredientsCard
                  ingredients={scalable ? scalableIngredients : ingredients}
                  scalable={scalable}
                />
              </Col>
              <Col xl={7}>
                <InstructionsCard instructions={instructions} />
              </Col>
            </Row>
          </div>
        </Col>
      </div>
      <div className="wdf-details-bottom-row">
        <ReviewsCard isReviewOfApiRecipe={false} />
      </div>
    </div>
  );
}
