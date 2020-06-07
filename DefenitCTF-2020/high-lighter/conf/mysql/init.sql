use highlighter;

create table users (id int not null auto_increment, username varchar(16), password varchar(64), PRIMARY KEY (id));
create table board (id int not null auto_increment, user_id int not null, content text, PRIMARY KEY (id));

