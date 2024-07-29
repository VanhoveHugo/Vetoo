import { Link } from "react-router-dom";

export default function Card({ css, link, children }) {
  return (
    <Link className={"card " + css} to={link}>
      {children}
    </Link>
  );
}
