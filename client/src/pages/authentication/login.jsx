import "./style.css";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/auth.provider";
import { UserContext } from "../../provider/user.provider";
import { useContext, useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { updateUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    setError(null);

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
        if (data.message) return setError(data.message);
        if (data.content) {
          if (data.content === "email") return setEmailError(data.kind);
          if (data.content === "password") return setPasswordError(data.kind);
        }
        if (!data.token) return setError("Erreur serveur.");
        setToken(data.token);
        updateUser(data.user);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.error(err);
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
      <h1>Connexion</h1>
      <form method="post" noValidate>
        <legend>
          Entrez dans votre espace personnel avec notre interface de connexion
          sécurisée.
        </legend>
        {error && <p className="error">{error}</p>}

        <div className="field">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={() => setEmailError(null)}
            required
          />
          {emailError && <p className="error">{emailError}</p>}
        </div>
        <div className="field">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Mot de passe"
            min={8}
            onChange={() => setPasswordError(null)}
            required
          />
          {passwordError && <p className="error">{passwordError}</p>}
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
