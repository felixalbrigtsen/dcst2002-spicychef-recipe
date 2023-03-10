DROP TABLE IF EXISTS `user_like`;
DROP TABLE IF EXISTS `list_ingredient`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `googleId` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `picture` varchar(255) NOT NULL,

  `isadmin` tinyint(1) NOT NULL DEFAULT '0',

  PRIMARY KEY (`googleId`)
);

CREATE TABLE `user_like` (
  `googleId` varchar(64) NOT NULL,
  `recipeId` int(11) NOT NULL,

  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`googleId`) REFERENCES `user`(`googleId`) ON DELETE CASCADE,
  FOREIGN KEY (`recipeId`) REFERENCES `recipe`(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`googleId`, `recipeId`)
);


CREATE TABLE `list_ingredient` (
  `googleId` varchar(64) NOT NULL,
  `ingredientId` int(11) NOT NULL,
  /* `comment` varchar(30) NOT NULL, */

  FOREIGN KEY (`googleId`) REFERENCES `user`(`googleId`) ON DELETE CASCADE,
  FOREIGN KEY (`ingredientId`) REFERENCES `ingredient`(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`googleId`, `ingredientId`)
);
