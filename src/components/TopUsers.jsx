import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Avatar, 
  Box, 
  Paper,
  CircularProgress,
  Chip,
  Button,
  LinearProgress
} from '@mui/material';
import { PersonAdd, EmojiEvents } from '@mui/icons-material';
import { getUsers, getUserPosts, getRandomImage } from '../services/api';

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const users = await getUsers();
        const userPostsPromises = Object.entries(users).map(async ([userId, userName]) => {
          const posts = await getUserPosts(userId);
          return {
            id: userId,
            name: userName,
            postCount: posts.length,
            avatar: getRandomImage(150, 150),
            followers: Math.floor(Math.random() * 5000) + 500,
            engagement: Math.floor(Math.random() * 100),
            badge: getBadgeType()
          };
        });

        const usersWithPosts = await Promise.all(userPostsPromises);
        const sortedUsers = usersWithPosts
          .sort((a, b) => b.postCount - a.postCount)
          .slice(0, 5);

        setTopUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching top users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  // Helper function to get random badge type
  const getBadgeType = () => {
    const badges = [
      'Top Creator',
      'Rising Star',
      'Influencer',
      'Trendsetter',
      'Community Leader'
    ];
    return badges[Math.floor(Math.random() * badges.length)];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Top Users
        </Typography>
        <Chip 
          icon={<EmojiEvents fontSize="small" />}
          label="This Month" 
          color="primary" 
          variant="outlined" 
          sx={{ borderRadius: 2, fontWeight: 500 }} 
        />
      </Paper>

      <Grid container spacing={3}>
        {topUsers.map((user, index) => (
          <Grid item xs={12} md={6} key={user.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                {index < 3 && (
                  <Chip 
                    label={`#${index + 1}`} 
                    color={index === 0 ? 'secondary' : 'primary'}
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 16, 
                      right: 16,
                      fontWeight: 'bold'
                    }}
                  />
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mr: 2,
                      border: '4px solid',
                      borderColor: index === 0 ? 'secondary.main' : 'primary.main',
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {user.name}
                    </Typography>
                    <Chip 
                      label={user.badge} 
                      size="small" 
                      color={index === 0 ? 'secondary' : 'primary'} 
                      sx={{ borderRadius: 1, fontWeight: 500 }} 
                    />
                  </Box>
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 2 }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {user.postCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Posts
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 2 }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {user.followers.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Followers
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Engagement Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={user.engagement} 
                      color={index === 0 ? 'secondary' : 'primary'}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {user.engagement}%
                    </Typography>
                  </Box>
                </Box>
                
                <Button 
                  variant="outlined" 
                  color={index === 0 ? 'secondary' : 'primary'} 
                  fullWidth
                  startIcon={<PersonAdd />}
                  sx={{ borderRadius: 2, mt: 1 }}
                >
                  Follow
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TopUsers; 