DROP TABLE IF EXISTS characters;
DROP TABLE IF EXISTS seeds;

CREATE TABLE characters (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL, 
  birthday TEXT NOT NULL,
  address TEXT NOT NULL,
  elligible TEXT NOT NULL,
  img TEXT NOT NULL,
  best_gifts TEXT [],
  about TEXT NOT NULL
);

INSERT INTO characters (name, birthday, address, elligible, img, best_gifts, about) VALUES (
  'Krobus',
  'Winter 1',
  'Krobus" shop',
  'false',
  'https://stardewvalleywiki.com/mediawiki/images/7/71/Krobus.png',
  ARRAY ['Diamond', 'Iridium Bar', 'Pumpkin', 'Void Egg', 'Void Mayonnaise', 'Wild Horseradish' ],
  'Krobus is the only friendly monster players will encounter, however he still refers to other hostile monsters as his friends. He is a shadow person who lives in the sewers. He sells a variety of rare goods. He is also available as a roommate.' 
);

CREATE TABLE seeds (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  crop TEXT NOT NULL,
  abt TEXT NOT NULL,
  sell_price TEXT NOT NULL,
  img TEXT NOT NULL    
);

INSERT INTO seeds (name, crop, abt, sell_price, img) VALUES (
  'Melon Seeds',
  'Melon',
  'Plant these in the summer. Takes 12 days to mature.',
  '40g',
  'https://stardewvalleywiki.com/mediawiki/images/5/5e/Melon_Seeds.png' 
)
