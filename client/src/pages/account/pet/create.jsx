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
    const birthdate =
      birthday === new Date("2000-01-01").toISOString().split("T")[0]
        ? null
        : document.getElementById("birthdate").value;

    fetch(`${process.env.REACT_APP_API_URL}/pets`, {
      method: "POST",
      body: JSON.stringify({
        name,
        type: selectedType,
        gender: selectedGender,
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
        {/* <div className="field">
          <label htmlFor="picture_url">Photo</label>
          <input
            id="picture_url"
            name="picture_url"
            type="file"
            accept="image/png, image/jpeg"
          />
        </div> */}

        <div className="field required">
          <label htmlFor="name">Nom de l'animal</label>
          <input id="name" name="name" type="text" max={20} />
        </div>

        <div className="field required">
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
          </div>
        </div>

        <div className="field optional">
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

        <div className="field optional">
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
