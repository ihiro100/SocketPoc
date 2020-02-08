CREATE TABLE `tab_post` (
  `id` int NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `post_image` varchar(50) NOT NULL,
  `post_description` text NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE `tab_post`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tab_post`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;


CREATE TABLE `tab_user` (
  `id` int NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `phone` varchar(13) NOT NULL,
  `gym_id` int DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(5) DEFAULT NULL,
  `height` double DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `password` varchar(20) NOT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `access_token` varchar(30) DEFAULT NULL
);

INSERT INTO `tab_user` (`id`, `first_name`, `last_name`, `phone`, `gym_id`, `date_of_birth`, `gender`, `height`, `weight`, `password`, `is_active`, `access_token`) VALUES
(1, 'himanshu', 'yyy', '+91987654321', 12, '1996-09-09', 'male', 160, 75,s '123456789', 1, '0g94odrq0w'),
(2, 'XXX', 'yyy', '+91987654345', 12, '1992-02-02', 'male', 150, 67, '123456789', 1, NULL),
(3, 'name1', 'passwordl', '+91987654312', 12, '1992-02-02', 'male', 150, 67, '123456789', 1, NULL),
(5, 'name1', 'passwordl', '+91988654321', 12, '1992-02-02', 'male', 150, 67, '123456789', 1, NULL),
(6, 'name1', 'passwordl', '+91986654321', NULL, '1992-02-02', 'male', 150, 67, '123456789', NULL, NULL),
(12, 'name1', 'passwordl', '+919862654921', NULL, '1992-02-02', 'male', 150, 67, '123456789', NULL, NULL);

ALTER TABLE `tab_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uc_phone` (`phone`);

ALTER TABLE `tab_user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;


select * from tab_user;

CREATE TABLE `tab_likes`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `post_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `createtion_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY(`id`)
    ) ENGINE = InnoDB;

CREATE TABLE `tab_comments`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `post_id` INT NOT NULL,
    `user_id` INT NOT NULL, 
    `gender` varchar(10000) NOT NULL,
    `createtion_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY(`id`)
    ) ENGINE = InnoDB;