-- Create the database
IF DB_ID('FriendlyFoodsDB') IS NULL
    CREATE DATABASE FriendlyFoodsDB;
GO

USE FriendlyFoodsDB;
GO

-- Create Visitors table
CREATE TABLE Visitors (
    VisitorID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL UNIQUE
);
GO

-- Create CheckIns table
CREATE TABLE CheckIns (
    CheckInID INT IDENTITY(1,1) PRIMARY KEY,
    VisitorID INT NOT NULL,
    CheckInTime DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (VisitorID) REFERENCES Visitors(VisitorID)
);
GO
-- Create a Users table for admin accounts
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'Admin'
);

-- Insert an administrator user (note: hash passwords in the application, not here)
INSERT INTO Users (Username, PasswordHash, Role)
VALUES (
    'admin',
    'Admin_Password', -- This should be a hashed password in production
    'Administrator'
);

-- Insert test users
INSERT INTO Visitors (FullName, PhoneNumber)
VALUES 
    ('Test One', '3035551234'),
    ('Test Two', '7205554567'),
    ('Test Three', '3035557890');
GO
