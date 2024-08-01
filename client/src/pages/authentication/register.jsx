import { Link } from "react-router-dom";
import "./style.css";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Register() {
  const [ConditionError, setConditionError] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!document.getElementById("CGU").checked) {
      return setConditionError(
        "Veuillez accepter les conditions générales d'utilisation"
      );
    }

    fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message) return console.error(data.message);
        return (window.location.href = "/login");
      })
      .catch((err) => {
        console.error(err);
        alert("Error registering please try again");
      });
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="form-center"
      exit={{ opacity: 0 }}
      transition={{
        type: "linear",
        stiffness: 260,
        damping: 20,
      }}
    >
      <h1>Créer un compte</h1>
      <form method="post">
        <div className="field required">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="username"
            name="username"
            id="username"
            pattern=".{2,}"
            required
          />
        </div>
        <div className="field required">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            class="... invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            required
          />
        </div>
        <div className="field required">
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="password"
            id="password"
            minLength={8}
            pattern=".{7,}"
            required
          />
        </div>
        <div className="field CGU">
          <input
            type="checkbox"
            id="CGU"
            className="checkbox-rounded"
            onChange={() => setConditionError(null)}
          />
          <label htmlFor="CGU">
            J’accepte les{" "}
            <a href="conditions-générales-utilisation" className="primary-2">
              conditions générales d’utilisation
            </a>
          </label>
          {ConditionError && <p className="error">{ConditionError}</p>}
        </div>
        <div className="bottom">
          <Link to="/login">
            Déjà un compte ? <span className="primary-2">Connexion</span>
          </Link>
          <input
            className="button"
            type="submit"
            value="Commencer"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </motion.main>
  );
}
