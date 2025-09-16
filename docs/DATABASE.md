# Database Schema Documentation

## Overview
The application uses Azure SQL Database as the primary data store with four main tables managing match information, player votes, scores, and push notification subscriptions.

## Database Configuration

### Connection Details
- **Server:** `iplserver.database.windows.net`
- **Database:** `backenddb_Copy`
- **Authentication:** SQL Server Authentication
- **Connection Timeout:** 30 seconds
- **Encryption:** SSL enabled

### Connection Configuration
```javascript
// In app.js
var config = {
    server: 'iplserver.database.windows.net',
    authentication: {
        type: 'default',
        options: {
            userName: 'myadmin',
            password: 'A@12345678'
        }
    },
    options: {
        database: 'backenddb_Copy',
        connectionTimeout: 30000,
        encrypt: true,
        trustServerCertificate: false
    }
}
```

## Table Schemas

### 1. matches Table
**Purpose:** Stores IPL match information and scheduling

```sql
CREATE TABLE matches (
    matchID INT IDENTITY(1,1) PRIMARY KEY,
    team1 NVARCHAR(50) NOT NULL,
    team2 NVARCHAR(50) NOT NULL,
    Mdate DATE NOT NULL,
    winner NVARCHAR(50) NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
```

**Column Descriptions:**
- `matchID`: Auto-incrementing primary key
- `team1`: First team name (e.g., "Gujarat Titans")
- `team2`: Second team name (e.g., "Delhi Capitals")  
- `Mdate`: Match date
- `winner`: Winning team name (populated after match completion)
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Sample Data:**
```sql
INSERT INTO matches (team1, team2, Mdate) VALUES
('Gujarat Titans', 'Delhi Capitals', '2024-04-15'),
('Mumbai Indians', 'Chennai Super Kings', '2024-04-16'),
('Royal Challengers Bangalore', 'Kolkata Knight Riders', '2024-04-17');
```

**Indexes:**
```sql
CREATE INDEX IX_matches_date ON matches(Mdate);
CREATE INDEX IX_matches_teams ON matches(team1, team2);
CREATE INDEX IX_matches_winner ON matches(winner);
```

### 2. iplTest Table
**Purpose:** Stores player votes and cumulative scores

```sql
CREATE TABLE iplTest (
    id INT IDENTITY(1,1) PRIMARY KEY,
    player NVARCHAR(100) NOT NULL,
    score DECIMAL(10,2) DEFAULT 0,
    vote NVARCHAR(50) NULL,
    matchID INT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (matchID) REFERENCES matches(matchID)
);
```

**Column Descriptions:**
- `id`: Auto-incrementing primary key
- `player`: Player/user name who cast the vote
- `score`: Cumulative score across all matches
- `vote`: Current vote (team name for active match)
- `matchID`: Reference to current active match
- `created_at`: Record creation timestamp
- `updated_at`: Last score update timestamp

**Sample Data:**
```sql
INSERT INTO iplTest (player, score, vote, matchID) VALUES
('John Doe', 25.5, 'Gujarat Titans', 1),
('Jane Smith', 30.0, 'Delhi Capitals', 1),
('Bob Wilson', 15.5, 'Gujarat Titans', 1);
```

**Indexes:**
```sql
CREATE INDEX IX_iplTest_player ON iplTest(player);
CREATE INDEX IX_iplTest_matchID ON iplTest(matchID);
CREATE INDEX IX_iplTest_score ON iplTest(score DESC);
CREATE INDEX IX_iplTest_vote ON iplTest(vote);
```

### 3. matchscore Table  
**Purpose:** Stores individual match results and points awarded

```sql
CREATE TABLE matchscore (
    id INT IDENTITY(1,1) PRIMARY KEY,
    matchID INT NOT NULL,
    player NVARCHAR(100) NOT NULL,
    score DECIMAL(10,2) NOT NULL,
    team NVARCHAR(50) NOT NULL,
    is_winner TINYINT DEFAULT 0,
    points_awarded DECIMAL(10,2) DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (matchID) REFERENCES matches(matchID)
);
```

