# Coding Standards & Best Practices

## 📝 Code Style Guidelines

This document outlines the coding standards, conventions, and best practices for maintaining high-quality, consistent code across the IPL Play-Along application.

## 🎯 General Principles

### Code Quality Standards
- **Readability First** - Write code that tells a story
- **Consistency** - Follow established patterns throughout the codebase
- **Simplicity** - Favor simple solutions over complex ones
- **Maintainability** - Write code that's easy to modify and extend
- **Performance** - Consider performance implications of code decisions
- **Security** - Always think about security implications

### Documentation Philosophy
- Code should be self-documenting through clear naming
- Comments should explain "why," not "what"
- Public APIs must have comprehensive JSDoc comments
- Complex algorithms require detailed explanations

## 🌐 JavaScript/React Standards

### Naming Conventions

```javascript
// Variables and Functions - camelCase
const userName = 'john_doe';
const fetchUserData = async () => { /* ... */ };

// Constants - SCREAMING_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

// Components - PascalCase
const UserProfileComponent = () => { /* ... */ };
const MatchScoreDisplay = () => { /* ... */ };

// Files and Directories - kebab-case
// user-profile.component.js
// match-score-display/
//   ├── index.js
//   └── match-score-display.module.css

// Private methods - prefix with underscore
class ApiClient {
    _validateToken() { /* ... */ }
    _handleError(error) { /* ... */ }
}
```

### React Component Structure

```javascript
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './ComponentName.module.css';

/**
 * ComponentName - Brief description of component purpose
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display
 * @param {Function} props.onAction - Callback for user actions
 * @returns {JSX.Element} Rendered component
 */
const ComponentName = ({ title, onAction, children }) => {
    // 1. State declarations
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    // 2. Effect hooks
    useEffect(() => {
        // Effect logic here
        return () => {
            // Cleanup logic here
        };
    }, []);

    // 3. Event handlers and callbacks
    const handleAction = useCallback((event) => {
        event.preventDefault();
        
        try {
            setIsLoading(true);
            setError(null);
            
            // Handler logic
            onAction?.(event.target.value);
            
        } catch (err) {
            setError(err.message);
            console.error('Action failed:', err);
        } finally {
            setIsLoading(false);
        }
    }, [onAction]);

    // 4. Helper functions
    const formatTitle = (title) => {
        return title?.trim().toUpperCase() || 'DEFAULT TITLE';
    };

    // 5. Early returns for loading/error states
    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
            </div>
        );
    }

    // 6. Main render
    return (
        <div className="component-container">
            <h1 className="component-title">{formatTitle(title)}</h1>
            
            {isLoading ? (
                <div className="loading-spinner" aria-label="Loading..." />
            ) : (
                <div className="component-content">
                    {children}
                    <button 
                        onClick={handleAction}
                        disabled={isLoading}
                        className="action-button"
                    >
                        {isLoading ? 'Processing...' : 'Take Action'}
                    </button>
                </div>
            )}
        </div>
    );
};

// 7. PropTypes validation
ComponentName.propTypes = {
    title: PropTypes.string.isRequired,
    onAction: PropTypes.func,
    children: PropTypes.node
};

// 8. Default props
ComponentName.defaultProps = {
    onAction: () => {},
    children: null
};

export default ComponentName;
```

### Hook Usage Patterns

```javascript
// Custom hook example
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing API calls
 * @param {string} url - API endpoint URL
 * @returns {Object} Hook state and methods
 */
export const useApiCall = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!url) return;

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            setData(result);
            
        } catch (err) {
            setError(err);
            console.error('API call failed:', err);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
};

// Usage in component
const MyComponent = () => {
    const { data, loading, error, refetch } = useApiCall('/api/matches');
    
    // Component logic here...
};
```

## 🔧 Node.js/Express Standards

### API Route Structure

