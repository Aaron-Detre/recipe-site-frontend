import { ListGroup, ListGroupItem } from "react-bootstrap";
import { User } from "../../UtilClasses/Types";
import UserInfoCard from "./UserInfoCard";

export default function UserList({
  users,
  getUserRole,
}: {
  users: User[];
  getUserRole: (user: User) => string;
}) {
  return (
    <ListGroup>
      {users.map(
        (user: User, index: number) =>
          index < 5 && (
            <ListGroupItem key={user._id} action href={`/profile/${user._id}`}>
              <UserInfoCard username={user.username} role={getUserRole(user)} />
            </ListGroupItem>
          )
      )}
    </ListGroup>
  );
}
