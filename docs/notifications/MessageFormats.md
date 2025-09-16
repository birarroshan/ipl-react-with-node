# Notification Types & Message Formatting

## 🔔 Notification Categories

The IPL Play-Along application supports multiple types of notifications, each with specific formatting, timing, and interaction patterns designed to enhance user engagement.

## 📋 Notification Type Matrix

| Type | Priority | Timing | Interaction | TTL | Badge |
|------|----------|--------|-------------|-----|--------|
| **Match Start** | High | Pre-match | View Match | 1h | 🏏 |
| **Vote Reminder** | High | During match | Vote Now | 30m | ⚡ |
| **Score Update** | Medium | Live | View Score | 15m | 📊 |
| **Match Result** | High | Post-match | View Results | 24h | 🏆 |
| **Leaderboard** | Medium | Daily | View Board | 6h | 👑 |
| **Achievement** | Medium | Real-time | View Profile | 24h | 🎯 |
| **System** | Low | As needed | App Action | 1h | ℹ️ |

## 🏏 Match Start Notifications

### Message Structure

```javascript
const matchStartNotification = {
    title: "🏏 Match Starting Soon!",
    body: `${team1} vs ${team2} starts in ${timeRemaining} minutes`,
    icon: "/static/media/ipl-logo.png",
    badge: "/static/media/cricket-badge.png",
    tag: `match-start-${matchId}`,
    requireInteraction: true,
    data: {
        type: "match_start",
        matchId: matchId,
        matchUrl: `/match/${matchId}`,
        teams: [team1, team2],
        startTime: matchStartTime,
        venue: venue
    },
    actions: [
        {
            action: "view-match",
            title: "📱 View Match",
            icon: "/static/media/view-icon.png"
        },
        {
            action: "set-reminder",
            title: "⏰ Remind Me",
            icon: "/static/media/remind-icon.png"
        }
    ],
    vibrate: [300, 200, 300],
    silent: false,
    timestamp: Date.now(),
    renotify: false
};
```

### Server-Side Match Start Logic

```javascript
class MatchStartNotifications {
    static async scheduleMatchStartNotifications() {
        try {
            const pool = await poolPromise;
            
            // Get upcoming matches in next 2 hours
            const upcomingMatches = await pool.request().query(`
                SELECT 
                    m.match_id,
                    m.team1,
                    m.team2,
                    m.match_date,
                    m.venue,
                    DATEDIFF(minute, GETUTCDATE(), m.match_date) as minutes_until_start
                FROM matches m
                WHERE m.match_date BETWEEN GETUTCDATE() AND DATEADD(hour, 2, GETUTCDATE())
                AND m.match_status = 'scheduled'
            `);

            for (const match of upcomingMatches.recordset) {
                const timeSlots = [60, 30, 15, 5]; // Minutes before start
                
                for (const minutes of timeSlots) {
                    if (match.minutes_until_start <= minutes + 2 && 
                        match.minutes_until_start >= minutes - 2) {
                        
                        await this.sendMatchStartNotification(match, minutes);
                    }
                }
            }
        } catch (error) {
            console.error('❌ Failed to schedule match notifications:', error);
        }
    }

    static async sendMatchStartNotification(match, minutesBefore) {
        const message = {
            title: "🏏 IPL Match Alert!",
            body: minutesBefore > 0 
                ? `${match.team1} vs ${match.team2} starts in ${minutesBefore} minutes`
                : `${match.team1} vs ${match.team2} is starting now!`,
            data: {
                type: "match_start",
                matchId: match.match_id,
                teams: [match.team1, match.team2],
                venue: match.venue,
                minutesBefore: minutesBefore,
                url: `/match/${match.match_id}`
            },
            requireInteraction: minutesBefore <= 5,
            actions: [
                {
                    action: "view-match",
                    title: "📱 View Match"
                },
                {
                    action: "vote-now",
                    title: "⚡ Vote Now"
                }
            ]
        };

        await NotificationSender.sendToSubscribedUsers(message, {
            preference: 'match_start_reminders',
            tag: `match-start-${match.match_id}-${minutesBefore}m`
        });
    }
}
```

## ⚡ Vote Reminder Notifications

### Dynamic Vote Reminders

