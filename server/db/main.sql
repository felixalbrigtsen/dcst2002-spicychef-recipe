DROP TABLE IF EXISTS `recipe_tag`;
DROP TABLE IF EXISTS `recipe_ingredient`;
DROP TABLE IF EXISTS `recipe`;
DROP TABLE IF EXISTS `unit`;
DROP TABLE IF EXISTS `ingredient`;
CREATE TABLE `recipe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `summary` text NOT NULL,
  `instructions` text NOT NULL,
  `servings` int(11) NOT NULL,
  `imageUrl` text,
  `videoUrl` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);


CREATE TABLE `recipe_tag` (
  `recipeId` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,

  PRIMARY KEY (`recipeId`, `name`),
  FOREIGN KEY (`recipeId`) REFERENCES `recipe` (`id`)
);


CREATE TABLE `ingredient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `recipe_ingredient` (
  `recipeId` int(11) NOT NULL,
  `ingredientId` int(11) NOT NULL,
  `unitId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`recipeId`,`ingredientId`,`unitId`),
  FOREIGN KEY (`recipeId`) REFERENCES `recipe`(`id`),
  FOREIGN KEY (`ingredientId`) REFERENCES `ingredient`(`id`),
  FOREIGN KEY (`unitId`) REFERENCES `unit`(`id`)
);

