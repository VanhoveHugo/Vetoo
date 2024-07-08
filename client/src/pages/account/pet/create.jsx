import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faVenus,
  faMars,
  faDog,
  faCat,
} from "@fortawesome/free-solid-svg-icons";
import { fromLeft, pageTransition } from "../../../utils/animation.manager";
import { UserContext } from "../../../provider/user.provider";

const CreatePetForm = ({ addError }) => {
  const navigate = useNavigate();
  const { addPet } = useContext(UserContext);
  const [selectedType, setSelectedType] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [birthday, setBirthday] = useState(
    new Date("2000-01-01").toISOString().split("T")[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const gender = document.querySelector(
      "input[name='gender']:checked"
    )?.value;
    const type = document.querySelector("input[name='type']:checked").value;
    const birthdate =
      birthday === new Date("2000-01-01").toISOString().split("T")[0]
        ? null
        : document.getElementById("birthdate").value;

    fetch("/api/pets", {
      method: "POST",
      body: JSON.stringify({
        name,
        gender,
        type,
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
        if (data.message) return addError(data.message);
        addPet(data);
        navigate("/", { replace: true });
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
      <div className="toolbar leftCTA">
        <Link to={`/`} className="back">
          <FontAwesomeIcon icon={faChevronLeft} />
        </Link>
        <h1>Créer un animal</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="name">
          <label htmlFor="name">Nom</label>
          <input id="name" name="name" type="text" max={20} />
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
            onChange={(e) => setBirthday(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            min="2000-01-02"
          />
        </div>
        <input
          className="button"
          type="submit"
          value="Créer"
          onClick={handleSubmit}
        />
      </form>
    </motion.main>
  );
};

export default CreatePetForm;