```javascript
class VoteReminderNotifications {
    static async sendVoteReminders() {
        try {
            const pool = await poolPromise;
            
            // Get active matches where voting is open
            const activeMatches = await pool.request().query(`
                SELECT 
                    m.match_id,
                    m.team1,
                    m.team2,
                    m.current_over,
                    m.current_ball,
                    m.match_status,
                    COUNT(v.user_id) as total_votes
                FROM matches m
                LEFT JOIN votes v ON m.match_id = v.match_id
                WHERE m.match_status = 'live'
                AND m.voting_enabled = 1
                GROUP BY m.match_id, m.team1, m.team2, m.current_over, m.current_ball, m.match_status
            `);

            for (const match of activeMatches.recordset) {
                // Get users who haven't voted in last 30 minutes
                const inactiveUsers = await pool.request()
                    .input('match_id', sql.Int, match.match_id)
                    .query(`
                        SELECT DISTINCT ns.user_id, ns.endpoint, ns.p256dh_key, ns.auth_key
                        FROM notification_subscriptions ns
                        INNER JOIN notification_preferences np ON ns.user_id = np.user_id
                        WHERE ns.is_active = 1 
                        AND np.vote_reminders = 1
                        AND ns.user_id NOT IN (
                            SELECT user_id 
                            FROM votes 
                            WHERE match_id = @match_id 
                            AND created_at > DATEADD(minute, -30, GETUTCDATE())
                        )
                    `);

                if (inactiveUsers.recordset.length > 0) {
                    const message = {
                        title: "⚡ Vote Now!",
                        body: `${match.team1} vs ${match.team2} - Over ${match.current_over}.${match.current_ball}`,
                        data: {
                            type: "vote_reminder",
                            matchId: match.match_id,
                            currentSituation: `Over ${match.current_over}.${match.current_ball}`,
                            teams: [match.team1, match.team2],
                            url: `/vote/${match.match_id}`
                        },
                        actions: [
                            {
                                action: "vote-now",
                                title: "⚡ Vote Now"
                            },
                            {
                                action: "view-match",
                                title: "📱 View Match"
                            }
                        ],
                        vibrate: [100, 50, 100, 50, 200],
                        requireInteraction: false,
                        tag: `vote-reminder-${match.match_id}`
                    };

                    await NotificationSender.sendToSpecificUsers(
                        inactiveUsers.recordset, 
                        message
                    );
                }
            }
        } catch (error) {
            console.error('❌ Failed to send vote reminders:', error);
        }
    }
}
```

## 📊 Score Update Notifications

### Live Score Updates

```javascript
class ScoreUpdateNotifications {
    static formatScoreUpdate(scoreData) {
        const { match, batting_team, bowling_team, current_score, wickets, overs } = scoreData;
        
        return {
            title: `📊 ${batting_team} ${current_score}/${wickets}`,
            body: `vs ${bowling_team} - ${overs} overs`,
            data: {
                type: "score_update",
                matchId: match.match_id,
                score: {
                    batting_team,
                    bowling_team,
                    runs: current_score,
                    wickets,
                    overs
                },
                url: `/live/${match.match_id}`
            },
            tag: `score-${match.match_id}`,
            requireInteraction: false,
            silent: true, // Less intrusive for frequent updates
            actions: [
                {
                    action: "view-score",
                    title: "📊 Full Score"
                }
            ]
        };
    }

    static async sendScoreUpdate(matchId, scoreData) {
        const message = this.formatScoreUpdate(scoreData);
        
        await NotificationSender.sendToSubscribedUsers(message, {
            preference: 'score_updates',
            tag: message.tag,
            throttle: 60000 // Max one per minute per match
        });
    }

    // Send updates for significant events
    static async sendEventUpdate(matchId, event) {
        const eventMessages = {
            wicket: {
                title: "🎯 WICKET!",
                body: `${event.batsman} is out! ${event.team} ${event.score}/${event.wickets}`,
                vibrate: [200, 100, 200, 100, 400],
                requireInteraction: true
            },
            six: {
                title: "🚀 SIX!",
                body: `${event.batsman} hits it out of the park! ${event.team} ${event.score}`,
                vibrate: [100, 100, 100, 100, 100, 100],
                requireInteraction: false
            },
            four: {
                title: "🏃 FOUR!",
                body: `Boundary by ${event.batsman}! ${event.team} ${event.score}`,
                vibrate: [150, 150, 150, 150],
                requireInteraction: false
            },
            fifty: {
                title: "🎉 FIFTY!",
                body: `${event.batsman} reaches his half-century!`,
                vibrate: [300, 200, 300, 200, 500],
                requireInteraction: true
            },
            century: {
                title: "💯 CENTURY!",
                body: `${event.batsman} scores a magnificent century!`,
                vibrate: [500, 300, 500, 300, 1000],
                requireInteraction: true
            }
        };

        const baseMessage = eventMessages[event.type];
        if (baseMessage) {
            const message = {
                ...baseMessage,
                data: {
                    type: "match_event",
                    eventType: event.type,
                    matchId: matchId,
                    eventData: event,
                    url: `/live/${matchId}`
                },
                tag: `event-${matchId}-${Date.now()}`,
                actions: [
                    {
                        action: "view-match",
                        title: "📱 Watch Live"
                    }
                ]
            };

            await NotificationSender.sendToSubscribedUsers(message, {
                preference: 'score_updates',
                priority: 'high'
            });
        }
    }
}
```

