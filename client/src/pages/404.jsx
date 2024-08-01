import { Link } from "react-router-dom";
import styled from "styled-components";

export const ErrorContainer = styled.main`
  text-align: center;
  padding: 20px;
  padding-top: 10rem;
`;

export const ErrorTitle = styled.h1`
  font-size: 7rem;
  color: #333;
`;

export const ErrorSubtitle = styled.h2`
  font-size: 4rem;
  margin-bottom: 2rem;
`;

export const ErrorMessage = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

export const ErrorReturn = styled.div`
  a {
    text-decoration: underline;
    color: #3498db;
    transition: color 0.3s ease;

    &:hover {
      color: #2980b9;
    }
  }
`;

export default function NotFound() {
  return (
    <ErrorContainer>
      <ErrorTitle>404</ErrorTitle>
      <ErrorSubtitle>Page non trouvée</ErrorSubtitle>
      <ErrorMessage>
        La page que vous tentez d'afficher n'existe pas ou une erreur s'est
        produite.
      </ErrorMessage>
      <ErrorReturn>
        Vous pouvez revenir à <Link to="/">la page d'accueil</Link>
      </ErrorReturn>
    </ErrorContainer>
  );
}
