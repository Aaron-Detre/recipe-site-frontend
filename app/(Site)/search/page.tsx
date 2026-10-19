"use client";
import { useRouter, useSearchParams } from "next/navigation";
import "./searchStyles.css";
import { useDispatch } from "react-redux";
import { setTitle } from "../reducer";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import RecipeSearchResultsPage from "./RecipeSearchResultsPage";
import DefaultSearchPage from "./DefaultSearchPage";
import LocalRecipeSearchResultsPage from "./LocalRecipeSearchResultsPage";
import UserSearchResultsPage from "./UserSearchResultsPage";

export default function Search() {
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(setTitle("Search"));
  }, [dispatch]);

  const searchParams = useSearchParams();
  const search = searchParams.get("criteria");
  const tab = searchParams.get("tab");

  const [key, setKey] = useState(tab ?? "recipes");
  const handleTabSelect = (selectedKey: string | null) => {
    if (selectedKey) {
      setKey(selectedKey);
      router.push(`/search?tab=${selectedKey}`);
    }
  };

  return (
    <Tabs activeKey={key} onSelect={handleTabSelect} className="mb-3">
      <Tab eventKey="recipes" title="Recipes">
        {search ? (
          <RecipeSearchResultsPage />
        ) : (
          <DefaultSearchPage placeholder="Search For Recipes" />
        )}
      </Tab>
      <Tab eventKey="localRecipes" title="User Recipes">
        {search ? (
          <LocalRecipeSearchResultsPage />
        ) : (
          <DefaultSearchPage placeholder="Search For Recipes" />
        )}
      </Tab>
      <Tab eventKey="users" title="Users">
        {search ? (
          <UserSearchResultsPage />
        ) : (
          <DefaultSearchPage placeholder="Search For Other Users" />
        )}
      </Tab>
    </Tabs>
  );
}
