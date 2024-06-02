import "./style.css";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/auth.provider";
import { UserContext } from "../../provider/user.provider";
import { useContext } from "react";

export default function Login({ addError }) {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { updateUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
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
        if (data.message) return addError(data.message);
        setToken(data.token);
        updateUser(data.user);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-5xl"
      exit={{ opacity: 0 }}
      transition={{
        type: "linear",
        stiffness: 260,
        damping: 20,
      }}
    >
      <h1>
        Bonjour, <br />
        Bon Retour!
      </h1>
      <form method="post">
        <legend>
          Entrez dans votre espace personnel avec notre interface de connexion
          sécurisée.
        </legend>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Mot de passe"
          min={8}
          required
        />
        <div className="spacer">
          <span>or</span>
        </div>

        <div className="col-2">
          <a href="/api/auth/google" className="button-border">
            <img className="icon" src="/assets/google.png" alt="google" />
            <span>google</span>
          </a>

          <a href="/api/auth/facebook" className="button-border">
            <img className="icon" src="/assets/facebook.png" alt="facebook" />
            <span>facebook</span>
          </a>
        </div>

        <div className="bottom">
          <Link to="/register">
            Toujours pas de compte ?{" "}
            <span className="primary-2">S'inscrire</span>
          </Link>
          <input
            className="button"
            type="submit"
            value="Connectez-vous"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </motion.main>
  );
}
