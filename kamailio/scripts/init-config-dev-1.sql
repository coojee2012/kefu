/*
-- Query: SELECT * FROM kamailio.dispatcher
LIMIT 0, 1000

-- Date: 2016-11-10 11:09
*/
INSERT INTO `dispatcher` (`id`,`setid`,`destination`,`flags`,`priority`,`attrs`,`description`) VALUES (1,1,'sip:192.120.0.29:5090',0,0,'weight=50','FreeSWITCH-1');
INSERT INTO `dispatcher` (`id`,`setid`,`destination`,`flags`,`priority`,`attrs`,`description`) VALUES (2,2,'sip:192.120.0.29:5090',0,0,'','conference-server-1');


/*
-- Query: SELECT * FROM kamailio.dialplan
LIMIT 0, 1000

-- Date: 2016-11-10 11:05
*/
INSERT INTO `dialplan` (`id`,`dpid`,`pr`,`match_op`,`match_exp`,`match_len`,`subst_exp`,`repl_exp`,`attrs`) VALUES (1,1,10,1,'^00[1-9][0-9]+$',0,'^00(.*)$','\\1','');
INSERT INTO `dialplan` (`id`,`dpid`,`pr`,`match_op`,`match_exp`,`match_len`,`subst_exp`,`repl_exp`,`attrs`) VALUES (2,1,10,1,'^\\+[1-9][0-9]+$',0,'^\\+(.*)$','\\1','');
INSERT INTO `dialplan` (`id`,`dpid`,`pr`,`match_op`,`match_exp`,`match_len`,`subst_exp`,`repl_exp`,`attrs`) VALUES (3,1,10,1,'^0[1-9][0-9]+$',0,'^0(.*)$','86\\1','');
INSERT INTO `dialplan` (`id`,`dpid`,`pr`,`match_op`,`match_exp`,`match_len`,`subst_exp`,`repl_exp`,`attrs`) VALUES (4,1,10,1,'^[1-9][0-9]+$',0,'^(.*)$','86\\1','');


/*
-- Query: SELECT * FROM kamailio.address
LIMIT 0, 1000

-- Date: 2016-11-10 11:47
*/
INSERT INTO `address` (`id`,`grp`,`ip_addr`,`mask`,`port`,`tag`) VALUES (1,1,'192.120.0.29',32,5090,'udp');
INSERT INTO `address` (`id`,`grp`,`ip_addr`,`mask`,`port`,`tag`) VALUES (2,1,'192.120.0.29',32,5092,'udp');
INSERT INTO `address` (`id`,`grp`,`ip_addr`,`mask`,`port`,`tag`) VALUES (4,2,'139.196.18.218',32,5060,'udp');
INSERT INTO `address` (`id`,`grp`,`ip_addr`,`mask`,`port`,`tag`) VALUES (5,2,'139.196.18.218',32,5060,'tcp');
INSERT INTO `address` (`id`,`grp`,`ip_addr`,`mask`,`port`,`tag`) VALUES (6,3,'192.120.0.29',32,5092,'call-ctrl');

