DROP TABLE IF EXISTS characters;

CREATE TABLE characters (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL, 
  birthday TEXT NOT NULL,
  address TEXT NOT NULL,
  elligible TEXT NOT NULL,
  img TEXT NOT NULL,
  best_gifts TEXT []
);
