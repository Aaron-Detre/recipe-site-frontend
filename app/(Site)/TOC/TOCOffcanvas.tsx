"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, NavItem, NavLink, Offcanvas } from "react-bootstrap";
import { Path, paths } from "./TOC";
import FlexGap from "../UtilClasses/FlexGap";
import AccountButtons from "./AccountButtons";

export default function TOCOffcanvas({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <Offcanvas show={show} onHide={handleClose} className="wdf-offcanvas-menu">
      <Offcanvas.Header closeButton>
        <h3>Recipe Site</h3>
      </Offcanvas.Header>
      <Offcanvas.Body className="wdf-flex-column">
        <Nav variant="pills" className="wd-nav-menu">
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
                onClick={handleClose}
              >
                {path.label}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <FlexGap />
        <AccountButtons className="wdf-offcanvas-button" />
      </Offcanvas.Body>
    </Offcanvas>
  );
}
