"use client";
import { Button, Card, Col, Form } from "react-bootstrap";
import FlexGap from "../../UtilClasses/FlexGap";
import { useEffect, useState } from "react";
import * as userClient from "../../Clients/userClient";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setTitle } from "../../reducer";
import { setCurrentUser } from "../reducer";
import type { ChangeEvent, SyntheticEvent } from "react";

export default function SignUp() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Sign Up"));
  }, [dispatch]);

  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.account);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "BOTH",
  });

  const usernameChanges = (e: ChangeEvent<HTMLInputElement>) =>
    setNewUser({ ...newUser, username: e.target.value });
  const passwordChanges = (e: ChangeEvent<HTMLInputElement>) =>
    setNewUser({ ...newUser, password: e.target.value });
  const emailChanges = (e: ChangeEvent<HTMLInputElement>) =>
    setNewUser({ ...newUser, email: e.target.value });
  const phoneNumberChanges = (e: ChangeEvent<HTMLInputElement>) =>
    setNewUser({ ...newUser, phone: e.target.value });
  const roleChanges = (value: string) =>
    setNewUser({ ...newUser, role: value });

  const signUp = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signedUp = await userClient.signUp(newUser);
    if (signedUp) {
      dispatch(setCurrentUser(signedUp));
    }
  };

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser]);

  return (
    <div className="d-flex justify-content-center">
      <Col xl={4} sm={2} xs={1}></Col>
      <Col xl={4} sm={8} xs={10}>
        <Form className="w-100 mt-5" onSubmit={signUp}>
          <Card>
            <Card.Header>Sign Up</Card.Header>
            <Card.Body>
              <Form.Group controlId="wdf-username-entry" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  onChange={usernameChanges}
                  placeholder="Username"
                  required
                />
              </Form.Group>
              <Form.Group controlId="wdf-password-entry" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={passwordChanges}
                  required
                />
              </Form.Group>
              <Form.Group controlId="wdf-email-entry" className="mb-3">
                <Form.Label>Email (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  onChange={emailChanges}
                  placeholder="Email Address"
                />
              </Form.Group>
              <Form.Group controlId="wdf-phone-entry" className="mb-3">
                <Form.Label>Phone Number (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  onChange={phoneNumberChanges}
                  placeholder="Phone Number"
                />
              </Form.Group>
              <Form.Group controlId="wdf-role-select">
                <Form.Label>Role (you can change this later)</Form.Label>
                <Form.Check
                  type="radio"
                  name="role-select"
                  id="wdf-recipe-author-radio"
                  label="Recipe Author"
                  onChange={() => roleChanges("AUTHOR")}
                  checked={newUser.role === "AUTHOR"}
                />
                <Form.Check
                  type="radio"
                  name="role-select"
                  id="wdf-recipe-reviewer-radio"
                  label="Recipe Reviewer"
                  onChange={() => roleChanges("REVIEWER")}
                  checked={newUser.role === "REVIEWER"}
                />
                <Form.Check
                  type="radio"
                  name="role-select"
                  id="wdf-both-radio"
                  label="Both"
                  onChange={() => roleChanges("BOTH")}
                  checked={newUser.role === "BOTH"}
                />
              </Form.Group>
            </Card.Body>
            <Card.Footer className="d-flex">
              <FlexGap />
              <Button
                className="me-2"
                variant="secondary"
                type="button"
                href="/"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Sign Up
              </Button>
            </Card.Footer>
          </Card>
        </Form>
      </Col>
      <Col xl={4} sm={2} xs={1}></Col>
    </div>
  );
}
