CREATE TABLE `task` (
  `taskId` int NOT NULL AUTO_INCREMENT,
  `userNum` int NOT NULL,
  `do` varchar(255) NOT NULL,
  `done` tinyint(1) DEFAULT '0',
  `import` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`taskId`),
  KEY `userNum` (`userNum`),
  CONSTRAINT `task_ibfk_1` FOREIGN KEY (`userNum`) REFERENCES `user` (`userNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `team` (
  `teamNum` int NOT NULL AUTO_INCREMENT,
  `teamName` varchar(20) NOT NULL,
  `teamPw` varchar(225) NOT NULL,
  `teamAch` int NOT NULL,
  PRIMARY KEY (`teamNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `user` (
  `userNum` int NOT NULL AUTO_INCREMENT,
  `userid` varchar(15) NOT NULL,
  `teamNum` int NOT NULL,
  `userAch` int NOT NULL,
  PRIMARY KEY (`userNum`),
  KEY `teamNum` (`teamNum`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`teamNum`) REFERENCES `team` (`teamNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