**Column Descriptions:**
- `id`: Auto-incrementing primary key
- `matchID`: Reference to specific match
- `player`: Player name who voted
- `score`: Points earned for this specific match
- `team`: Team the player voted for
- `is_winner`: Flag indicating if voted team won (1) or lost (0)
- `points_awarded`: Points calculation (win=15.5, lose=0)
- `created_at`: Record creation timestamp

**Sample Data:**
```sql
INSERT INTO matchscore (matchID, player, score, team, is_winner, points_awarded) VALUES
(1, 'John Doe', 15.5, 'Gujarat Titans', 1, 15.5),
(1, 'Jane Smith', 0, 'Delhi Capitals', 0, 0),
(1, 'Bob Wilson', 15.5, 'Gujarat Titans', 1, 15.5);
```

**Indexes:**
```sql
CREATE INDEX IX_matchscore_matchID ON matchscore(matchID);
CREATE INDEX IX_matchscore_player ON matchscore(player);
CREATE INDEX IX_matchscore_team ON matchscore(team);
CREATE INDEX IX_matchscore_is_winner ON matchscore(is_winner);
```

### 4. subscriptions Table
**Purpose:** Stores push notification subscription details

```sql
CREATE TABLE subscriptions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    endpoint NVARCHAR(MAX) NOT NULL,
    auth NVARCHAR(255) NOT NULL,
    p256dh NVARCHAR(255) NOT NULL,
    user_agent NVARCHAR(500) NULL,
    ip_address NVARCHAR(45) NULL,
    is_active TINYINT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    last_notification_sent DATETIME2 NULL
);
```

**Column Descriptions:**
- `id`: Auto-incrementing primary key
- `endpoint`: Push service endpoint URL
- `auth`: Authentication key for push notifications
- `p256dh`: Public key for message encryption
- `user_agent`: Browser/device information
- `ip_address`: Client IP address
- `is_active`: Subscription status (1=active, 0=inactive)
- `created_at`: Subscription creation timestamp
- `last_notification_sent`: Last notification timestamp

**Sample Data:**
```sql
INSERT INTO subscriptions (endpoint, auth, p256dh, user_agent) VALUES
('https://fcm.googleapis.com/fcm/send/abc123', 'auth-key-123', 'p256dh-key-123', 'Mozilla/5.0...');
```

**Indexes:**
```sql
CREATE INDEX IX_subscriptions_active ON subscriptions(is_active);
CREATE INDEX IX_subscriptions_endpoint ON subscriptions(endpoint(100));
CREATE INDEX IX_subscriptions_created ON subscriptions(created_at);
```

## Database Operations

### Common Queries

#### Get Current Match
```sql
SELECT TOP 1 matchID, team1, team2, Mdate, winner
FROM matches 
WHERE winner IS NULL 
ORDER BY Mdate ASC;
```

#### Get Vote Entries for Current Match
```sql
SELECT player AS name, vote AS team, score
FROM iplTest 
WHERE matchID = (
    SELECT TOP 1 matchID 
    FROM matches 
    WHERE winner IS NULL 
    ORDER BY Mdate ASC
)
ORDER BY score DESC;
```

#### Submit New Vote
```sql
-- Check if player already exists
IF EXISTS (SELECT 1 FROM iplTest WHERE player = @playerName)
BEGIN
    -- Update existing vote
    UPDATE iplTest 
    SET vote = @teamName, 
        matchID = @matchID,
        updated_at = GETDATE()
    WHERE player = @playerName;
END
ELSE
BEGIN
    -- Insert new vote
    INSERT INTO iplTest (player, vote, matchID, score) 
    VALUES (@playerName, @teamName, @matchID, 0);
END
```

#### Calculate Match Results
```sql
-- When match ends, calculate scores
DECLARE @winningTeam NVARCHAR(50) = 'Gujarat Titans';
DECLARE @matchID INT = 1;

-- Insert match scores
INSERT INTO matchscore (matchID, player, score, team, is_winner, points_awarded)
SELECT 
    @matchID,
    player,
    CASE 
        WHEN vote = @winningTeam THEN 15.5 
        ELSE 0 
    END AS score,
    vote,
    CASE 
        WHEN vote = @winningTeam THEN 1 
        ELSE 0 
    END AS is_winner,
    CASE 
        WHEN vote = @winningTeam THEN 15.5 
        ELSE 0 
    END AS points_awarded
FROM iplTest 
WHERE matchID = @matchID;

-- Update cumulative scores
UPDATE i SET 
    score = i.score + m.score
FROM iplTest i
INNER JOIN matchscore m ON i.player = m.player
WHERE m.matchID = @matchID;

-- Update match winner
UPDATE matches 
SET winner = @winningTeam, updated_at = GETDATE()
WHERE matchID = @matchID;
```

