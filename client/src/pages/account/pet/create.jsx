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
  const [age, setAge] = useState(
    new Date("2000-01-01").toISOString().split("T")[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const gender = document.querySelector("input[name='gender']:checked").value;
    const type = document.querySelector("input[name='type']:checked").value;

    fetch("/api/pets", {
      method: "POST",
      body: JSON.stringify({
        name,
        gender,
        type,
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
        console.log(err);
      });
  };

  const handleGender = (e) => {
    // remove class from the other radio button
    const otherRadio = document.querySelector(".radio-list input");
    otherRadio.classList.remove("selected");
    // add class to the selected radio button
    const radio = e.target;
    radio.classList.add("selected");
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
              <input type="radio" name="type" id="dog" value="d"></input>
              <label htmlFor="dog" onclick={handleGender}>
                <FontAwesomeIcon icon={faDog} />
              </label>
            </div>
            <div>
              <input type="radio" name="type" id="cat" value="c"></input>
              <label htmlFor="cat" onclick={handleGender}>
                <FontAwesomeIcon icon={faCat} />
              </label>
            </div>
            <div>
              <input type="radio" name="type" id="nac" value="n"></input>
              <label htmlFor="nac" onclick={handleGender}>
                NAC
              </label>
            </div>
          </div>
        </div>

        <div className="gender">
          <label>Genre</label>
          <div className="radio-list">
            <div>
              <input type="radio" name="gender" id="male" value="m"></input>
              <label htmlFor="male" onclick={handleGender}>
                <FontAwesomeIcon icon={faMars} />
              </label>
            </div>
            <div>
              <input type="radio" name="gender" id="female" value="f"></input>
              <label htmlFor="female" onclick={handleGender}>
                <FontAwesomeIcon icon={faVenus} />
              </label>
            </div>
          </div>
        </div>

        <div className="birthday">
          <label htmlFor="birthday">Date de naissance</label>
          <input
            type="date"
            name="birthday"
            id="birthday"
            value={age}
            onChange={(e) => setAge(e.target.value)}
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
