import axios from "axios";
import {
  Recipe,
  Review,
  User,
  UserProfile,
} from "../UtilClasses/Types";
const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;
export type SignInCredentials = Pick<User, "username" | "password">;
export type SignUpDetails = Omit<User, "_id" | "following">;

export const profile = async () => {
  const response = await axiosWithCredentials.post<User | null>(
    `${USERS_API}/profile`
  );
  return response.data;
};
export const signIn = async (credentials: SignInCredentials) => {
  try {
    const response = await axiosWithCredentials.post<User>(
      `${USERS_API}/signIn`,
      credentials
    );
    return response.data;
  } catch (AxiosError) {
    alert("Incorrect username or password");
  }
};
export const signUp = async (user: SignUpDetails) => {
  try {
    const response = await axiosWithCredentials.post<User>(
      `${USERS_API}/signUp`,
      user
    );
    return response.data;
  } catch (AxiosError) {
    alert("That username is already taken. Try a different username.");
  }
};

export const signOut = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signOut`);
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await axiosWithCredentials.get<UserProfile>(
    `${USERS_API}/${userId}`
  );
  return response.data;
};

export const getUserFollowing = async (userId: string) => {
  const response = await axiosWithCredentials.get<User[]>(
    `${USERS_API}/following/${userId}`
  );
  return response.data;
};
export const getUserFollowers = async (userId: string) => {
  const response = await axiosWithCredentials.get<User[]>(
    `${USERS_API}/followers/${userId}`
  );
  return response.data;
};
export const getUserAuthoredRecipes = async (userId: string) => {
  const response = await axiosWithCredentials.get<Recipe[]>(
    `${USERS_API}/authored/${userId}`
  );
  return response.data;
};
export const getUserReviews = async (userId: string) => {
  const response = await axiosWithCredentials.get<Review[]>(
    `${USERS_API}/reviewed/${userId}`
  );
  return response.data;
};
export const updateUser = async (userId: string, updatedUser: User) => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/${userId}`,
    updatedUser
  );
  return response.data;
};
export const followUser = async (following: string, followee: string) => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/follow/${following}/${followee}`
  );
  return response.data;
};
export const unfollowUser = async (unfollowing: string, unfollowee: string) => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/unfollow/${unfollowing}/${unfollowee}`
  );
  return response.data;
};
export const filterUsersByName = async (name: string) => {
  const response = await axiosWithCredentials.get<User[]>(
    `${USERS_API}?name=${name}`
  );
  return response.data;
};
export const deleteUser = async (userId: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
  return response.data;
};
