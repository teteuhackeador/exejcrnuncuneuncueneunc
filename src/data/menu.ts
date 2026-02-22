export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'burger' | 'drink';
  image: string;
}

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Smash",
    description: "Pão brioche, blend 150g, queijo cheddar, alface, tomate e molho especial.",
    price: 28,
    category: 'burger',
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    name: "BBQ Bacon",
    description: "Pão brioche, blend 180g, bacon crocante, cebola caramelizada e molho BBQ.",
    price: 34,
    category: 'burger',
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    name: "Duplo Cheddar",
    description: "Pão brioche, 2x blend 120g, duplo cheddar, picles e mostarda.",
    price: 38,
    category: 'burger',
    image: "https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    name: "Chicken Crispy",
    description: "Pão brioche, frango empanado crocante, maionese de ervas e salada.",
    price: 30,
    category: 'burger',
    image: "https://images.unsplash.com/photo-1615719413546-198b25453f85?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "5",
    name: "Veggie Burger",
    description: "Pão integral, hambúrguer de grão-de-bico, rúcula, tomate seco e molho tahine.",
    price: 32,
    category: 'burger',
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "6",
    name: "Mega Bacon",
    description: "Pão brioche, blend 200g, triplo bacon, cheddar derretido e molho da casa.",
    price: 42,
    category: 'burger',
    image: "https://images.unsplash.com/photo-1534790566855-4cb788d389ec?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "7",
    name: "Coca-Cola 350ml",
    description: "Refrigerante lata bem gelado.",
    price: 6,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "8",
    name: "Suco de Laranja Natural",
    description: "Suco de laranja natural feito na hora (400ml).",
    price: 9,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "9",
    name: "Guaraná Antarctica",
    description: "Refrigerante lata bem gelado.",
    price: 6,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1595981267035-7b04d84d12bb?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "10",
    name: "Cerveja Heineken Long Neck",
    description: "Cerveja pilsen long neck (330ml).",
    price: 12,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1614316047717-b0853489e246?auto=format&fit=crop&q=80&w=800",
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
