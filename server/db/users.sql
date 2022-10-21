DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `googleId` varchar(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,

  `isadmin` tinyint(1) NOT NULL DEFAULT '0',

  `created_at` datetime NOT NULL,
  
  PRIMARY KEY (`googleId`)
);

DROP TABLE IF EXISTS `userlikes`;
CREATE TABLE `userlikes` (
  `googleId` varchar(11) NOT NULL,
  `recipeId` int(11) NOT NULL,

  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`googleId`) REFERENCES `users`(`googleId`),
  FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`)
  PRIMARY KEY (`googleId`, `recipeId`)
);


DROP TABLE IF EXISTS `cartItems`;
CREATE TABLE `cartItems` (
  `googleId` varchar(11) NOT NULL,
  `ingredientId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,

  FOREIGN KEY (`googleId`) REFERENCES `users`(`googleId`),
  FOREIGN KEY (`ingredientId`) REFERENCES `ingredients`(`id`),
  PRIMARY KEY (`googleId`, `ingredientId`)
);
