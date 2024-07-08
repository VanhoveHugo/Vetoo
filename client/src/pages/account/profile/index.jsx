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
  faEllipsis,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function Profil() {
  const { setToken } = useAuth();
  const { user } = useContext(UserContext);
  // handle menu visibility
  const handleMenu = () => {
    const menu = document.querySelector(".settings--menu");
    menu.classList.toggle("visible");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setToken();
  };

  return (
    <main>
      <div className="toolbar">
        <h1>Vetoo</h1>
        <Link to={`/new-pet`} className="new-pet">
          <FontAwesomeIcon icon={faPlus} />
        </Link>
        <button className="settings" onClick={handleMenu}>
          <FontAwesomeIcon icon={faEllipsis} />
          <ul className="settings--menu">
            {/* <li>Paramètres</li>
            <li>A propos</li> */}
            <li>
              <button onClick={() => handleLogout()}>Déconnexion  </button>
            </li>
          </ul>
        </button>
      </div>
      {user?.pets &&
        user.pets.map((pet) => (
          <Link to={`/pet/${pet.id}`} key={pet.id}>
            <Card css="pet">
              {pet.picture_url === undefined || pet.picture_url === null ? (
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
              </div>
              <FontAwesomeIcon icon={faChevronRight} />
            </Card>
          </Link>
        ))}
    </main>
  );
}
