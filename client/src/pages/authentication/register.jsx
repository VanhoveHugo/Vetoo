import { Link } from "react-router-dom";
import "./style.css";
import { motion } from "framer-motion";

export default function Register({ addError }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/api/auth/register", {
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
        if (res.status === 201)
          addError("Votre compte a bien été créé, vous pouvez vous connecter.");
        return res.json();
      })
      .then((data) => {
        if (data.message) return addError(data.message);
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
        <legend>
          Inscrivez-vous dès maintenant et commencez à profiter de tous les
          avantages de notre plateforme.
        </legend>
        <label for="username">
          <span>Nom d'utilisateur</span>
          <input
            type="username"
            name="username"
            id="username"
            placeholder=" "
            pattern=".{2,}"
            required
          />
        </label>
        <label for="email">
          <span>Email</span>
          <input
            type="email"
            name="email"
            id="email"
            class="... invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
            placeholder=" "
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            required
            />
        </label>
        <label for="password">
          <span>Password</span>
          <input
            type="password"
            name="password"
            id="password"
            placeholder=" "
            pattern=".{7,}"
            required
          />
        </label>
        <div className="CGU">
          <input type="checkbox" id="CGU" className="checkbox-rounded" />
          <label htmlFor="CGU">
            J’accepte les{" "}
            <a href="conditions-générales-utilisation" className="primary-2">
              conditions générales d’utilisation
            </a>
          </label>
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
