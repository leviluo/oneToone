create database onetoone;
use onetoone;
CREATE TABLE `member` (         
  `id` mediumint(8) unsigned auto_increment,
  `nickname` varchar(20) DEFAULT '',
  `password` char(40) DEFAULT '',
  `phone` varchar(40) DEFAULT '',   
  `location` varchar(15) default '',
  `createAt` datetime default now(),
  `updateAt` datetime default now(),
  PRIMARY KEY  (`id`)
);
//专业表
CREATE TABLE `specialities` (  
  `id` mediumint(8) unsigned auto_increment,
  `name` varchar(20) DEFAULT '',
  PRIMARY KEY  (`id`)
);
//用户专业表
CREATE TABLE `memberSpeciality` (  
  `id` mediumint(8) unsigned auto_increment,
  `memberId` mediumint(8) unsigned,
  `brief` varchar(300) DEFAULT '',
  `experience` text DEFAULT '',
  PRIMARY KEY  (`id`)
);
//用户服务关系表
CREATE TABLE `memberToMember` (  
  `id` mediumint(8) unsigned auto_increment,
  `hostId` mediumint(8) unsigned,
  `memberId` mediumint(8) unsigned,
  PRIMARY KEY  (`id`)
);
