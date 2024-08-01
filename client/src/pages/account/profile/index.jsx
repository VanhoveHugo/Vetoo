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
        <h1>Mon Espace Santé Animale</h1>
        <Link to={`/new-pet`} className="new-pet button desktop-only">
          Ajouter un animal
        </Link>
        <button className="logout desktop-only" onClick={() => handleLogout()}>
          Déconnexion
        </button>
        <Link to={`/new-pet`} className="new-pet mobile-only">
          <FontAwesomeIcon icon={faPlus} />
        </Link>
        <button className="settings mobile-only" onClick={handleMenu}>
          <FontAwesomeIcon icon={faEllipsis} />
          <ul className="settings--menu">
            <li>
              <button>Profil</button>
            </li>
            <li>
              <button>Paramètre</button>
            </li>
            <li>
              <button onClick={() => handleLogout()}>Déconnexion</button>
            </li>
          </ul>
        </button>
      </div>
      <div className="list">
        {user?.pets &&
          user.pets.map((pet) => (
            <Card css="pet" link={`/pet/${pet.id}`} key={pet.id}>
              {pet.picture_url === undefined || pet.picture_url === null ? (
                pet.type === "d" ? (
                  <div className="avatar avatar-empty">
                    <FontAwesomeIcon icon={faDog} />
                  </div>
                ) : (
                  <div className="avatar avatar-empty">
                    <FontAwesomeIcon icon={faCat} />
                  </div>
                )
              ) : (
                <img className="avatar" src={pet.picture_url} alt={pet.name} />
              )}
              <div className="content">
                <p className="name">{pet.name}</p>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="mobile-only" />
            </Card>
          ))}
      </div>
    </main>
  );
}
