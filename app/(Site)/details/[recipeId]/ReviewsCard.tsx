import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import { useParams } from "next/navigation";
import * as reviewClient from "../../Clients/reviewClient";
import Link from "next/link";
import { Review } from "../../UtilClasses/Types";
import displayStars from "../../UtilClasses/DisplayStars";

export default function ReviewsCard({
  isReviewOfApiRecipe,
}: {
  isReviewOfApiRecipe: boolean;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { recipeId } = useParams<{ recipeId: string }>();

  const fetchAllReviewsForRecipe = async (rid: string) => {
    const reviewsForRecipe = await reviewClient.getAllReviewsForRecipe(
      rid,
      isReviewOfApiRecipe
    );
    setReviews(reviewsForRecipe);
  };
  useEffect(() => {
    if (recipeId) {
      fetchAllReviewsForRecipe(recipeId);
    }
  }, [recipeId]);

  const abbreviateText = (text: string) => {
    if (text && text.length >= 230) {
      return text.slice(0, 228) + "...";
    } else {
      return text;
    }
  };

  return (
    <Card className="shadow">
      <Card.Header>User Reviews</Card.Header>
      <Card.Body>
        {reviews.length > 0 ? (
          <ListGroup>
            {reviews.map((review) => (
              <ListGroupItem
                key={review._id}
                className="d-flex align-items-center wdf-cursor-pointer"
              >
                <Card className="w-100">
                  <Row className="no-gutters">
                    <Col>
                      <CardBody>
                        <CardTitle
                          as={Link}
                          href={`/details/${recipeId}/${
                            review.apiRecipeId ? "api" : "local"
                          }/review/${review._id}`}
                          className="wdf-header"
                        >
                          {review.reviewTitle}
                        </CardTitle>
                        <CardText className="d-flex align-items-baseline">
                          {displayStars(review.stars)}
                          <span className="ms-3 fs-5 fw-3">
                            By{" "}
                            <Link href={`/profile/${review.reviewAuthor._id}`}>
                              {review.reviewAuthor.username}
                            </Link>
                          </span>
                        </CardText>
                        <CardText>{abbreviateText(review.text)}</CardText>
                      </CardBody>
                    </Col>
                  </Row>
                </Card>
              </ListGroupItem>
            ))}
          </ListGroup>
        ) : (
          <h3>No user reviews yet...</h3>
        )}
      </Card.Body>
    </Card>
  );
}
