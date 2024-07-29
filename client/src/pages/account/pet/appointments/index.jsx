import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UserContext } from "../../../../provider/user.provider";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { fromLeft, pageTransition } from "../../../../utils/animation.manager";
import { handleDateWithHour } from "../../../../utils/data.manager";

const AppointmentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [appointment, setAppointment] = useState(null);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchAppointment = async () => {
      try {
        fetch(`${process.env.REACT_APP_API_URL}/appointments/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setAppointment(data);
            setIsFetched(true);
          });
      } catch (error) {
        console.error("An error occurred while fetching appointment:", error);
      }
    };

    fetchAppointment();
  }, [id, navigate, user]);

  if (!isFetched) {
    return <div>Loading...</div>;
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
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
        <Link to={`/pet/${appointment.pet_id}`} className="back">
          <FontAwesomeIcon icon={faChevronLeft} />
        </Link>
        <h1>Appointment Details</h1>
        <Link to={`/edit-appointment/${appointment.pet_id}`} className="edit">
          <FontAwesomeIcon icon={faPenToSquare} />
        </Link>
      </header>

      <div className="appointment-detail">
        <div className="info">
          <p>
            <strong>Reason:</strong> {appointment.reason}
          </p>
          <p>
            <strong>Date:</strong> {handleDateWithHour(appointment.meet_at)}
          </p>
          <p>
            <strong>Vet Name:</strong> {appointment.vet_name}
          </p>
          <p>
            <strong>Notes:</strong> {appointment.notes}
          </p>
        </div>
      </div>
    </motion.main>
  );
};

export default AppointmentDetailPage;
