CREATE DATABASE onatrack_interest;

-- Connect to the database

-- Create interest registrations table
CREATE TABLE IF NOT EXISTS interest_registrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    country VARCHAR(100) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notified BOOLEAN DEFAULT FALSE  
);

-- Create indexes for better performance
CREATE INDEX idx_email ON interest_registrations(email);
CREATE INDEX idx_registered_at ON interest_registrations(registered_at);

-- Optional: Create a table to log when you send notifications
CREATE TABLE IF NOT EXISTS notification_log (
    id SERIAL PRIMARY KEY,
    registration_id INT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email_subject VARCHAR(255),
    status VARCHAR(50),
    FOREIGN KEY (registration_id) REFERENCES interest_registrations(id) ON DELETE CASCADE
);


SELECT name, email, country, registered_at 
FROM interest_registrations 
WHERE notified = FALSE
ORDER BY registered_at DESC;