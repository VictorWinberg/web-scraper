CREATE TABLE users (
  id                SERIAL        NOT NULL,
  name              VARCHAR(50)   NOT NULL,
  city              VARCHAR(50)   NOT NULL,
  country           VARCHAR(50)   NOT NULL,
  imageFullUrl      VARCHAR(255),
  imagePortraitUrl  VARCHAR(255),
  text              VARCHAR(500),

  created_at TIMESTAMP DEFAULT NOW(),

  PRIMARY KEY (id)
);