## 🏆 Match Result Notifications

### Result Summary Format

```javascript
class MatchResultNotifications {
    static formatMatchResult(matchResult) {
        const { winner, margin, player_of_match, final_scores } = matchResult;
        
        return {
            title: `🏆 ${winner} Wins!`,
            body: `Won by ${margin}. Player of the Match: ${player_of_match}`,
            data: {
                type: "match_result",
                matchId: matchResult.match_id,
                result: {
                    winner,
                    margin,
                    player_of_match,
                    final_scores
                },
                url: `/results/${matchResult.match_id}`
            },
            tag: `result-${matchResult.match_id}`,
            requireInteraction: true,
            vibrate: [400, 300, 400, 300, 600],
            actions: [
                {
                    action: "view-results",
                    title: "📊 View Results"
                },
                {
                    action: "leaderboard",
                    title: "👑 Leaderboard"
                }
            ]
        };
    }

    static async sendMatchResultNotification(matchResult) {
        const message = this.formatMatchResult(matchResult);
        
        // Send to all users who participated in this match
        await NotificationSender.sendToMatchParticipants(
            matchResult.match_id, 
            message
        );
    }

    // Send personalized results for users who voted
    static async sendPersonalizedResults(matchId) {
        try {
            const pool = await poolPromise;
            
            const userResults = await pool.request()
                .input('match_id', sql.Int, matchId)
                .query(`
                    SELECT 
                        v.user_id,
                        v.prediction,
                        m.winner,
                        m.final_scores,
                        CASE 
                            WHEN v.prediction = m.winner THEN 1 
                            ELSE 0 
                        END as correct_prediction,
                        ns.endpoint,
                        ns.p256dh_key,
                        ns.auth_key
                    FROM votes v
                    INNER JOIN matches m ON v.match_id = m.match_id
                    INNER JOIN notification_subscriptions ns ON v.user_id = ns.user_id
                    WHERE v.match_id = @match_id 
                    AND ns.is_active = 1
                `);

            for (const result of userResults.recordset) {
                const isCorrect = result.correct_prediction;
                const message = {
                    title: isCorrect ? "🎉 Correct Prediction!" : "😔 Better Luck Next Time",
                    body: isCorrect 
                        ? `You predicted ${result.winner} correctly!`
                        : `You predicted ${result.prediction}, but ${result.winner} won.`,
                    data: {
                        type: "personal_result",
                        matchId: matchId,
                        prediction: result.prediction,
                        winner: result.winner,
                        correct: isCorrect,
                        url: `/results/${matchId}?user=${result.user_id}`
                    },
                    tag: `personal-result-${matchId}-${result.user_id}`,
                    actions: [
                        {
                            action: "view-results",
                            title: "📊 View Details"
                        },
                        {
                            action: "next-match",
                            title: "🏏 Next Match"
                        }
                    ]
                };

                await NotificationSender.sendToUser(result.user_id, message);
            }
        } catch (error) {
            console.error('❌ Failed to send personalized results:', error);
        }
    }
}
```

## 👑 Leaderboard & Achievement Notifications

### Achievement Unlocks

