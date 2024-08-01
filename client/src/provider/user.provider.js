import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(); // Créez un contexte UserContext

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isFetched, setIsFetched] = useState(false);

  const addPet = (newPet) => {
    if (!newPet || !newPet.id)
      return console.error("Erreur lors de l'ajout de l'animal");

    const updatedUser = { ...user, pets: [...user.pets, newPet] };
    updateUser(updatedUser);
  };

  const updatePet = (updatedPet) => {
    if (!updatedPet || !updatedPet.id)
      return console.error("Erreur lors de la mise à jour de l'animal");

    updatedPet.id = Number(updatedPet.id);

    const updatedUser = {
      ...user,
      pets: user.pets.map((pet) =>
        pet.id === updatedPet.id ? updatedPet : pet
      ),
    };

    updateUser(updatedUser);
  };

  const deletePet = (petId) => {
    const updatedUser = {
      ...user,
      pets: user.pets.filter((pet) => pet.id !== Number(petId)),
    };
    updateUser(updatedUser);
  };

  const updateUser = (newUser) => {
    if (!newUser)
      return console.error("Erreur lors de la mise à jour de l'utilisateur");
    if (!newUser.pets) newUser.pets = [];
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsFetched(true);
    } else {
      if (!localStorage.getItem("token")) return
      const fetchData = async () => {
        try {
          fetch(`${process.env.REACT_APP_API_URL}/account`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((res) => res.json())
            .then((data) => {
              updateUser(data);
              setIsFetched(true);
            });
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de l'utilisateur:",
            error
          );
        }
      };
      if (!isFetched) {
        fetchData();
      }
    }
  }, [isFetched]);

  return (
    <UserContext.Provider
      value={{ user, updateUser, addPet, deletePet, updatePet }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
