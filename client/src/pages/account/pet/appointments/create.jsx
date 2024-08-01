import React, { useContext, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { fromLeft, pageTransition } from "../../../../utils/animation.manager";
import { UserContext } from "../../../../provider/user.provider";

const CreateAppointmentsForm = ({ addError }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const [age, setAge] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");
  const [vetName, setVetName] = useState("");
  const [comment, setComment] = useState("");

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

  const validId = user?.pets.map((pet) => pet.id).includes(Number(id));

  if (!validId) {
    navigate("/");
    return null;
  }

  const pet = user.pets.find((pet) => pet.id === Number(id));

  const handleSubmit = (e) => {
    e.preventDefault();

    const meet_at = age;
    const vet_name = vetName;
    const pet_id = pet.id;

    fetch(`${process.env.REACT_APP_API_URL}/appointments`, {
      method: "POST",
      body: JSON.stringify({
        meet_at,
        vet_name,
        reason,
        pet_id,
        comment,
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
        <h1>Planifier un rendez-vous</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="field required">
          <label htmlFor="meet_at">Date du rendez-vous</label>
          <input
            type="date"
            name="meet_at"
            id="meet_at"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="2000-01-02"
          />
        </div>

        <div className="field requird">
          <label htmlFor="reason">Raison</label>
          <select
            name="reason"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          >
            <option value="" disabled>
              Sélectionner une raison
            </option>
            <option value="vaccin">Vaccin</option>
            <option value="consultation">Consultation</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div className="field optional">
          <label htmlFor="vet_name">Vétérinaire</label>
          <input
            type="text"
            name="vet_name"
            id="vet_name"
            value={vetName}
            onChange={(e) => setVetName(e.target.value)}
          />
        </div>

        <div className="field optional">
          <label htmlFor="comment">Commentaire</label>
          <textarea
            name="comment"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        <input className="button" type="submit" value="Créer" />
      </form>
    </motion.main>
  );
};

export default CreateAppointmentsForm;
