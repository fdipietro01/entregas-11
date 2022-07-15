import normalize from "normalizr";
import { print } from "./print.js";
const schema = normalize.schema;

const authorSchema = new schema.Entity("author", {}, { idAttribute: "email" });
const mensajeSchema = new schema.Entity("mensaje",{ author: authorSchema },
  { idAttribute: "_id" }
);
const mensajes = new schema.Entity("mensajes", {
  mensajes: [mensajeSchema],
});

export const normalizeChat = (data) => {
    console.log(data)
  console.log("se viene el normalizado");
  
  const messagesToNorm = {
    id: "mensajes",
    mensajes : data
  };


  print(normalize.normalize(messagesToNorm, mensajes));
  return normalize.normalize(messagesToNorm, mensajes);
};
