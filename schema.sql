DROP DATABASE IF EXISTS top_songsDB;

CREATE DATABASE top_songsdb;

USE top_songsdb;

CREATE TABLE Top5000(
  position INT NOT NULL,
  artist VARCHAR(150) NOT NULL,
  song VARCHAR(150) NOT NULL,
  year INT NULL,
  raw_total DECIMAL(10,4) NULL,
  raw_usa DECIMAL(10,4) NULL,
  raw_uk DECIMAL(10,4) NULL,
  raw_eur DECIMAL(10,4) NULL,
  raw_row DECIMAL(10,4) NULL,
  PRIMARY KEY (position)
);
  
  select * from top5000;