DROP TABLE IF EXISTS `recipe`;
CREATE TABLE `recipe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `summary` text NOT NULL,
  `instructions` text NOT NULL,
  `servings` int(11) NOT NULL,
  `imageurl` text,
  `videourl` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);


DROP TABLE IF EXISTS `recipe_tag`;
CREATE TABLE `recipe_tag` (
  `recipe_id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,

  PRIMARY KEY (`recipe_id`, `name`),
  FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`)
);


DROP TABLE IF EXISTS `ingredient`;
CREATE TABLE `ingredient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `unit`;
CREATE TABLE `unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `recipe_ingredient`;
CREATE TABLE `recipe_ingredient` (
  `recipe_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `unit_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`recipe_id`,`ingredient_id`,`unit_id`),
  FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`),
  FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient`(`id`),
  FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`)
);