### Stored Procedures

#### SP_SubmitMatchResult
```sql
CREATE PROCEDURE SP_SubmitMatchResult
    @MatchID INT,
    @WinningTeam NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Insert individual match scores
        INSERT INTO matchscore (matchID, player, score, team, is_winner, points_awarded)
        SELECT 
            @MatchID,
            player,
            CASE WHEN vote = @WinningTeam THEN 15.5 ELSE 0 END,
            vote,
            CASE WHEN vote = @WinningTeam THEN 1 ELSE 0 END,
            CASE WHEN vote = @WinningTeam THEN 15.5 ELSE 0 END
        FROM iplTest 
        WHERE matchID = @MatchID;
        
        -- Update cumulative scores
        UPDATE i SET score = i.score + m.score
        FROM iplTest i
        INNER JOIN matchscore m ON i.player = m.player
        WHERE m.matchID = @MatchID;
        
        -- Mark match as completed
        UPDATE matches 
        SET winner = @WinningTeam, updated_at = GETDATE()
        WHERE matchID = @MatchID;
        
        COMMIT TRANSACTION;
        
        SELECT 'SUCCESS' AS Result, 'Match result submitted successfully' AS Message;
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        
        SELECT 'ERROR' AS Result, ERROR_MESSAGE() AS Message;
    END CATCH
END
```

#### SP_GetLeaderboard
```sql
CREATE PROCEDURE SP_GetLeaderboard
    @TopN INT = 10
AS
BEGIN
    SELECT TOP (@TopN)
        player,
        score,
        vote AS current_vote,
        (SELECT COUNT(*) FROM matchscore WHERE player = i.player AND is_winner = 1) AS matches_won,
        (SELECT COUNT(*) FROM matchscore WHERE player = i.player) AS total_matches
    FROM iplTest i
    ORDER BY score DESC, player ASC;
END
```

## Database Maintenance

### Backup Strategy
```sql
-- Full backup (daily)
BACKUP DATABASE backenddb_Copy 
TO URL = 'https://storage.blob.core.windows.net/backups/backenddb_Copy_full.bak';

-- Differential backup (hourly during match days)  
BACKUP DATABASE backenddb_Copy 
TO URL = 'https://storage.blob.core.windows.net/backups/backenddb_Copy_diff.bak'
WITH DIFFERENTIAL;
```

### Performance Monitoring
```sql
-- Check index usage
SELECT 
    i.name AS index_name,
    s.user_seeks,
    s.user_scans,
    s.user_lookups,
    s.user_updates
FROM sys.dm_db_index_usage_stats s
INNER JOIN sys.indexes i ON s.object_id = i.object_id AND s.index_id = i.index_id
WHERE s.database_id = DB_ID('backenddb_Copy');

-- Check query performance
SELECT TOP 10
    qs.execution_count,
    qs.total_elapsed_time / qs.execution_count AS avg_elapsed_time,
    qt.text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
ORDER BY avg_elapsed_time DESC;
```

### Data Cleanup
```sql
-- Archive old match data (older than 1 year)
CREATE TABLE matches_archive AS 
SELECT * FROM matches 
WHERE Mdate < DATEADD(YEAR, -1, GETDATE());

-- Clean up old subscriptions (inactive for 30 days)
DELETE FROM subscriptions 
WHERE is_active = 0 
AND created_at < DATEADD(DAY, -30, GETDATE());

-- Update statistics
UPDATE STATISTICS matches;
UPDATE STATISTICS iplTest;
UPDATE STATISTICS matchscore;
UPDATE STATISTICS subscriptions;
```

## Data Migration Scripts