```javascript
// routes/matches.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');
const { MatchService } = require('../services/MatchService');
const { logger } = require('../utils/logger');

const router = express.Router();

// Rate limiting
const matchesRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
});

/**
 * GET /api/matches
 * Retrieve paginated list of matches
 */
router.get('/', 
    matchesRateLimit,
    [
        // Validation middleware
        query('page').optional().isInt({ min: 1 }).toInt(),
        query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
        query('status').optional().isIn(['scheduled', 'live', 'completed'])
    ],
    async (req, res) => {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: 'Validation failed',
                    details: errors.array() 
                });
            }

            // Extract parameters with defaults
            const { 
                page = 1, 
                limit = 20, 
                status = null 
            } = req.query;

            // Business logic
            const matches = await MatchService.getMatches({
                page: parseInt(page),
                limit: parseInt(limit),
                status
            });

            // Log successful operation
            logger.info('Matches retrieved', {
                count: matches.data.length,
                page,
                limit,
                status,
                ip: req.ip
            });

            // Send response
            res.json({
                success: true,
                data: matches.data,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: matches.total,
                    pages: Math.ceil(matches.total / limit)
                }
            });

        } catch (error) {
            logger.error('Failed to retrieve matches', {
                error: error.message,
                stack: error.stack,
                ip: req.ip
            });

            res.status(500).json({
                error: 'Internal server error',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

/**
 * POST /api/matches/:id/vote
 * Submit vote for a match
 */
router.post('/:id/vote',
    auth.required,
    matchesRateLimit,
    [
        // Validation
        param('id').isInt({ min: 1 }).toInt(),
        body('prediction').isIn(['team1', 'team2']).withMessage('Invalid prediction'),
        body('confidence').optional().isInt({ min: 1, max: 10 }).toInt()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: 'Validation failed',
                    details: errors.array() 
                });
            }

            const { id: matchId } = req.params;
            const { prediction, confidence = 5 } = req.body;
            const userId = req.user.id;

            const vote = await MatchService.submitVote({
                userId,
                matchId: parseInt(matchId),
                prediction,
                confidence: parseInt(confidence)
            });

            logger.info('Vote submitted', {
                userId,
                matchId,
                prediction,
                confidence
            });

            res.status(201).json({
                success: true,
                data: vote,
                message: 'Vote submitted successfully'
            });

        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    error: 'Invalid vote data',
                    message: error.message
                });
            }

            if (error.name === 'DuplicateVoteError') {
                return res.status(409).json({
                    error: 'Vote already exists',
                    message: 'You have already voted for this match'
                });
            }

            logger.error('Vote submission failed', {
                error: error.message,
                userId: req.user?.id,
                matchId: req.params.id
            });

            res.status(500).json({
                error: 'Failed to submit vote'
            });
        }
    }
);

module.exports = router;
```

### Service Layer Pattern

