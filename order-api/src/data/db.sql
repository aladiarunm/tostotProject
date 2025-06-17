CREATE DATABASE  IF NOT EXISTS `orders_dev_db` DEFAULT CHARACTER SET utf8mb4 ;
USE `orders_dev_db`;

--
-- Table structure for table `int_user`
--
DROP TABLE IF EXISTS `int_user`;
CREATE TABLE `int_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(40) NOT NULL UNIQUE,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `email` varchar(40) NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL,
  `status` enum('A','I','D') NOT NULL DEFAULT 'A',
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `ext_buyer_company`
--
DROP TABLE IF EXISTS `ext_buyer_company`;
CREATE TABLE `ext_buyer_company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `type` varchar(100) NOT NULL,
  `website` varchar(250) NULL,
  `status` enum('A','I','D') NOT NULL DEFAULT 'I',
  `verification_flag` tinyint NOT NULL DEFAULT 0,
  `verified_by_id` int NOT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `buyer_company_verified_by_id` (`verified_by_id`),
  CONSTRAINT `buyer_company_verified_by_id` FOREIGN KEY (`verified_by_id`) REFERENCES `int_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `ext_buyer_company_address`
--
DROP TABLE IF EXISTS `ext_buyer_company_address`;
CREATE TABLE `ext_buyer_company_address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `phone1` varchar(30) NOT NULL,
  `phone2` varchar(30) NULL,
  `email` varchar(50) NULL,
  `address_line1` varchar(100) NULL,
  `address_line2` varchar(100) NULL,
  `state` varchar(100) NULL,
  `zipcode` varchar(20) NULL,
  `country` varchar(100) NOT NULL,
  `status` enum('A','I','D') NOT NULL DEFAULT 'A',
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `buyer_company_address_buyer_company_id` (`company_id`),
  CONSTRAINT `buyer_company_address_buyer_company_id` FOREIGN KEY (`company_id`) REFERENCES `ext_buyer_company` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `ext_buyer_contact`
--
DROP TABLE IF EXISTS `ext_buyer_contact`;
CREATE TABLE `ext_buyer_contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `username` varchar(40) NOT NULL UNIQUE,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `email` varchar(40) NULL,
  `password` varchar(255) NOT NULL,
  `company_name` varchar(250) NOT NULL,
  `role` enum('admin','user') NOT NULL,
  `status` enum('A','I','D') NOT NULL DEFAULT 'A',
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `buyer_contact_buyer_company_id` (`company_id`),
  CONSTRAINT `buyer_contact_buyer_company_id` FOREIGN KEY (`company_id`) REFERENCES `ext_buyer_company` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `ext_seller_company`
--
DROP TABLE IF EXISTS `ext_seller_company`;
CREATE TABLE `ext_seller_company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `type` varchar(100) NOT NULL,
  `website` varchar(250) NULL,
  `status` enum('A','I','D') NOT NULL DEFAULT 'I',
  `verification_flag` tinyint NOT NULL DEFAULT 0,
  `verified_by_id` int NOT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `seller_company_verified_by_id` (`verified_by_id`),
  CONSTRAINT `seller_company_verified_by_id` FOREIGN KEY (`verified_by_id`) REFERENCES `int_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `ext_seller_company_address`
--
DROP TABLE IF EXISTS `ext_seller_company_address`;
CREATE TABLE `ext_seller_company_address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `phone1` varchar(30) NOT NULL,
  `phone2` varchar(30) NULL,
  `email` varchar(50) NULL,
  `address_line1` varchar(100) NULL,
  `address_line2` varchar(100) NULL,
  `state` varchar(100) NULL,
  `zipcode` varchar(20) NULL,
  `country` varchar(100) NOT NULL,
  `status` enum('A','I','D') NOT NULL DEFAULT 'A',
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `seller_company_address_seller_company_id` (`company_id`),
  CONSTRAINT `seller_company_address_seller_company_id` FOREIGN KEY (`company_id`) REFERENCES `ext_seller_company` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `ext_seller_contact`
--
DROP TABLE IF EXISTS `ext_seller_contact`;
CREATE TABLE `ext_seller_contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `username` varchar(40) NOT NULL UNIQUE,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `email` varchar(40) NULL,
  `password` varchar(255) NOT NULL,
  `company_name` varchar(250) NOT NULL,
  `role` enum('admin','user') NOT NULL,
  `status` enum('A','I','D') NOT NULL DEFAULT 'A',
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `seller_contact_seller_company_id` (`company_id`),
  CONSTRAINT `seller_contact_seller_company_id` FOREIGN KEY (`company_id`) REFERENCES `ext_seller_company` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table ext_brand
--
DROP TABLE IF EXISTS ext_brand;
CREATE TABLE ext_brand (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL UNIQUE,
  description varchar(250) DEFAULT NULL,
  status enum('A','I','D') NOT NULL DEFAULT 'A',
  created_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table ext_category
--
DROP TABLE IF EXISTS ext_category;
CREATE TABLE ext_category (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL UNIQUE,
  description varchar(250) DEFAULT NULL,
  status enum('A','I','D') NOT NULL DEFAULT 'A',
  created_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table ext_sub_category
--
DROP TABLE IF EXISTS ext_sub_category;
CREATE TABLE ext_sub_category (
  id int NOT NULL AUTO_INCREMENT,
  category_id int NOT NULL,
  name varchar(50) NOT NULL UNIQUE,
  description varchar(250) DEFAULT NULL,
  status enum('A','I','D') NOT NULL DEFAULT 'A',
  created_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY sub_category_category_id (category_id),
  CONSTRAINT sub_category_category_id FOREIGN KEY (category_id) REFERENCES ext_category (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table ext_color
--
DROP TABLE IF EXISTS ext_color;
CREATE TABLE ext_color (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL UNIQUE,
  code varchar(40) NOT NULL UNIQUE,
  description varchar(250) DEFAULT NULL,
  status enum('A','I','D') NOT NULL DEFAULT 'A',
  created_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table ext_size
--
DROP TABLE IF EXISTS ext_size;
CREATE TABLE ext_size (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL UNIQUE,
  code varchar(40) NOT NULL UNIQUE,
  description varchar(250) DEFAULT NULL,
  status enum('A','I','D') NOT NULL DEFAULT 'A',
  created_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table ext_style
--
DROP TABLE IF EXISTS ext_style;
CREATE TABLE ext_style (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL UNIQUE,
  code varchar(40) NOT NULL UNIQUE,
  description varchar(250) DEFAULT NULL,
  status enum('A','I','D') NOT NULL DEFAULT 'A',
  created_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
