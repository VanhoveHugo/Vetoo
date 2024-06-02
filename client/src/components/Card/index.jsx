import "./style.css";

export default function Card({ css, children }) {
  return <div className={"card " + css}>{children}</div>;
}
