import { useState } from "react";
import FoodCard from "../components/FoodCard";
import ModalTopping from "../components/ModalTopping";

export default function MenuPage() {
  const foods = [
    {
      id: 1,
      name: "Eskrim",
      price: 12000,
      image: "/eskrim.jpg",
      description: "Eskrim lembut manis.",
      options: ["Oreo", "Mesis"],
    },
    {
      id: 2,
      name: "Mie",
      price: 15000,
      image: "/mie.jpg",
      description: "Mie dengan berbagai rasa.",
      options: ["Goreng", "Aceh", "Rendang"],
    },
    {
      id: 3,
      name: "Bento",
      price: 25000,
      image: "/bento.jpg",
      description: "Bento spesial.",
      options: ["Keju", "Lada Hitam", "Hot Lava"],
    },
    {
      id: 4,
      name: "Plecing Kangkung",
      price: 10000,
      image: "/plecing.jpg",
      description: "Plecing pedas segar.",
      options: [],
    },
  ];

  const [selectedFood, setSelectedFood] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const addFood = (food) => {
    if (food.options.length === 0) {
      // langsung ke keranjang (plecing)
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push({ ...food, option: null });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Ditambahkan ke keranjang!");
    } else {
      setSelectedFood(food);
      setShowModal(true);
    }
  };

  const confirmAdd = (option) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ ...selectedFood, option });
    localStorage.setItem("cart", JSON.stringify(cart));
    setShowModal(false);
    alert("Ditambahkan ke keranjang!");
  };

  return (
    <div className="container mt-4">
      <h2>Menu Makanan</h2>

      <div className="row mt-3">
        {foods.map((f) => (
          <div className="col-md-4" key={f.id}>
            <FoodCard food={f} onAdd={addFood} />
          </div>
        ))}
      </div>

      <ModalTopping
        show={showModal}
        onHide={() => setShowModal(false)}
        food={selectedFood}
        onConfirm={confirmAdd}
      />
    </div>
  );
}
