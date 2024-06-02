import "./style.css";
import { useAuth } from "../../../provider/auth.provider";
import { UserContext } from "../../../provider/user.provider";
import { useContext } from "react";
import Card from "../../../components/Card";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faDog,
  faCat,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

export default function Profil() {
  const { setToken } = useAuth();
  const { user } = useContext(UserContext);

  const handleLogout = () => {
    setToken();
  };

  return (
    <main>
      <div className="toolbar">
        <h1>Vetoo</h1>
        <Link to={`/`} className="settings">
          <FontAwesomeIcon icon={faGear} />
        </Link>
      </div>
      {user?.pets.map((pet) => (
        <Link to={`/pet/${pet.id}`} key={pet.id}>
          <Card css="pet">
            {pet.picture_url === null ? (
              pet.type === "d" ? (
                <div className="avatar avatar-empty">
                  <FontAwesomeIcon icon={faDog} />
                </div>
              ) : pet.type === "c" ? (
                <div className="avatar avatar-empty">
                  <FontAwesomeIcon icon={faCat} />
                </div>
              ) : (
                pet.type === "n" && (
                  <div className="avatar avatar-empty">NAC</div>
                )
              )
            ) : (
              <img className="avatar" src={pet.picture_url} alt={pet.name} />
            )}

            <div className="content">
              <p className="name">{pet.name}</p>
              <p className="type">{pet?.birthdate}</p>
            </div>
            <FontAwesomeIcon icon={faChevronRight} />
          </Card>
        </Link>
      ))}

      <Link to={`/new-pet`} className="button">
        Ajouter un animal
      </Link>

      <button className="button" onClick={() => handleLogout()}>
        Déconnexion
      </button>
    </main>
  );
}
