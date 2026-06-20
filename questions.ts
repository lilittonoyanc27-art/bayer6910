export interface Question {
  id: number;
  spanishQuestion: string;
  armenianTranslation: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export const questions: Question[] = [
  {
    id: 1,
    spanishQuestion: "¿Cuál es el antónimo de caro?",
    armenianTranslation: "թանկ բառի հականիշն ո՞րն է։",
    options: [
      { key: 'A', text: "barato" },
      { key: 'B', text: "bonito" },
      { key: 'C', text: "grande" },
      { key: 'D', text: "joven" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 2,
    spanishQuestion: "¿Cuál es el antónimo de fácil?",
    armenianTranslation: "հեշտ բառի հականիշն ո՞րն է։",
    options: [
      { key: 'A', text: "difícil" },
      { key: 'B', text: "feliz" },
      { key: 'C', text: "fresco" },
      { key: 'D', text: "fuerte" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 3,
    spanishQuestion: "¿Cuál es el sinónimo de bonito?",
    armenianTranslation: "գեղեցիկ բառի հոմանիշն ո՞րն է։",
    options: [
      { key: 'A', text: "feo" },
      { key: 'B', text: "precioso" },
      { key: 'C', text: "triste" },
      { key: 'D', text: "vacío" }
    ],
    correctAnswer: 'B'
  },
  {
    id: 4,
    spanishQuestion: "¿Cuál es el antónimo de alto?",
    armenianTranslation: "բարձրահասակ բառի հականիշն ո՞րն է։",
    options: [
      { key: 'A', text: "bajo" },
      { key: 'B', text: "rubio" },
      { key: 'C', text: "moreno" },
      { key: 'D', text: "delgado" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 5,
    spanishQuestion: "¿Qué palabra pertenece al tema “viaje”?",
    armenianTranslation: "Ո՞ր բառն է պատկանում «ճանապարհորդություն» թեմային։",
    options: [
      { key: 'A', text: "pasaporte" },
      { key: 'B', text: "sofá" },
      { key: 'C', text: "zanahoria" },
      { key: 'D', text: "lámpara" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 6,
    spanishQuestion: "¿Qué palabra pertenece al tema “comida”?",
    armenianTranslation: "Ո՞ր բառն է պատկանում «ուտելիք» թեմային։",
    options: [
      { key: 'A', text: "queso" },
      { key: 'B', text: "tren" },
      { key: 'C', text: "ventana" },
      { key: 'D', text: "zapato" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 7,
    spanishQuestion: "¿Cuál es el antónimo de triste?",
    armenianTranslation: "տխուր բառի հականիշն ո՞րն է։",
    options: [
      { key: 'A', text: "alegre" },
      { key: 'B', text: "oscuro" },
      { key: 'C', text: "tarde" },
      { key: 'D', text: "pobre" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 8,
    spanishQuestion: "¿Qué palabra pertenece al tema “ropa”?",
    armenianTranslation: "Ո՞ր բառն է պատկանում «հագուստ» թեմային։",
    options: [
      { key: 'A', text: "camiseta" },
      { key: 'B', text: "aeropuerto" },
      { key: 'C', text: "baño" },
      { key: 'D', text: "perro" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 9,
    spanishQuestion: "¿Cuál es el antónimo de viejo?",
    armenianTranslation: "հին / ծեր բառի հականիշն ո՞րն է։",
    options: [
      { key: 'A', text: "nuevo" },
      { key: 'B', text: "difícil" },
      { key: 'C', text: "caro" },
      { key: 'D', text: "rápido" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 10,
    spanishQuestion: "¿Cuál es el antónimo de abierto?",
    armenianTranslation: "բաց բառի հականիշն ո՞րն է։",
    options: [
      { key: 'A', text: "cerrado" },
      { key: 'B', text: "claro" },
      { key: 'C', text: "lleno" },
      { key: 'D', text: "tranquilo" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 11,
    spanishQuestion: "¿Qué palabra pertenece al tema “casa”?",
    armenianTranslation: "Ո՞ր բառն է պատկանում «տուն» թեմային։",
    options: [
      { key: 'A', text: "dormitorio" },
      { key: 'B', text: "billete" },
      { key: 'C', text: "playa" },
      { key: 'D', text: "examen" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 12,
    spanishQuestion: "¿Cuál es el sinónimo de habitación?",
    armenianTranslation: "սենյակ բառի հոմանիշն ո՞րն է։",
    options: [
      { key: 'A', text: "cuarto" },
      { key: 'B', text: "calle" },
      { key: 'C', text: "coche" },
      { key: 'D', text: "ciudad" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 13,
    spanishQuestion: "¿Qué palabra pertenece al tema “transporte”?",
    armenianTranslation: "Ո՞ր բառն է պատկանում «տրանսպորտ» թեմային։",
    options: [
      { key: 'A', text: "autobús" },
      { key: 'B', text: "tarta" },
      { key: 'C', text: "falda" },
      { key: 'D', text: "mesa" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 14,
    spanishQuestion: "¿Cuál es el antónimo de dentro de?",
    armenianTranslation: "ներսում բառի հականիշն ո՞րն է։",
    options: [
      { key: 'A', text: "fuera de" },
      { key: 'B', text: "al lado" },
      { key: 'C', text: "encima de" },
      { key: 'D', text: "delante de" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 15,
    spanishQuestion: "¿Cuál es el antónimo de antes?",
    armenianTranslation: "առաջ բառի հականիշն ո՞րն է։",
    options: [
      { key: 'A', text: "después" },
      { key: 'B', text: "siempre" },
      { key: 'C', text: "nunca" },
      { key: 'D', text: "pronto" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 16,
    spanishQuestion: "¿Qué palabra pertenece al tema “familia”?",
    armenianTranslation: "Ո՞ր բառն է պատկանում «ընտանիք» թեմային։",
    options: [
      { key: 'A', text: "madre" },
      { key: 'B', text: "mapa" },
      { key: 'C', text: "cine" },
      { key: 'D', text: "café" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 17,
    spanishQuestion: "¿Cuál es el antónimo de pobre?",
    armenianTranslation: "աղքատ բառի հականիշն ո՞րն է։",
    options: [
      { key: 'A', text: "rico" },
      { key: 'B', text: "raro" },
      { key: 'C', text: "bajo" },
      { key: 'D', text: "tímido" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 18,
    spanishQuestion: "¿Qué palabra pertenece al tema “ciudad”?",
    armenianTranslation: "Ո՞ր բառն է պատկանում «քաղաք» թեմային։",
    options: [
      { key: 'A', text: "calle" },
      { key: 'B', text: "queso" },
      { key: 'C', text: "camisa" },
      { key: 'D', text: "sueño" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 19,
    spanishQuestion: "¿Cuál es el antónimo de rápido?",
    armenianTranslation: "արագ բառի հականիշն ո՞րն է։",
    options: [
      { key: 'A', text: "despacio" },
      { key: 'B', text: "nuevo" },
      { key: 'C', text: "alegre" },
      { key: 'D', text: "blanco" }
    ],
    correctAnswer: 'A'
  },
  {
    id: 20,
    spanishQuestion: "¿Qué palabra pertenece al tema “estudios”?",
    armenianTranslation: "Ո՞ր բառն է պատկանում «ուսում» թեմային։",
    options: [
      { key: 'A', text: "examen" },
      { key: 'B', text: "carne" },
      { key: 'C', text: "playa" },
      { key: 'D', text: "botella" }
    ],
    correctAnswer: 'A'
  }
];
