DROP TABLE IF EXISTS characters, seeds, artifacts, forageables;

CREATE TABLE characters (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
);

CREATE TABLE artifacts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  abt TEXT NOT NULL,
  sell_price TEXT NOT NULL,
  img TEXT NOT NULL    
);

INSERT INTO artifacts (name, abt, sell_price, img) VALUES (
  'Chipped Amphora',
  'An ancient vessel made of ceramic material. Used to transport both dry and wet goods.',
  '40g',
  'https://stardewvalleywiki.com/mediawiki/images/9/9e/Chipped_Amphora.png' 
);

CREATE TABLE forageables (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  abt TEXT NOT NULL,
  where_tofind TEXT [][],
  img TEXT NOT NULL    
);

INSERT INTO forageables (name, abt, where_tofind, img) VALUES (
  'Morel',
  'Sought after for its unique nutty flavor.',
  ARRAY ['{"Secret Woods", "32%"}', '{"Forest Farm", "25%"}'],
  'https://stardewvalleywiki.com/mediawiki/images/b/b1/Morel.png'
);

CREATE TABLE weapons (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,  
  level TEXT NOT NULL,  
  abt TEXT NOT NULL,  
  damage TEXT NOT NULL,
  img TEXT NOT NULL  
);

INSERT INTO weapons (type, name, level, abt, damage, img) VALUES (
  'Sword',
  'Rusty Sword',
  '1',
  'A rusty, dull old sword.',
  '2-5',
  'https://stardewvalleywiki.com/mediawiki/images/d/d7/Rusty_Sword.png'
);
