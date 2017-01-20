create database onetoone;
use onetoone;
CREATE TABLE `member` (         
  `id` mediumint(8) unsigned auto_increment,
  `nickname` varchar(20) DEFAULT '',
  `password` char(40) DEFAULT '',
  `phone` varchar(40) DEFAULT '',   
  `location` varchar(15) default '',
  `head` varchar(30) default '',
  `address` varchar(100) default '',
  `sex` char(1),
  `createAt` datetime default now(),
  `updateAt` datetime default now(),
  PRIMARY KEY  (`id`)
);

--专业类目表
CREATE TABLE `specialityCategory` (  
  `id` mediumint(8) unsigned auto_increment,
  `name` varchar(20) DEFAULT '',
  PRIMARY KEY  (`id`)
);
--专业表
CREATE TABLE `specialities` (  
  `id` mediumint(8) unsigned auto_increment,
  `categoryId` mediumint(8) unsigned,
  `name` varchar(20) DEFAULT '',
  PRIMARY KEY  (`id`)
);
--用户专业表
CREATE TABLE `memberSpeciality` (  
  `id` mediumint(8) unsigned auto_increment,
  `memberId` mediumint(8) unsigned,
  `specialitiesId` mediumint(8) unsigned,
  `brief` varchar(300) DEFAULT '',
  `works` varchar(300) default '',
  `experience` text ,
  PRIMARY KEY  (`id`)
);
--用户专业表
-- CREATE TABLE `works` (  
--   `id` mediumint(8) unsigned auto_increment,
--   `memberSpecialityId` mediumint(8) unsigned,
--   `imgUrl` varchar(80) default '',
--   `time` datetime default NOW(),
--   PRIMARY KEY  (`id`)
-- );
-- 私信
CREATE TABLE `message` (  
  `id` mediumint(8) unsigned auto_increment,
  `fromMember` mediumint(8) unsigned,
  `toMember` mediumint(8) unsigned,'',
  `active` char(1) default 0,
  `text` varchar(300) default '',
  `imgUrl` varchar(80) default '',
  `time` datetime default NOW(),
  PRIMARY KEY  (`id`)
);

insert into specialityCategory set name="运动";
insert into specialityCategory set name="健康";
insert into specialityCategory set name="理财/经济";
insert into specialityCategory set name="法律";
insert into specialityCategory set name="学习";
insert into specialityCategory set name="生活";

insert into specialities set name="健身教练",categoryId=1;
insert into specialities set name="游泳教练",categoryId=1;
insert into specialities set name="篮球教练",categoryId=1;
insert into specialities set name="羽毛球教练",categoryId=1;

insert into specialities set name="台球教练",categoryId=1;
insert into specialities set name="保龄球教练",categoryId=1;
insert into specialities set name="乒乓球教练",categoryId=1;
insert into specialities set name="营养师",categoryId=2;

insert into specialities set name="私人健康管理",categoryId=2;
insert into specialities set name="理财规划",categoryId=3;
insert into specialities set name="会计",categoryId=3;

insert into specialities set name="婚姻家庭",categoryId=4;
insert into specialities set name="刑事诉讼",categoryId=4;
insert into specialities set name="劳动纠纷",categoryId=4;
insert into specialities set name="交通事故",categoryId=4;
insert into specialities set name="合同纠纷",categoryId=4;
insert into specialities set name="房产纠纷",categoryId=4;
insert into specialities set name="公司法律",categoryId=4;
insert into specialities set name="医疗事故",categoryId=4;
insert into specialities set name="工程纠纷",categoryId=4;
insert into specialities set name="征地拆迁",categoryId=4;
insert into specialities set name="工程纠纷",categoryId=4;
insert into specialities set name="知识产权",categoryId=4;
insert into specialities set name="保险理赔",categoryId=4;

insert into specialities set name="英语家教",categoryId=5;
insert into specialities set name="日语家教",categoryId=5;
insert into specialities set name="法语家教",categoryId=5;
insert into specialities set name="西班牙语家教",categoryId=5;
insert into specialities set name="数学家教",categoryId=5;
insert into specialities set name="物理家教",categoryId=5;
insert into specialities set name="化学家教",categoryId=5;