```javascript
// services/MatchService.js
const { sql, poolPromise } = require('../config/database');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { logger } = require('../utils/logger');

class MatchService {
    /**
     * Retrieve paginated matches with filtering
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Matches data with pagination
     */
    static async getMatches({ page = 1, limit = 20, status = null }) {
        try {
            const pool = await poolPromise;
            
            // Build dynamic query
            let whereClause = '';
            const parameters = [];
            
            if (status) {
                whereClause = 'WHERE match_status = @status';
                parameters.push({ name: 'status', type: sql.NVarChar, value: status });
            }

            // Count query
            const countQuery = `SELECT COUNT(*) as total FROM matches ${whereClause}`;
            const countRequest = pool.request();
            parameters.forEach(param => countRequest.input(param.name, param.type, param.value));
            const countResult = await countRequest.query(countQuery);
            const total = countResult.recordset[0].total;

            // Data query
            const dataQuery = `
                SELECT 
                    match_id,
                    team1,
                    team2,
                    match_date,
                    venue,
                    match_status,
                    winner,
                    created_at
                FROM matches 
                ${whereClause}
                ORDER BY match_date DESC
                OFFSET @offset ROWS 
                FETCH NEXT @limit ROWS ONLY
            `;

            const dataRequest = pool.request();
            parameters.forEach(param => dataRequest.input(param.name, param.type, param.value));
            dataRequest.input('offset', sql.Int, (page - 1) * limit);
            dataRequest.input('limit', sql.Int, limit);

            const dataResult = await dataRequest.query(dataQuery);

            return {
                data: dataResult.recordset,
                total,
                page,
                limit
            };

        } catch (error) {
            logger.error('Database error in getMatches', error);
            throw new Error('Failed to retrieve matches from database');
        }
    }

    /**
     * Submit user vote for a match
     * @param {Object} voteData - Vote information
     * @returns {Promise<Object>} Created vote record
     */
    static async submitVote({ userId, matchId, prediction, confidence }) {
        // Input validation
        if (!userId || !matchId || !prediction) {
            throw new ValidationError('Missing required vote data');
        }

        if (!['team1', 'team2'].includes(prediction)) {
            throw new ValidationError('Invalid prediction value');
        }

        if (confidence < 1 || confidence > 10) {
            throw new ValidationError('Confidence must be between 1 and 10');
        }

        try {
            const pool = await poolPromise;
            
            // Check if match exists and is open for voting
            const matchResult = await pool.request()
                .input('matchId', sql.Int, matchId)
                .query(`
                    SELECT match_status, match_date 
                    FROM matches 
                    WHERE match_id = @matchId
                `);

            if (matchResult.recordset.length === 0) {
                throw new NotFoundError('Match not found');
            }

            const match = matchResult.recordset[0];
            if (match.match_status === 'completed') {
                throw new ValidationError('Cannot vote on completed match');
            }

            // Check for existing vote
            const existingVoteResult = await pool.request()
                .input('userId', sql.NVarChar, userId)
                .input('matchId', sql.Int, matchId)
                .query(`
                    SELECT vote_id 
                    FROM votes 
                    WHERE user_id = @userId AND match_id = @matchId
                `);

            if (existingVoteResult.recordset.length > 0) {
                throw new Error('DuplicateVoteError');
            }

            // Insert vote
            const insertResult = await pool.request()
                .input('userId', sql.NVarChar, userId)
                .input('matchId', sql.Int, matchId)
                .input('prediction', sql.NVarChar, prediction)
                .input('confidence', sql.Int, confidence)
                .query(`
                    INSERT INTO votes (user_id, match_id, prediction, confidence, created_at)
                    OUTPUT INSERTED.*
                    VALUES (@userId, @matchId, @prediction, @confidence, GETUTCDATE())
                `);

            const vote = insertResult.recordset[0];

            // Log successful vote
            logger.info('Vote created successfully', {
                voteId: vote.vote_id,
                userId,
                matchId,
                prediction
            });

            return vote;

        } catch (error) {
            if (error.message === 'DuplicateVoteError') {
                const duplicateError = new Error('Vote already exists for this user and match');
                duplicateError.name = 'DuplicateVoteError';
                throw duplicateError;
            }

            logger.error('Database error in submitVote', {
                error: error.message,
                userId,
                matchId
            });
            throw error;
        }
    }
}

module.exports = { MatchService };
```

## 📐 CSS/SCSS Standards

### CSS Architecture (BEM Methodology)

```css
/* Block - Component */
.match-card {
    display: flex;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Element - Part of component */
.match-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.match-card__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
}

.match-card__date {
    font-size: 0.875rem;
    color: #666;
}

.match-card__content {
    flex: 1;
}

.match-card__teams {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.match-card__team {
    text-align: center;
}

.match-card__team-name {
    font-weight: 500;
    margin-bottom: 0.25rem;
}

.match-card__team-score {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1976d2;
}

.match-card__vs {
    font-weight: 600;
    color: #666;
    padding: 0.5rem;
    background-color: #f5f5f5;
    border-radius: 50%;
}

.match-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

/* Modifier - Variations */
.match-card--live {
    border-color: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.match-card--completed {
    opacity: 0.8;
    background-color: #fafafa;
}

.match-card--scheduled {
    background: linear-gradient(135deg, #e3f2fd, #ffffff);
}

/* Responsive modifiers */
.match-card--compact {
    padding: 0.75rem;
}

.match-card--compact .match-card__teams {
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .match-card {
        padding: 0.75rem;
    }
    
    .match-card__teams {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
    
    .match-card__vs {
        display: none;
    }
}
```

