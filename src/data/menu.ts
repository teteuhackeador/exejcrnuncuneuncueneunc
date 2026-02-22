export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Smash",
    description: "Pão brioche, blend 150g, queijo cheddar, alface, tomate e molho especial.",
    price: 28,
  },
  {
    id: "2",
    name: "BBQ Bacon",
    description: "Pão brioche, blend 180g, bacon crocante, cebola caramelizada e molho BBQ.",
    price: 34,
  },
  {
    id: "3",
    name: "Duplo Cheddar",
    description: "Pão brioche, 2x blend 120g, duplo cheddar, picles e mostarda.",
    price: 38,
  },
  {
    id: "4",
    name: "Chicken Crispy",
    description: "Pão brioche, frango empanado crocante, maionese de ervas e salada.",
    price: 30,
  },
  {
    id: "5",
    name: "Veggie Burger",
    description: "Pão integral, hambúrguer de grão-de-bico, rúcula, tomate seco e molho tahine.",
    price: 32,
  },
  {
    id: "6",
    name: "Mega Bacon",
    description: "Pão brioche, blend 200g, triplo bacon, cheddar derretido e molho da casa.",
    price: 42,
  },
];

export const additionalOptions = [
  { name: "Bacon", price: 5 },
  { name: "Cheddar", price: 4 },
  { name: "Ovo", price: 3 },
];

export const removableIngredients = [
  "Alface",
  "Tomate",
  "Cebola",
  "Picles",
  "Molho",
];
