"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as recipeClient from "../../../Clients/recipeClient";
import { Button, Col, Image, Row } from "react-bootstrap";
import "../../detailsStyles.css";
import { Ingredient } from "@/app/(Site)/UtilClasses/Types";
import InstructionsCard from "../InstructionsCard";
import IngredientsCard from "../IngredientsCard";
import ReviewsCard from "../ReviewsCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/(Site)/store";
import BackButton from "../BackButton";
import FlexGap from "@/app/(Site)/UtilClasses/FlexGap";
import { setTitle } from "@/app/(Site)/reducer";
import { ApiRecipe } from "@/app/(Site)/UtilClasses/Types";
const defaultImage = "/images/plate.svg";

const firstLetterToUppercase = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export default function ApiRecipeDetails() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle("Recipe Details"));
  }, [dispatch]);

  const { currentUser } = useSelector((state: RootState) => state.account);
  const { recipeId } = useParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<ApiRecipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);

  const setIngredientDetails = (recipeDetails: ApiRecipe) => {
    const listIngredients: Ingredient[] = [];
    for (let i = 1; i < 21; i++) {
      const ingredient = recipeDetails[`strIngredient${i}`];
      if (ingredient) {
        const measure = recipeDetails[`strMeasure${i}`];
        listIngredients.push({
          ingredient: firstLetterToUppercase(ingredient),
          measure: measure ?? "",
        });
      }
    }
    setIngredients(listIngredients);
  };
  const matchesStepPattern = (str: string) => /^step \d+$/.test(str);

  const setInstructionDetails = (recipeDetails: ApiRecipe) => {
    const listInstructions = recipeDetails.strInstructions
      .split("\r\n")
      .filter(
        (instruction) => instruction !== "" && !matchesStepPattern(instruction),
      );
    setInstructions(listInstructions);
  };
  const fetchRecipeDetails = async () => {
    const recipeDetails = await recipeClient.getRecipeById(recipeId);
    if (!recipeDetails) return;
    setRecipe(recipeDetails);
    setIngredientDetails(recipeDetails);
    setInstructionDetails(recipeDetails);
  };
  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId]);

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

  return (
    <div className="wdf-details-container">
      <div className="wdf-details-top-row">
        <Col sm={8} className="wdf-details-left">
          <div className="d-flex align-items-center">
            <BackButton />
            <h1 className="wdf-details-title">{recipe?.strMeal}</h1>
            <FlexGap />
            <div className="wdf-details-buttons">
              <span
                className="d-inline-block"
                data-toggle="tooltip"
                title={getRemixTooltip()}
              >
                <Button
                  variant="warning"
                  disabled={!currentUser || currentUser.role === "REVIEWER"}
                  href={`/editor?apiRecipe=${recipeId}`}
                >
                  Remix
                </Button>
              </span>
              <span
                className="d-inline-block"
                data-toggle="tooltip"
                title={getReviewTooltip()}
              >
                <Button
                  variant="primary"
                  className="me-2 ms-2"
                  disabled={!currentUser || currentUser.role === "AUTHOR"}
                  href={`/editor/review?apiRecipe=${recipeId}`}
                >
                  Review
                </Button>
              </span>
            </div>
          </div>
          <div className="wdf-details-body">
            <Row>
              <Col xl={5}>
                <IngredientsCard ingredients={ingredients} scalable={false} />
              </Col>
              <Col xl={7}>
                <InstructionsCard instructions={instructions} />
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm={4} className="wdf-details-right">
          <Image
            src={recipe?.strMealThumb ? recipe.strMealThumb : defaultImage}
            className="wdf-details-image"
          />
        </Col>
      </div>
      <div className="wdf-details-bottom-row">
        <ReviewsCard isReviewOfApiRecipe={true} />
      </div>
    </div>
  );
}
