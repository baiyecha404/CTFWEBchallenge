DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `username` TEXT NOT NULL,
  `password` TEXT NOT NULL
);

DROP TABLE IF EXISTS `xsecret`;
CREATE TABLE `xsecret` (
  `definitely_not_a_secret` TEXT NOT NULL
);
INSERT INTO `xsecret` VALUES ('hidden-route{d424054dbc38c73ca9f81ad711b5588c}');