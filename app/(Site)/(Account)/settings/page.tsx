"use client";
import { RootState } from "@/app/(Site)/store";
import FlexGap from "@/app/(Site)/UtilClasses/FlexGap";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../reducer";
import { redirect } from "next/navigation";
import * as userClient from "../../Clients/userClient";
import { setTitle } from "../../reducer";
import { User } from "../../UtilClasses/Types";
import type { ChangeEvent, SubmitEvent } from "react";

export default function Settings() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle("Settings"));
  }, [dispatch]);

  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.account);

  const fetchProfile = () => {
    if (currentUser) {
      setUpdatedUser(currentUser);
    } else {
      redirect("/settings/restricted");
    }
  };
  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const usernameChanges = (e: ChangeEvent<HTMLInputElement>) =>
    setUpdatedUser((user) =>
      user ? { ...user, username: e.target.value } : user
    );
  const passwordChanges = (e: ChangeEvent<HTMLInputElement>) =>
    setUpdatedUser((user) =>
      user ? { ...user, password: e.target.value } : user
    );
  const emailChanges = (e: ChangeEvent<HTMLInputElement>) =>
    setUpdatedUser((user) => (user ? { ...user, email: e.target.value } : user));
  const phoneNumberChanges = (e: ChangeEvent<HTMLInputElement>) =>
    setUpdatedUser((user) => (user ? { ...user, phone: e.target.value } : user));
  const roleChanges = (value: string) =>
    setUpdatedUser((user) => (user ? { ...user, role: value } : user));

  const onSave = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updatedUser?.username && updatedUser.password) {
      userClient.updateUser(updatedUser._id, updatedUser);
      dispatch(setCurrentUser(updatedUser));
    }
  };

  const getDefaultCheckedRole = (roleCheckbox: string) => {
    return updatedUser?.role === roleCheckbox;
  };

  return (
    <div>
      <h1>
        <Link href={"/profile"} className="wdf-breadcrumb-link">
          Profile
        </Link>{" "}
        {">"} Settings
      </h1>
      <div className="d-flex justify-content-center">
        <Col xl={4} sm={2} xs={1}></Col>
        <Col xl={4} sm={8} xs={10}>
          <Form className="w-100 mt-5" onSubmit={onSave}>
            <Card>
              <Card.Header>Change Account Details</Card.Header>
              <Card.Body>
                <Form.Group controlId="wdf-username-entry" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={usernameChanges}
                    value={updatedUser?.username || ""}
                    placeholder="Username"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="wdf-password-entry" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    onChange={passwordChanges}
                    value={updatedUser?.password || ""}
                    placeholder="Password"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="wdf-email-entry" className="mb-3">
                  <Form.Label>Email (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={emailChanges}
                    value={updatedUser?.email || ""}
                    placeholder="Email Address"
                  />
                </Form.Group>
                <Form.Group controlId="wdf-phone-entry" className="mb-3">
                  <Form.Label>Phone Number (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={phoneNumberChanges}
                    value={updatedUser?.phone || ""}
                    placeholder="Phone Number"
                  />
                </Form.Group>

                <Form.Group controlId="wdf-role-select">
                  <Form.Label>Role</Form.Label>
                  <Form.Check
                    type="radio"
                    name="role-select"
                    id="wdf-recipe-author-radio"
                    label="Recipe Author"
                    onChange={() => roleChanges("AUTHOR")}
                    checked={getDefaultCheckedRole("AUTHOR")}
                  />
                  <Form.Check
                    type="radio"
                    name="role-select"
                    id="wdf-recipe-reviewer-radio"
                    label="Recipe Reviewer"
                    onChange={() => roleChanges("REVIEWER")}
                    checked={getDefaultCheckedRole("REVIEWER")}
                  />
                  <Form.Check
                    type="radio"
                    name="role-select"
                    id="wdf-both-radio"
                    label="Both"
                    onChange={() => roleChanges("BOTH")}
                    checked={getDefaultCheckedRole("BOTH")}
                  />
                </Form.Group>
              </Card.Body>
              <Card.Footer className="d-flex">
                <FlexGap />
                <Button
                  className="me-2"
                  variant="secondary"
                  type="button"
                  href="/profile"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save
                </Button>
              </Card.Footer>
            </Card>
          </Form>
        </Col>
        <Col xl={4} sm={2} xs={1}></Col>
      </div>
    </div>
  );
}