### CSS Custom Properties

```css
:root {
    /* Colors */
    --color-primary: #1976d2;
    --color-primary-light: #42a5f5;
    --color-primary-dark: #1565c0;
    
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-error: #f44336;
    --color-info: #2196f3;
    
    /* Typography */
    --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-family-mono: 'Fira Code', Consolas, monospace;
    
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    
    /* Layout */
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.5rem;
    --border-radius-lg: 0.75rem;
    --border-radius-xl: 1rem;
    
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
    
    /* Transitions */
    --transition-fast: 150ms ease-out;
    --transition-normal: 250ms ease-out;
    --transition-slow: 350ms ease-out;
    
    /* Z-index scale */
    --z-dropdown: 1000;
    --z-sticky: 1010;
    --z-fixed: 1020;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
}

/* Usage example */
.button {
    background-color: var(--color-primary);
    color: white;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-md);
    font-weight: var(--font-weight-medium);
    transition: background-color var(--transition-fast);
    box-shadow: var(--shadow-sm);
}

.button:hover {
    background-color: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
}
```

## 🧪 Testing Standards

### Jest Test Structure

```javascript
// __tests__/components/MatchCard.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import MatchCard from '../MatchCard';

// Mock dependencies
jest.mock('../../services/MatchService');

describe('MatchCard Component', () => {
    // Test data
    const mockMatch = {
        match_id: 1,
        team1: 'Chennai Super Kings',
        team2: 'Mumbai Indians',
        match_date: '2024-01-15T14:30:00Z',
        venue: 'M.A. Chidambaram Stadium',
        match_status: 'scheduled'
    };

    const defaultProps = {
        match: mockMatch,
        onVote: jest.fn(),
        currentUser: { id: 'user123' }
    };

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders match information correctly', () => {
            render(<MatchCard {...defaultProps} />);
            
            expect(screen.getByText('Chennai Super Kings')).toBeInTheDocument();
            expect(screen.getByText('Mumbai Indians')).toBeInTheDocument();
            expect(screen.getByText('M.A. Chidambaram Stadium')).toBeInTheDocument();
        });

        it('displays formatted match date', () => {
            render(<MatchCard {...defaultProps} />);
            
            // Should format the ISO date appropriately
            expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
        });

        it('shows correct status badge for scheduled match', () => {
            render(<MatchCard {...defaultProps} />);
            
            const statusBadge = screen.getByText('SCHEDULED');
            expect(statusBadge).toHaveClass('match-card__status--scheduled');
        });
    });

    describe('User Interactions', () => {
        it('calls onVote when vote button is clicked', async () => {
            const mockOnVote = jest.fn();
            render(<MatchCard {...defaultProps} onVote={mockOnVote} />);
            
            const voteButton = screen.getByRole('button', { name: /vote/i });
            fireEvent.click(voteButton);
            
            await waitFor(() => {
                expect(mockOnVote).toHaveBeenCalledWith({
                    matchId: mockMatch.match_id,
                    prediction: expect.any(String)
                });
            });
        });

        it('disables vote button for completed matches', () => {
            const completedMatch = { ...mockMatch, match_status: 'completed' };
            render(<MatchCard {...defaultProps} match={completedMatch} />);
            
            const voteButton = screen.getByRole('button', { name: /vote/i });
            expect(voteButton).toBeDisabled();
        });

        it('shows loading state during vote submission', async () => {
            const slowVoteHandler = jest.fn(() => 
                new Promise(resolve => setTimeout(resolve, 1000))
            );
            
            render(<MatchCard {...defaultProps} onVote={slowVoteHandler} />);
            
            const voteButton = screen.getByRole('button', { name: /vote/i });
            fireEvent.click(voteButton);
            
            expect(screen.getByText('Voting...')).toBeInTheDocument();
            expect(voteButton).toBeDisabled();
        });
    });

    describe('Error Handling', () => {
        it('displays error message when vote fails', async () => {
            const failingVoteHandler = jest.fn(() => 
                Promise.reject(new Error('Vote submission failed'))
            );
            
            render(<MatchCard {...defaultProps} onVote={failingVoteHandler} />);
            
            const voteButton = screen.getByRole('button', { name: /vote/i });
            fireEvent.click(voteButton);
            
            await waitFor(() => {
                expect(screen.getByText(/vote submission failed/i)).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('has proper ARIA labels', () => {
            render(<MatchCard {...defaultProps} />);
            
            expect(screen.getByLabelText(/match between/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /vote/i })).toBeInTheDocument();
        });

        it('supports keyboard navigation', () => {
            render(<MatchCard {...defaultProps} />);
            
            const voteButton = screen.getByRole('button', { name: /vote/i });
            voteButton.focus();
            
            expect(voteButton).toHaveFocus();
        });
    });

    describe('Responsive Behavior', () => {
        it('applies compact styles on small screens', () => {
            // Mock window.matchMedia for responsive testing
            window.matchMedia = jest.fn().mockImplementation(query => ({
                matches: query.includes('max-width: 768px'),
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn()
            }));
            
            render(<MatchCard {...defaultProps} />);
            
            const card = screen.getByTestId('match-card');
            expect(card).toHaveClass('match-card--compact');
        });
    });
});
```

