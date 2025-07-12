DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS team;

-- ✅ 먼저 team
CREATE TABLE `team` (
  `teamNum` int NOT NULL AUTO_INCREMENT,
  `teamName` varchar(20) NOT NULL,
  `teamPw` varchar(225) NOT NULL,
  `teamAch` int NOT NULL,
  PRIMARY KEY (`teamNum`),
  UNIQUE KEY `teamPw` (`teamPw`)
) ;

-- ✅ 그 다음 user (team을 참조하니까 team 먼저!)
CREATE TABLE `user` (
  `userNum` int NOT NULL AUTO_INCREMENT,
  `userid` varchar(15) NOT NULL,
  `teamNum` int NOT NULL,
  `teamPw` varchar(225) NOT NULL,
  `userAch` int NOT NULL,
  PRIMARY KEY (`userNum`),
  KEY `teamNum` (`teamNum`),
  KEY `teamPw` (`teamPw`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`teamNum`) REFERENCES `team` (`teamNum`),
  CONSTRAINT `user_ibfk_2` FOREIGN KEY (`teamPw`) REFERENCES `team` (`teamPw`)
) ;

-- ✅ 마지막에 task (user를 참조하니까 user 다음에!)
CREATE TABLE `task` (
  `taskId` int NOT NULL AUTO_INCREMENT,
  `userNum` int NOT NULL,
  `do` varchar(255) NOT NULL,
  `done` tinyint DEFAULT '0',
  `import` tinyint DEFAULT '0',
  PRIMARY KEY (`taskId`),
  KEY `userNum` (`userNum`),
  CONSTRAINT `task_ibfk_1` FOREIGN KEY (`userNum`) REFERENCES `user` (`userNum`)
) ;

