"use client";
import { setTitle } from "@/app/(Site)/reducer";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import * as userClient from "../../../Clients/userClient";
import { useEffect, useState } from "react";
import ReviewListCard from "../ReviewListCard";
import Link from "next/link";
import { RootState } from "@/app/(Site)/store";
import { Review, UserProfile } from "@/app/(Site)/UtilClasses/Types";

export default function Reviews() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.account);
  const searchParams = useSearchParams();
  const authorId = searchParams.get("id");
  const [author, setAuthor] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchAuthor = async () => {
    if (authorId) {
      const user = await userClient.getUserById(authorId);
      setReviews(user.reviews);
      setAuthor(user);
      dispatch(setTitle(`Reviews by ${user.username}`));
    } else {
      dispatch(setTitle("Reviews"));
    }
  };

  useEffect(() => {
    fetchAuthor();
  }, [authorId]);

  const addSIfNotOneItemInArray = <T,>(array: T[]): string =>
    array.length !== 1 ? "s" : "";
  const getReviewsCardTitle = () =>
    `${reviews.length} Recipe${addSIfNotOneItemInArray(reviews)} Reviewed`;

  return (
    <div>
      <h1 className="mb-4">
        <Link href={`/profile/${authorId}`} className="wdf-breadcrumb-link">
          Profile
        </Link>
        {" > Authored Reviews"}
      </h1>
      <ReviewListCard
        title={getReviewsCardTitle()}
        reviews={reviews}
        setReviews={setReviews}
        isYourProfile={currentUser && author && currentUser._id === author._id}
      />
    </div>
  );
}
