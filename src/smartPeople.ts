export interface Person {
  id: string;
  name: string;
  age: number;
  iq: number;
}

export const SMART_PEOPLE: readonly Person[] = [
  { id: "ada-lovelace", name: "Ada Lovelace", age: 36, iq: 170 },
  { id: "albert-einstein", name: "Albert Einstein", age: 76, iq: 160 },
  { id: "charles-darwin", name: "Charles Darwin", age: 73, iq: 165 },
  { id: "galileo-galilei", name: "Galileo Galilei", age: 77, iq: 180 },
  { id: "isaac-newton", name: "Isaac Newton", age: 84, iq: 190 },
  { id: "johann-goethe", name: "Johann Goethe", age: 82, iq: 210 },
  { id: "katherine-johnson", name: "Katherine Johnson", age: 101, iq: 170 },
  { id: "leonardo-da-vinci", name: "Leonardo da Vinci", age: 67, iq: 180 },
  { id: "marie-curie", name: "Marie Curie", age: 66, iq: 180 },
  { id: "nikola-tesla", name: "Nikola Tesla", age: 86, iq: 160 },
  { id: "rosalind-franklin", name: "Rosalind Franklin", age: 37, iq: 165 },
  { id: "stephen-hawking", name: "Stephen Hawking", age: 76, iq: 160 },
];