### Initial Setup
```sql
-- Create database
CREATE DATABASE backenddb_Copy;
USE backenddb_Copy;

-- Create tables in dependency order
-- 1. matches (no dependencies)
CREATE TABLE matches (...);

-- 2. iplTest (depends on matches)
CREATE TABLE iplTest (...);

-- 3. matchscore (depends on matches)  
CREATE TABLE matchscore (...);

-- 4. subscriptions (independent)
CREATE TABLE subscriptions (...);

-- Create indexes
CREATE INDEX IX_matches_date ON matches(Mdate);
-- ... other indexes

-- Insert initial data
INSERT INTO matches (team1, team2, Mdate) VALUES
('Gujarat Titans', 'Delhi Capitals', GETDATE());
```

### Version Updates
```sql
-- V1.1 - Add winner timestamp
ALTER TABLE matches 
ADD winner_declared_at DATETIME2 NULL;

-- V1.2 - Add subscription metadata
ALTER TABLE subscriptions 
ADD user_agent NVARCHAR(500) NULL,
ADD ip_address NVARCHAR(45) NULL;

-- V1.3 - Add match score details
ALTER TABLE matchscore 
ADD is_winner TINYINT DEFAULT 0,
ADD points_awarded DECIMAL(10,2) DEFAULT 0;
```

## Security Considerations

### Access Control
```sql
-- Create application user with limited permissions
CREATE LOGIN ipl_app_user WITH PASSWORD = 'SecurePassword123!';
CREATE USER ipl_app_user FOR LOGIN ipl_app_user;

-- Grant specific permissions
GRANT SELECT, INSERT, UPDATE ON matches TO ipl_app_user;
GRANT SELECT, INSERT, UPDATE ON iplTest TO ipl_app_user;
GRANT SELECT, INSERT, UPDATE ON matchscore TO ipl_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON subscriptions TO ipl_app_user;

-- Deny dangerous permissions
DENY DELETE ON matches TO ipl_app_user;
DENY DELETE ON iplTest TO ipl_app_user;
DENY DELETE ON matchscore TO ipl_app_user;
```

### Data Encryption
- **Transparent Data Encryption (TDE)** enabled
- **Always Encrypted** for sensitive columns
- **SSL/TLS** for connections

### Audit Trail
```sql
-- Enable SQL Server Audit
CREATE SERVER AUDIT IPL_Audit
TO URL = 'https://storage.blob.core.windows.net/audit-logs/';

-- Create database audit specification
CREATE DATABASE AUDIT SPECIFICATION IPL_Database_Audit
FOR SERVER AUDIT IPL_Audit
ADD (SELECT, INSERT, UPDATE, DELETE ON dbo.iplTest BY public),
ADD (INSERT, UPDATE ON dbo.matches BY public);
```

## Troubleshooting

### Common Issues

#### Connection Timeouts
```sql
-- Check active connections
SELECT 
    session_id,
    login_time,
    status,
    database_id,
    DB_NAME(database_id) AS database_name
FROM sys.dm_exec_sessions
WHERE is_user_process = 1;
```

#### Deadlocks
```sql
-- Monitor deadlocks
SELECT 
    dt.session_id,
    dt.request_id,
    dt.blocking_session_id,
    dt.wait_type,
    dt.resource_description
FROM sys.dm_exec_requests dt
WHERE dt.blocking_session_id <> 0;
```

#### Performance Issues
```sql
-- Find slow queries
SELECT TOP 5
    qs.execution_count,
    qs.total_elapsed_time,
    qs.total_elapsed_time / qs.execution_count AS avg_time,
    qt.text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
ORDER BY avg_time DESC;
```

## Best Practices

### Query Optimization
1. Use parameterized queries to prevent SQL injection
2. Create appropriate indexes for frequently queried columns
3. Limit result sets with TOP clause
4. Use stored procedures for complex operations

### Data Integrity
1. Implement foreign key constraints
2. Use transactions for multi-table operations
3. Add check constraints for data validation
4. Regular backup and recovery testing

### Monitoring and Maintenance
1. Monitor query performance regularly
2. Update statistics weekly
3. Rebuild/reorganize indexes monthly
4. Archive old data to maintain performance