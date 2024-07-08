import React, { useContext, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { fromLeft, pageTransition } from "../../../../utils/animation.manager";
import { UserContext } from "../../../../provider/user.provider";

const CreateWeightForm = ({ addError }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);

  // State pour gérer les champs du formulaire
  const [weightData, setWeightData] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    pet_id: id
  });

  // Rediriger si l'utilisateur n'est pas connecté ou n'a pas d'animaux
  if (!user) {
    navigate("/");
    return null;
  }

  if (!user.pets || user.pets.length === 0) {
    navigate("/new-pet");
    return null;
  }

  // Vérifier si l'ID de l'animal est valide
  const validId = user?.pets.map((pet) => pet.id).includes(Number(id));
  if (!validId) {
    navigate("/");
    return null;
  }

  const pet = user.pets.find((pet) => pet.id === Number(id));

  // Gestionnaire de soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation rapide des champs
    if (!weightData.weight) {
      addError("Veuillez entrer le poids.");
      return;
    }

    fetch("/api/weights", {
      method: "POST",
      body: JSON.stringify({
        data: weightData
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          return addError(data.message);
        }
        navigate(`/pet/${pet.id}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Gestionnaire de changement pour mettre à jour le state des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setWeightData({ ...weightData, [name]: value });
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
        <Link to={`/pet/${id}`} className="back">
          <FontAwesomeIcon icon={faChevronLeft} />
        </Link>
        <h1>Ajouter le poids</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="birthday">
          <label htmlFor="date">Date de pesée</label>
          <input
            type="date"
            id="date"
            name="date"
            value={weightData.date}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            min="2000-01-02"
          />
        </div>

        <div className="name">
          <label htmlFor="weight">Poids</label>
          <input
            type="number"
            id="weight"
            name="weight"
            step="0.01"
            value={weightData.weight}
            onChange={handleChange}
            max={100}
            min={1}
            required
          />
        </div>

        <input className="button" type="submit" value="Créer" />
      </form>
    </motion.main>
  );
};

export default CreateWeightForm;
