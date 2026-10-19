"use client";
import {
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import * as localRecipeClient from "../Clients/localRecipeClient";
import * as recipeClient from "../Clients/recipeClient";
import * as reviewClient from "../Clients/reviewClient";
import displayStars from "../UtilClasses/DisplayStars";
import { setTitle } from "../reducer";
import { Recipe, Review } from "../UtilClasses/Types";

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle("Home"));
  }, [dispatch]);

  const { currentUser } = useSelector((state: RootState) => state.account);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewImages, setReviewImages] = useState<string[]>([]);

  const fiveMostRecent = <T extends { datePosted: Date | string }>(
    array: T[]
  ): T[] => {
    const sorted = [...array].sort((a, b) => {
      return (
        new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
      );
    });
    return sorted.slice(0, 5);
  };
  const fetchReviewImages = async (reviews: Review[]) => {
    const images = await Promise.all(
      reviews.map(async (review) => {
        try {
          if (review.localRecipeId) {
            const recipe = await localRecipeClient.getRecipeById(
              review.localRecipeId
            );
            return recipe?.img ?? "/images/plate.svg";
          } else {
            if (!review.apiRecipeId) return "/images/plate.svg";
            const recipe = await recipeClient.getRecipeById(review.apiRecipeId);
            return recipe?.strMealThumb ?? "/images/plate.svg";
          }
        } catch (err) {
          console.error("Error fetching recipe:", err);
          return "/images/plate.svg";
        }
      })
    );
    setReviewImages(images);
  };
  const fetchRecentReviews = async () => {
    const reviews = await reviewClient.getAllReviews();
    const recentReviews = fiveMostRecent(reviews);
    setReviews(recentReviews);
    fetchReviewImages(recentReviews);
  };
  const fetchRecentUserRecipes = async () => {
    const recipes = await localRecipeClient.getAllLocalRecipes();
    setUserRecipes(fiveMostRecent(recipes));
  };
  const fetchFollowingRecentReviews = async (userId: string) => {
    const reviews = await reviewClient.getFollowingReviews(userId);
    const recentReviews = fiveMostRecent(reviews);
    setReviews(recentReviews);
    fetchReviewImages(recentReviews);
  };
  const fetchFollowingRecentRecipes = async (userId: string) => {
    const recipes = await localRecipeClient.getFollowingRecipes(userId);
    setUserRecipes(fiveMostRecent(recipes));
  };
  useEffect(() => {
    if (currentUser) {
      fetchFollowingRecentReviews(currentUser._id);
      fetchFollowingRecentRecipes(currentUser._id);
    } else {
      fetchRecentReviews();
      fetchRecentUserRecipes();
    }
  }, [currentUser]);

  const abbreviateText = (text: string) => {
    if (text.length >= 100) {
      return text.slice(0, 98) + "...";
    } else {
      return text;
    }
  };

  return (
    <div>
      <div className="wdf-anonymous-page d-xl-flex gap-4 ms-4 me-4">
        <Col>
          <Card className="mb-4 shadow bg-white rounded">
            <Card.Header>
              <Card.Title className="mt-1">
                Recent{" "}
                {currentUser
                  ? "recipes from you and accounts you follow"
                  : "User-Created Recipes"}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {userRecipes.length > 0 ? (
                userRecipes.map((recipe, index) => (
                  <Card
                    key={recipe._id}
                    className={`w-100 ${
                      index === userRecipes.length - 1 ? "" : "mb-2"
                    }`}
                  >
                    <div className="d-flex gap-2">
                      <Link href={`/profile/${recipe.recipeAuthor._id}`}>
                        <CardImg
                          className="wdf-home-recipe-thumbnail p-2"
                          src={recipe.img ?? "/images/plate.svg"}
                        />
                      </Link>
                      <CardBody>
                        <CardTitle
                          as={Link}
                          href={`/details/${recipe._id}/local`}
                          className="wdf-header"
                        >
                          {recipe.recipeTitle}
                        </CardTitle>
                        <CardText>
                          By{" "}
                          <Link href={`/profile/${recipe.recipeAuthor._id}`}>
                            {recipe.recipeAuthor.username}
                          </Link>
                        </CardText>
                      </CardBody>
                    </div>
                  </Card>
                ))
              ) : (
                <h4 className="mt-4">No recent user recipes...</h4>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mb-4 shadow bg-white rounded">
            <Card.Header>
              <Card.Title className="mt-1">
                Recent{" "}
                {currentUser
                  ? "reviews from you and accounts you follow"
                  : "Recipe Reviews"}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {reviews.length > 0 ? (
                reviews.map((review, index) => {
                  const reviewDetailUrl = `/details/${
                    review.localRecipeId || review.apiRecipeId
                  }/${review.localRecipeId ? "local" : "api"}/review/${
                    review._id
                  }`;
                  return (
                    <Card key={review._id} className="w-100 mb-2">
                      <div className="d-flex gap-2">
                        <Link href={reviewDetailUrl}>
                          <CardImg
                            className="wdf-home-recipe-thumbnail p-2"
                            src={reviewImages.at(index) ?? "/images/plate.svg"}
                          />
                        </Link>
                        <CardBody>
                          <CardTitle
                            as={Link}
                            href={reviewDetailUrl}
                            className="wdf-header"
                          >
                            {review.reviewTitle}
                          </CardTitle>
                          <CardText className="d-flex align-items-center">
                            <span className="me-2">
                              <Link
                                href={`/profile/${review.reviewAuthor._id}`}
                              >
                                {review.reviewAuthor.username}
                              </Link>
                            </span>
                            {displayStars(review.stars)}
                          </CardText>
                          <CardText>{abbreviateText(review.text)}</CardText>
                        </CardBody>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <h4 className="mt-4">No recent reviews...</h4>
              )}
            </Card.Body>
          </Card>
        </Col>
      </div>
    </div>
  );
}
