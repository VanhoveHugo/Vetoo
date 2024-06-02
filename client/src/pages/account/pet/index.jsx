import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UserContext } from "../../../provider/user.provider";
import { useContext } from "react";
import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { handleDate, handleType } from "../../../utils/data.manager";
import { fromLeft, pageTransition } from "../../../utils/animation.manager";

const PetPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);

  if (!user) {
    return null;
  }

  if (!user.pets) {
    navigate("/profile");
    return null;
  }

  if (user.pets.length === 0) {
    navigate("/new-pet");
    return null;
  }

  const validId = user?.pets.map((pet) => pet.id).includes(Number(id));

  if (!validId) {
    navigate("/profile");
    return null;
  }

  const pet = user.pets.find((pet) => pet.id === Number(id));

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
        <h1>{pet.name}</h1>
      </div>
      <div className="content">
        <img src={pet.picture_url} alt={pet.name} />
        <p>{handleDate(pet.birthdate)}</p>
        <p>{handleType(pet.type)}</p>
      </div>
    </motion.main>
  );
};

export default PetPage;
