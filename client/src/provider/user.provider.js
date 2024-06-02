import axios from "axios";
import React, { createContext, useState, useLayoutEffect } from "react";

export const UserContext = createContext(); // Créez un contexte UserContext

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const addPet = (newPet) => {
    const updatedUser = { ...user };
    if (!updatedUser.pets) updatedUser.pets = [];

    if (!newPet || !newPet.id)
      return console.error("Erreur lors de l'ajout de l'animal");

    updatedUser.pets.push(newPet);
    setUser(updatedUser);
  };

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  useLayoutEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const fetchData = async () => {
        try {
          if (!user) {
            const response = await axios.get("/api/account", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            updateUser(response.data);
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de l'utilisateur:",
            error
          );
        }
      };
      fetchData();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, addPet }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
