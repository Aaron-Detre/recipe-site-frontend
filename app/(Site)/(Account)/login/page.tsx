"use client";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  FormControl,
  FormLabel,
} from "react-bootstrap";
import FlexGap from "../../UtilClasses/FlexGap";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import type { ChangeEvent, KeyboardEvent, SubmitEvent } from "react";
import { redirect } from "next/navigation";
import * as userClient from "../../Clients/userClient";
import { setTitle } from "../../reducer";

export default function SignIn() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Login"));
  }, [dispatch]);

  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  }>({ username: "", password: "" });

  const signIn = async () => {
    const user = await userClient.signIn(credentials);
    if (user) {
      dispatch(setCurrentUser(user));
      redirect("/");
    }
  };
  const usernameChanges = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, username: e.target.value });
  };
  const passwordChanges = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, password: e.target.value });
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) =>
    e.key === "Enter" && signIn();
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (credentials.username !== "" && credentials.password !== "") {
      signIn();
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card className="wdf-login-card mt-5">
        <CardHeader>Sign In</CardHeader>
        <Form onSubmit={handleSubmit}>
          <CardBody>
            <FormLabel htmlFor="username-entry">Username</FormLabel>
            <FormControl
              id="username-entry"
              type="text"
              className="mb-3"
              placeholder="Username"
              onChange={usernameChanges}
              onKeyDown={handleKeyDown}
              required
            />
            <FormLabel htmlFor="password-entry">Password</FormLabel>
            <FormControl
              id="password-entry"
              type="password"
              placeholder="Password"
              onChange={passwordChanges}
              onKeyDown={handleKeyDown}
              required
            />
          </CardBody>
          <CardFooter className="d-flex">
            <FlexGap />
            <Link className="btn btn-secondary me-2" href="/">
              Cancel
            </Link>
            <Button variant="primary" type="submit">
              Sign In
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
