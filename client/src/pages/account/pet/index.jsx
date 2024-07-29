import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UserContext } from "../../../provider/user.provider";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { fromLeft, pageTransition } from "../../../utils/animation.manager";
import { convertDateToAge, handleDate } from "../../../utils/data.manager";
import WeightChart from "../../../components/WeightChart";
import NotFound from "../../404";

const PetPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [weights, setWeights] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const foundPet = user.pets.find((pet) => pet.id === Number(id));

      if (foundPet) setPet(foundPet);
      setLoading(false);
    }
  }, [user, id, navigate]);

  useEffect(() => {
    if (!pet || isFetched) return;

    fetch(`${process.env.REACT_APP_API_URL}/appointments/${pet.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setIsFetched(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [pet, isFetched]);

  useEffect(() => {
    // Remplacez par votre appel API pour obtenir les poids
    fetch(`${process.env.REACT_APP_API_URL}/weights/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setWeights(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (loading) {
    return;
  }

  if (!pet) {
    console.log("too");
    return <NotFound />;
  }

  return (
    <motion.main
      initial="initial"
      animate="in"
      exit="out"
      variants={fromLeft}
      transition={pageTransition}
    >
      <header className="toolbar center">
        <Link to={`/`} className="back">
          <FontAwesomeIcon icon={faChevronLeft} />
        </Link>
        <h1>{pet.name}</h1>
        <Link to={`/pet/edit/${pet.id}`} className="edit">
          <FontAwesomeIcon icon={faPenToSquare} />
        </Link>
      </header>

      <div className="pet-infos">
        <img className="" src={pet.picture_url} alt={pet.name} />
        <div className="info">
          <p className="all-infos">
            {pet.type && (
              <span>
                {pet.type === "d"
                  ? pet.gender === "f"
                    ? "Chienne"
                    : "Chien"
                  : pet.type === "c"
                  ? pet.gender === "f"
                    ? "Chatte"
                    : "Chat"
                  : "NAC"}
              </span>
            )}
            {pet.birthdate && <span>{convertDateToAge(pet.birthdate)}</span>}
          </p>
          <p className="chip">{pet.chip}</p>
        </div>
      </div>

      <section>
        <Link to={`/weight/${pet.id}`} className="head">
          <h2>Poids</h2>
          <FontAwesomeIcon icon={faChevronRight} />
        </Link>
        <div className="content">
          {weights.length > 0 ? (
            <WeightChart weights={weights} />
          ) : (
              <p>Vous n'avez pas encore renseigné le poids de votre animal.</p>
            )
          }
        </div>
      </section>
      {/* <section>
        <div className="head">
          <h2>Vaccins</h2>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
        <div className="content">
          <p>Vous n'avez pas encore renseigné le poids de votre animal.</p>
        </div>
      </section>
      <section>
        <div className="head">
          <h2>Traitements</h2>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
        <div className="content">
          <p>Vous n'avez pas encore renseigné le poids de votre animal.</p>
        </div>
      </section> */}
      <section>
        <Link to={`/new-appointment/${pet.id}`} className="head">
          <h2>Rendez-vous vétérinaire</h2>
          <FontAwesomeIcon icon={faChevronRight} />
        </Link>
        <div className="content">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              // <Link
              //   to={`/appointment/${appointment.id}`}
              //   key={appointment.id}
              //   className="column appointment"
              // >
              <div className="column appointment">
                <div className="row">
                  <p className="reason">{appointment.reason}</p>
                  <p className="meet_at">{handleDate(appointment.meet_at)}</p>
                </div>
                <div className="row">
                  <p>{appointment.vet_name}</p>
                </div>
              </div>
              // </Link>
            ))
          ) : (
            <p>Vous n'avez pas encore renseigné vos prochains rendez-vous.</p>
          )}
        </div>
      </section>
    </motion.main>
  );
};

export default PetPage;
