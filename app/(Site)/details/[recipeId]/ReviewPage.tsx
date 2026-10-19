/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as localRecipeClient from "../../Clients/localRecipeClient";
import * as recipeClient from "../../Clients/recipeClient";
import * as reviewClient from "../../Clients/reviewClient";
import { Button, Card } from "react-bootstrap";
import Link from "next/link";
import "./reviewStyles.css";
import displayStars from "@/app/(Site)/UtilClasses/DisplayStars";
import BackButton from "./BackButton";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../../reducer";
import { RootState } from "../../store";
import FlexGap from "../../UtilClasses/FlexGap";
const defaultImage = "/images/plate.svg";

export default function ReviewPage({
  isLocalRecipeReview,
}: {
  isLocalRecipeReview: boolean;
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle("Review"));
  }, [dispatch]);

  const { currentUser } = useSelector((state: RootState) => state.account);

  const { recipeId, reviewId } = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [review, setReview] = useState<any>(null);

  const fetchRecipe = async () => {
    const recipeData = isLocalRecipeReview
      ? await localRecipeClient.getRecipeById(recipeId as string)
      : await recipeClient.getRecipeById(recipeId as string);
    setRecipe(recipeData);
  };
  const fetchReview = async () => {
    const reviewData = await reviewClient.getReviewById(reviewId as string);
    setReview(reviewData);
  };

  useEffect(() => {
    fetchRecipe();
    fetchReview();
  }, [recipeId, reviewId]);

  const isYourReview = () =>
    currentUser && review && currentUser._id === review.reviewAuthor._id;
  const handleDeleteClicked = async () => {
    if (confirm("Are you sure you want to permanently delete this review?")) {
      await reviewClient.deleteReview(review._id);
      history.back();
    }
  };

  return (
    <div className="wdf-review d-flex">
      <div className="wdf-review-back-button">
        <BackButton />
      </div>
      <div className="wdf-review-content">
        <Card
          as={Link}
          href={`/details/${
            isLocalRecipeReview ? recipe?._id : recipe?.idMeal
          }/${isLocalRecipeReview ? "local" : "api"}`}
          className="wdf-review-recipe-card shadow"
        >
          <Card.Img
            src={
              isLocalRecipeReview
                ? recipe?.img ?? defaultImage
                : recipe?.strMealThumb
            }
            className="wdf-review-recipe-image"
          />
          <Card.Body>
            <Card.Title className="wdf-review-recipe-title">
              {isLocalRecipeReview ? recipe?.recipeTitle : recipe?.strMeal}
            </Card.Title>
          </Card.Body>
        </Card>
        <h1 className="wdf-review-title">{review?.reviewTitle}</h1>
        <div className="d-block d-md-flex align-items-center">
          <span className="wdf-review-author">
            By{" "}
            <Link href={`/profile/${review?.reviewAuthor._id}`}>
              {review?.reviewAuthor.username}
            </Link>
          </span>
          <div>{displayStars(review?.stars)}</div>
          <FlexGap />
          {isYourReview() && (
            <Button
              variant="danger"
              className="mt-2"
              onClick={handleDeleteClicked}
            >
              Delete
            </Button>
          )}
        </div>
        <p className="wdf-review-text">{review?.text}</p>
      </div>
    </div>
  );
}
