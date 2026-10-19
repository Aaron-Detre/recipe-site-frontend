"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as userClient from "../Clients/userClient";
import SearchBar from "./SearchBar";
import Link from "next/link";
import { Image } from "react-bootstrap";
import { User } from "../UtilClasses/Types";

export default function UserSearchResultsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const criteria = useSearchParams().get("criteria");
  const searchUsers = async (searchParam: string) => {
    const users = await userClient.filterUsersByName(searchParam);
    setUsers(users);
  };

  useEffect(() => {
    if (criteria) searchUsers(criteria);
  }, [criteria]);

  return (
    <div className="wdf-search-container">
      <SearchBar placeholder="Search For Other Users" />
      {users.length > 0 ? (
        <div className="wdf-search-results">
          {users.map((user) => (
            <div
              key={user._id}
              className="wdf-search-result wdf-border-light shadow"
            >
              <Link href={`/profile/${user._id}`}>
                <div className="wdf-info-card wdf-vertical">
                  <div className="wdf-info-card-image">
                    <Image
                      src={"/images/user.png"}
                      className="wdf-info-card-image-thumbnail p-2"
                    />
                  </div>
                  <div className="wdf-info-card-body">
                    <div className="wdf-info-card-body-header">
                      <span className="wdf-link-styling">{user.username}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <h1 className="mt-5">No users found...</h1>
      )}
    </div>
  );
}
