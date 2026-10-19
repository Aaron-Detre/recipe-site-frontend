"use client";
import { useRouter, useSearchParams } from "next/navigation";
import * as localRecipeClient from "../../Clients/localRecipeClient";
import * as recipeClient from "../../Clients/recipeClient";
import * as reviewClient from "../../Clients/reviewClient";
import { useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import "../editorStyles.css";
import { Review } from "../../UtilClasses/Types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { v4 as uuidv4 } from "uuid";
import { setTitle } from "@/app/(Site)/reducer";
import type { ChangeEvent, SyntheticEvent } from "react";

export default function ReviewEditor() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle("Review Editor"));
  }, [dispatch]);

  const { currentUser } = useSelector((state: RootState) => state.account);
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiRecipeId = searchParams.get("apiRecipe");
  const localRecipeId = searchParams.get("localRecipe");
  const [recipeTitle, setRecipeTitle] = useState("");
  const [stars, setStars] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  let detailsSet = false;

  const setApiRecipeDetails = async (apiRecipeId: string) => {
    if (!detailsSet) {
      const apiRecipe = await recipeClient.getRecipeById(apiRecipeId);
      if (apiRecipe) {
        setRecipeTitle(apiRecipe.strMeal);
        detailsSet = true;
      }
    }
  };
  const setLocalRecipeDetails = async (localRecipeId: string) => {
    if (!detailsSet) {
      const localRecipe = await localRecipeClient.getRecipeById(localRecipeId);
      setRecipeTitle(localRecipe.recipeTitle);
      detailsSet = true;
    }
  };

  if ((apiRecipeId && localRecipeId) || (!apiRecipeId && !localRecipeId)) {
    history.back();
  } else if (apiRecipeId) {
    setApiRecipeDetails(apiRecipeId);
  } else if (localRecipeId) {
    setLocalRecipeDetails(localRecipeId);
  }

  const handleClickEmptyStar = (index: number) => setStars(index);
  const handleClickFilledStar = (index: number) => {
    if (index === stars) {
      setStars(0);
    } else {
      setStars(index);
    }
  };
  const displayStars = (stars: number) => {
    const starIcons = [];
    for (let i = 1; i < 6; i++) {
      if (i <= stars) {
        starIcons.push(
          <FaStar
            key={i}
            onClick={() => handleClickFilledStar(i)}
            className="wdf-cursor-pointer fs-1"
          />
        );
      } else {
        starIcons.push(
          <FaRegStar
            key={i}
            onClick={() => handleClickEmptyStar(i)}
            className="wdf-cursor-pointer fs-1"
          />
        );
      }
    }
    return starIcons;
  };

  const titleChanges = (e: ChangeEvent<HTMLInputElement>) =>
    setReviewTitle(e.target.value);
  const textChanges = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setReviewText(e.target.value);

  const publishReview = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentUser && reviewTitle !== "") {
      const reviewId = uuidv4();
      const author = { _id: currentUser._id, username: currentUser.username };
      const review: Review = {
        _id: reviewId,
        reviewTitle: reviewTitle,
        stars: stars,
        reviewAuthor: author,
        text: reviewText,
        datePosted: new Date(Date.now()),
        apiRecipeId: apiRecipeId ?? undefined,
        localRecipeId: localRecipeId ?? undefined,
      };
      await reviewClient.createReview(review);
      if (apiRecipeId) {
        router.push(`/details/${apiRecipeId}/api/review/${reviewId}`);
      } else {
        router.push(`/details/${localRecipeId}/local/review/${reviewId}`);
      }
    }
  };

  return currentUser ? (
    <div>
      <h1 className="mb-4">Reviewing Recipe: {recipeTitle}</h1>
      <Form onSubmit={publishReview}>
        <FormGroup
          className="d-flex align-items-baseline"
          controlId="wdf-editor-review-stars"
        >
          <FormLabel className="wdf-editor-review-form-label me-3">
            Stars:
          </FormLabel>
          {displayStars(stars)}
        </FormGroup>
        <FormGroup controlId="wdf-editor-review-title" className="mt-3">
          <FormLabel className="wdf-editor-review-form-label">
            Review Title
          </FormLabel>
          <FormControl
            type="text"
            onChange={titleChanges}
            placeholder="Give your review a title"
            required
          />
        </FormGroup>
        <FormGroup controlId="wdf-editor-review-text" className="mt-3">
          <FormLabel className="wdf-editor-review-form-label">Review</FormLabel>
          <FormControl
            as="textarea"
            type="text"
            placeholder="Write your review here"
            rows={5}
            onChange={textChanges}
          />
        </FormGroup>
        <Button className="mt-3" type="submit">
          Publish Review
        </Button>
      </Form>
    </div>
  ) : (
    <h1>Sign in to write a review</h1>
  );
}