### API Testing

```javascript
// __tests__/api/matches.test.js
import request from 'supertest';
import app from '../../app';
import { MatchService } from '../../services/MatchService';

jest.mock('../../services/MatchService');

describe('Matches API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/matches', () => {
        it('returns paginated matches successfully', async () => {
            const mockMatches = {
                data: [
                    { match_id: 1, team1: 'CSK', team2: 'MI' },
                    { match_id: 2, team1: 'RCB', team2: 'KKR' }
                ],
                total: 2,
                page: 1,
                limit: 20
            };

            MatchService.getMatches.mockResolvedValue(mockMatches);

            const response = await request(app)
                .get('/api/matches')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockMatches.data,
                pagination: {
                    page: 1,
                    limit: 20,
                    total: 2,
                    pages: 1
                }
            });
        });

        it('validates query parameters', async () => {
            const response = await request(app)
                .get('/api/matches?page=0')
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
        });
    });

    describe('POST /api/matches/:id/vote', () => {
        const validVoteData = {
            prediction: 'team1',
            confidence: 7
        };

        it('creates vote successfully with valid data', async () => {
            const mockVote = { vote_id: 1, ...validVoteData };
            MatchService.submitVote.mockResolvedValue(mockVote);

            const response = await request(app)
                .post('/api/matches/1/vote')
                .send(validVoteData)
                .set('Authorization', 'Bearer valid-token')
                .expect(201);

            expect(response.body).toEqual({
                success: true,
                data: mockVote,
                message: 'Vote submitted successfully'
            });
        });

        it('requires authentication', async () => {
            await request(app)
                .post('/api/matches/1/vote')
                .send(validVoteData)
                .expect(401);
        });

        it('validates vote data', async () => {
            const response = await request(app)
                .post('/api/matches/1/vote')
                .send({ prediction: 'invalid' })
                .set('Authorization', 'Bearer valid-token')
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
        });
    });
});
```

---

> 📌 **Note:** These coding standards ensure consistency and maintainability across the codebase. All team members should follow these guidelines and use automated tools (ESLint, Prettier) to enforce them.