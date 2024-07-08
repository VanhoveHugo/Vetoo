import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UserContext } from "../../../provider/user.provider";
import { useContext } from "react";
import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faTrash,
  faVenus,
  faMars,
  faDog,
  faCat,
} from "@fortawesome/free-solid-svg-icons";
import { fromLeft, pageTransition } from "../../../utils/animation.manager";

const EditPetPage = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const { id } = useParams();
  const petId = Number(id);
  const { user, deletePet, updatePet } = useContext(UserContext);
  const [birthday, setBirthday] = useState(null);
  let pet = null;

  useEffect(() => {
    if (pet) {
      setSelectedType(pet.type);
      setSelectedGender(pet.gender);
    }
  }, [pet]);

  if (!user) {
    return null;
  }

  if (!user.pets) {
    navigate("/");
    return null;
  }

  if (user.pets.length === 0) {
    navigate("/new-pet");
    return null;
  }

  const validId = user?.pets.map((pet) => pet.id).includes(petId);

  if (!validId) {
    navigate("/");
    return null;
  }

  pet = user.pets.find((pet) => pet.id === petId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const type = document.querySelector("input[name='type']:checked").value;
    const gender = document.querySelector("input[name='gender']:checked").value;
    const birthdate =
      birthday === new Date("2000-01-01").toISOString().split("T")[0]
        ? null
        : document.getElementById("birthdate").value;

    fetch(`/api/pets/${petId}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        type,
        gender,
        birthdate,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        updatePet(data.pet);
        navigate(`/pet/${petId}`, { replace: true });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDelete = () => {
    fetch(`/api/pets/${petId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        deletePet(petId);
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleKeyDown = (event, variable, value) => {
    if (event.key === "Enter" || event.key === " ") {
      if (variable === "type") setSelectedType(value);
      if (variable === "gender") setSelectedGender(value);
    }
  };

  return (
    <motion.main
      initial="initial"
      animate="in"
      exit="out"
      variants={fromLeft}
      transition={pageTransition}
    >
      <div className="toolbar center">
        <Link to={`/pet/${petId}`} className="back">
          <FontAwesomeIcon icon={faChevronLeft} />
        </Link>
        <h1>Modification de votre animal</h1>
        <button className="trash" onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="name">
          <label htmlFor="name">Nom</label>
          <input
            id="name"
            name="name"
            type="text"
            max={20}
            defaultValue={pet.name}
          />
        </div>

        <div className="type">
          <label>Espèce</label>
          <div className="radio-list">
            <div>
              <input
                type="radio"
                name="type"
                id="dog"
                value="d"
                checked={selectedType === "d"}
                onChange={() => setSelectedType("d")}
              />
              <label
                htmlFor="dog"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, "type", "d")}
              >
                <FontAwesomeIcon icon={faDog} />
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="type"
                id="cat"
                value="c"
                checked={selectedType === "c"}
                onChange={() => setSelectedType("c")}
              />
              <label
                htmlFor="cat"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, "type", "c")}
              >
                <FontAwesomeIcon icon={faCat} />
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="type"
                id="nac"
                value="n"
                checked={selectedType === "n"}
                onChange={() => setSelectedType("n")}
              />
              <label
                htmlFor="nac"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, "type", "n")}
              >
                NAC
              </label>
            </div>
          </div>
        </div>

        <div className="gender">
          <label>Genre</label>
          <div className="radio-list">
            <div>
              <input
                type="radio"
                name="gender"
                id="male"
                value="m"
                checked={selectedGender === "m"}
                onChange={() => setSelectedGender("m")}
              ></input>
              <label
                htmlFor="male"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, "gender", "m")}
              >
                <FontAwesomeIcon icon={faMars} />
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="gender"
                id="female"
                value="f"
                checked={selectedGender === "f"}
                onChange={() => setSelectedGender("f")}
              ></input>
              <label
                htmlFor="female"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, "gender", "f")}
              >
                <FontAwesomeIcon icon={faVenus} />
              </label>
            </div>
          </div>
        </div>

        <div className="birthdate">
          <label htmlFor="birthdate">Date de naissance</label>
          <input
            type="date"
            name="birthdate"
            id="birthdate"
            value={birthday}
            defaultValue={
              pet.birthdate
                ? new Date(pet.birthdate).toISOString().split("T")[0]
                : new Date("2000-01-01").toISOString().split("T")[0]
            }
            onChange={(e) => setBirthday(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            min="2000-01-02"
          />
        </div>
        <input
          className="button"
          type="submit"
          value="Sauvegarder"
          onClick={handleSubmit}
        />
      </form>
    </motion.main>
  );
};

export default EditPetPage;
