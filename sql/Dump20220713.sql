-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: lumen
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `role` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,'reignerlastimosa@gmail.com','123','Robert','Lastimosa','2000-09-26','1657453258314_andrei1.jpg','admin'),(2,'ellahchua@gmail.com','123','Ellah','Chua','2000-06-24',NULL,'student'),(3,'catherinebautista@gmail.com','123','Catherine','Bautista','2000-03-12',NULL,'student'),(6,'karlsolmiano@gmail.com','123','Karl','Solmiano','2000-06-18',NULL,'student'),(7,'jeromevelasquez@gmail.com','123','Jerome','Velasquez','2001-02-06',NULL,'student'),(8,'justinecerezo@gmail.com','123','Justin','Cerezo','2001-08-12',NULL,'student'),(9,'arthtibay@gmail.com','123','Arth','Tibay','2001-10-21',NULL,'student'),(10,'albertmaglines@gmail.com','123','Albert','Maglines','2002-06-23',NULL,'student'),(11,'stephaniechua@gmail.com','123','Stephanie','Chua','2001-02-14',NULL,'student');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement` (
  `announcement_id` int NOT NULL AUTO_INCREMENT,
  `class_id` varchar(50) DEFAULT NULL,
  `announcement_title` varchar(50) DEFAULT NULL,
  `announcement_body` varchar(200) DEFAULT NULL,
  `announcement_date` date DEFAULT NULL,
  `section` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`announcement_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement`
--

LOCK TABLES `announcement` WRITE;
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
INSERT INTO `announcement` VALUES (1,'STATS101','LONG QUIZ 1','Prepare for Long quiz 2. Coverage will be from Lesson 1: Basic Statistic to Lesson 2: Measure of Central Tendency','2022-06-29','3ISA'),(2,'STATS101','HOMEWORK #1','Please answer your homework #1 at page 34.','2022-06-29','3ISA');
/*!40000 ALTER TABLE `announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `class_id` varchar(50) DEFAULT NULL,
  `account_id` int DEFAULT NULL,
  `section` varchar(50) DEFAULT NULL,
  `grade` int DEFAULT NULL,
  `attendance` double DEFAULT NULL,
  KEY `account_id` (`account_id`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
INSERT INTO `class` VALUES ('ENGLISH101',2,'3ISA',90,88),('MATH101',2,'3ISA',85,90),('STATS101',2,'3ISA',89,91),('SCIENCE101',2,'3ISA',92,93),('ENGLISH101',3,'3ISA',90,91),('MATH101',3,'3ISA',91,92),('STATS101',3,'3ISA',89,90),('ENGLISH101',6,'3ISA',90,85),('MATH101',6,'3ISA',86,89),('STATS101',6,'3ISA',87,86),('SCIENCE101',6,'3ISA',90,91),('ENGLISH101',7,'3ISA',90,91),('MATH101',7,'3ISA',86,90),('STATS101',7,'3ISA',88,92),('SCIENCE101',7,'3ISA',90,91),('ENGLISH101',8,'3ISC',94,100),('MATH101',8,'3ISC',89,92),('STATS101',8,'3ISC',90,95),('SCIENCE101',8,'3ISC',95,98),('ENGLISH101',9,'3ISB',92,96),('MATH101',9,'3ISB',85,88),('STATS101',9,'3ISB',87,90),('SCIENCE101',9,'3ISB',93,96),('ENGLISH101',10,'3ISB',90,97),('MATH101',10,'3ISB',88,95),('STATS101',10,'3ISB',86,92),('SCIENCE101',10,'3ISB',91,98),('ENGLISH101',11,'3ISC',95,100),('MATH101',11,'3ISC',84,92),('STATS101',11,'3ISC',88,95),('SCIENCE101',11,'3ISC',96,100),('STATS101',1,'3ISA',NULL,NULL),('STATS101',1,'3ISB',NULL,NULL),('STATS101',1,'3ISC',NULL,NULL),('ENGLISH101',1,'3ISA',NULL,NULL);
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `lesson_id` int DEFAULT NULL,
  `lesson_name` varchar(50) DEFAULT NULL,
  `filename` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`file_id`),
  KEY `lesson_id` (`lesson_id`),
  CONSTRAINT `file_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`lesson_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` VALUES (1,1,NULL,'1657280330947_School Management System.pdf'),(2,1,NULL,'1657280423744_HELLO WORLD.docx'),(3,1,NULL,'1657280527284_HELLO WORLD.pdf');
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grades` (
  `account_id` int DEFAULT NULL,
  `activity_id` int NOT NULL AUTO_INCREMENT,
  `class_id` varchar(50) DEFAULT NULL,
  `section` varchar(50) DEFAULT NULL,
  `activity_name` varchar(50) DEFAULT NULL,
  `activity_grade` int DEFAULT NULL,
  PRIMARY KEY (`activity_id`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
INSERT INTO `grades` VALUES (2,1,'STATS101','3ISA','Homework #1',90),(2,2,'MATH101','3ISA','Assignment #1',95),(3,3,'STATS101','3ISA','Homework #1',93),(3,4,'MATH101','3ISA','Assignment #1',95),(3,5,'ENGLISH101','3ISA','Pecha Kucha',100),(6,7,'STATS101','3ISA','Homework #1',87);
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson`
--

DROP TABLE IF EXISTS `lesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson` (
  `lesson_id` int NOT NULL AUTO_INCREMENT,
  `class_id` varchar(50) DEFAULT NULL,
  `lesson_name` varchar(50) DEFAULT NULL,
  `lesson_description` varchar(50) DEFAULT NULL,
  `section` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`lesson_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson`
--

LOCK TABLES `lesson` WRITE;
/*!40000 ALTER TABLE `lesson` DISABLE KEYS */;
INSERT INTO `lesson` VALUES (1,'STATS101','INTORDUCTION TO STATISTICS','Understanding the basics of Statistics','3ISA'),(2,'STATS101','MEASURE OF CENTRAL TENDENCY','Recalling Mean, median and mode','3ISA');
/*!40000 ALTER TABLE `lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `schedule_id` int NOT NULL AUTO_INCREMENT,
  `class_id` varchar(50) DEFAULT NULL,
  `section` varchar(50) DEFAULT NULL,
  `schedule_name` varchar(50) DEFAULT NULL,
  `schedule_date` date DEFAULT NULL,
  PRIMARY KEY (`schedule_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,'MATH101','3ISC','LONG TEST 2','2022-07-05'),(2,'STATS101','3ISA','LONG TEST 1','2022-07-12'),(3,'ENGLISH101','3ISB','Homework 1','2022-07-11'),(6,'ENGLISH101','3ISC','Pecha Kucha','2022-07-14');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-13  8:19:21
