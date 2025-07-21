CREATE TABLE `team` (
  `teamNum` int NOT NULL AUTO_INCREMENT,
  `teamName` varchar(20) NOT NULL,
  `teamPw` varchar(225) NOT NULL,
  `teamAch` int NOT NULL,
  PRIMARY KEY (`teamNum`)
) ;
CREATE TABLE `user` (
  `userNum` int NOT NULL AUTO_INCREMENT,
  `userid` varchar(15) NOT NULL,
  `teamNum` int NOT NULL,
  `userAch` int NOT NULL,
  PRIMARY KEY (`userNum`),
  UNIQUE KEY `userid` (`userid`),
  KEY `fk_user_team` (`teamNum`),
  CONSTRAINT `user_ibfk_team` FOREIGN KEY (`teamNum`) REFERENCES `team` (`teamNum`)
) ;
CREATE TABLE `task` (
  `taskId` int NOT NULL AUTO_INCREMENT,
  `userNum` int NOT NULL,
  `do` varchar(255) NOT NULL,
  `done` tinyint(1) NOT NULL DEFAULT '0',
  `star` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`taskId`),
  KEY `fk_task_user` (`userNum`),
  CONSTRAINT `task_ibfk_user` FOREIGN KEY (`userNum`) REFERENCES `user` (`userNum`)
) ;
