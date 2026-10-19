import * as userClient from "../Clients/userClient";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import { ReactNode } from "react";
export default function Session({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();
  const fetchProfile = async () => {
    try {
      const currentUser = await userClient.profile();
      dispatch(setCurrentUser(currentUser));
    } catch (err) {
      console.error(err);
    }
    setPending(false);
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  if (!pending) {
    return children;
  }
}
