import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FlexGap from "../UtilClasses/FlexGap";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import AccountButtons from "./AccountButtons";

export type Path = { link: string; label: string };
export const paths: Path[] = [
  { link: "/home", label: "Home" },
  { link: "/search?tab=recipes", label: "Search" },
  { link: "/details", label: "Details" },
  { link: "/profile", label: "Profile" },
  { link: "/editor", label: "Editor" },
];

export default function TOC() {
  const { currentUser } = useSelector((state: RootState) => state.account);
  const pathname = usePathname();
  return (
    <div className="position-fixed bottom-0 top-0 d-none d-md-block z-2">
      <div className="wdf-flex-column">
        <h3 className="m-3 mb-4">Recipe Site</h3>
        <Nav variant="pills" className="wd-nav-menu ">
          {paths.map((path: Path) => (
            <NavItem key={path.label}>
              <NavLink
                className={`bg-white text-center fs-2 ${
                  pathname.includes(path.label.toLowerCase())
                    ? "text-danger"
                    : "text-black"
                }`}
                as={Link}
                href={path.link}
              >
                {path.label}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <FlexGap />
        <AccountButtons className="wdf-toc-button" />
      </div>
    </div>
  );
}
