DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `googleid` varchar(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,

  `isadmin` tinyint(1) NOT NULL DEFAULT '0',

  `created_at` datetime NOT NULL,
  
  PRIMARY KEY (`googleid`)
);

DROP TABLE IF EXISTS `userlikes`;
CREATE TABLE `userlikes` (
  `googleid` varchar(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,

  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`googleid`) REFERENCES `users`(`googleid`),
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`)
  PRIMARY KEY (`googleid`, `recipe_id`)
);


DROP TABLE IF EXISTS `cartItems`;
CREATE TABLE `cartItems` (
  `googleid` varchar(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,

  FOREIGN KEY (`googleid`) REFERENCES `users`(`googleid`),
  FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`)
  PRIMARY KEY (`googleid`, `ingredient_id`)
);