```javascript
class AchievementNotifications {
    static achievementTemplates = {
        first_vote: {
            title: "🎯 First Vote!",
            body: "Welcome to IPL Play-Along! You've cast your first vote.",
            icon: "/static/media/achievement-first.png"
        },
        streak_5: {
            title: "🔥 5-Match Streak!",
            body: "You're on fire! 5 correct predictions in a row.",
            icon: "/static/media/achievement-streak.png"
        },
        streak_10: {
            title: "🌟 10-Match Streak!",
            body: "Incredible! 10 correct predictions in a row!",
            icon: "/static/media/achievement-expert.png"
        },
        top_10: {
            title: "👑 Top 10 Player!",
            body: "You've reached the top 10 on the leaderboard!",
            icon: "/static/media/achievement-top10.png"
        },
        perfect_week: {
            title: "💎 Perfect Week!",
            body: "Amazing! You got every prediction right this week.",
            icon: "/static/media/achievement-perfect.png"
        }
    };

    static async sendAchievementNotification(userId, achievementType, metadata = {}) {
        const template = this.achievementTemplates[achievementType];
        if (!template) return;

        const message = {
            ...template,
            data: {
                type: "achievement",
                achievementType,
                userId,
                metadata,
                url: "/profile?tab=achievements"
            },
            tag: `achievement-${achievementType}-${userId}`,
            requireInteraction: true,
            vibrate: [200, 100, 200, 100, 500],
            actions: [
                {
                    action: "view-profile",
                    title: "🏆 View Achievements"
                },
                {
                    action: "share",
                    title: "📤 Share Achievement"
                }
            ]
        };

        await NotificationSender.sendToUser(userId, message);
    }
}

class LeaderboardNotifications {
    static async sendWeeklyLeaderboard() {
        try {
            const pool = await poolPromise;
            
            const topUsers = await pool.request().query(`
                SELECT TOP 10 
                    user_id,
                    weekly_score,
                    weekly_rank,
                    rank_change
                FROM user_weekly_stats
                WHERE week_start = DATEADD(week, DATEDIFF(week, 0, GETUTCDATE()), 0)
                ORDER BY weekly_rank
            `);

            const message = {
                title: "👑 Weekly Leaderboard Update",
                body: `This week's top predictor: ${topUsers.recordset[0]?.user_id || 'TBD'}`,
                data: {
                    type: "leaderboard_update",
                    period: "weekly",
                    topUsers: topUsers.recordset.slice(0, 3),
                    url: "/leaderboard"
                },
                tag: "weekly-leaderboard",
                actions: [
                    {
                        action: "leaderboard",
                        title: "👑 View Leaderboard"
                    }
                ]
            };

            await NotificationSender.sendToSubscribedUsers(message, {
                preference: 'leaderboard_updates'
            });
        } catch (error) {
            console.error('❌ Failed to send leaderboard update:', error);
        }
    }
}
```

## 🎨 Notification Styling & Branding

### Visual Design Guidelines

```javascript
const NotificationBranding = {
    colors: {
        primary: "#1976d2",
        success: "#4caf50", 
        warning: "#ff9800",
        error: "#f44336",
        info: "#2196f3"
    },
    
    icons: {
        match: "/static/media/cricket-ball.png",
        vote: "/static/media/vote-icon.png", 
        score: "/static/media/scoreboard.png",
        achievement: "/static/media/trophy.png",
        reminder: "/static/media/bell.png"
    },
    
    badges: {
        match: "/static/media/ipl-badge.png",
        vote: "/static/media/vote-badge.png",
        score: "/static/media/score-badge.png"
    },

    getStyledNotification(type, content) {
        const baseStyle = {
            icon: this.icons[type] || this.icons.match,
            badge: this.badges[type] || this.badges.match,
            image: content.image || null,
            dir: "ltr",
            lang: "en",
            timestamp: Date.now()
        };

        return {
            ...content,
            ...baseStyle
        };
    }
};
```

### Rich Media Notifications

```javascript
class RichNotifications {
    static async createImageNotification(matchId, imageUrl, caption) {
        return {
            title: "📸 Match Highlight",
            body: caption,
            image: imageUrl, // Large image display
            data: {
                type: "match_image",
                matchId: matchId,
                imageUrl: imageUrl,
                url: `/match/${matchId}`
            },
            tag: `image-${matchId}-${Date.now()}`,
            requireInteraction: true
        };
    }

    static async createProgressNotification(matchId, progress) {
        return {
            title: `🏏 ${progress.battingTeam} - ${progress.overs} overs`,
            body: `${progress.runs}/${progress.wickets} (RRR: ${progress.requiredRunRate})`,
            data: {
                type: "match_progress",
                matchId: matchId,
                progress: progress,
                url: `/live/${matchId}`
            },
            tag: `progress-${matchId}`,
            ongoing: true, // For progress-style notifications
            progress: Math.round((progress.overs / 20) * 100)
        };
    }
}
```

---

> 📌 **Note:** Effective notification formatting balances informativeness with user experience. Always consider timing, frequency, and user preferences to avoid notification fatigue while maintaining engagement.