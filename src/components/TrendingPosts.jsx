import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Avatar, 
  Box, 
  CircularProgress, 
  Paper, 
  Chip, 
  Divider,
  IconButton,
  CardActions,
  Button
} from '@mui/material';
import { 
  TrendingUp, 
  Whatshot, 
  Favorite, 
  ChatBubbleOutline, 
  Share, 
  BookmarkBorder
} from '@mui/icons-material';
import { getUsers, getUserPosts, getPostComments, getRandomImage } from '../services/api';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const users = await getUsers();
        const allPosts = [];
        const usersMap = new Map(Object.entries(users));

        // Fetch all posts from all users
        for (const [userId, userName] of usersMap) {
          const posts = await getUserPosts(userId);
          allPosts.push(...posts.map(post => ({
            ...post,
            userName,
            userId
          })));
        }

        // Fetch comments for all posts
        const postsWithComments = await Promise.all(
          allPosts.map(async (post) => {
            const comments = await getPostComments(post.id);
            return {
              ...post,
              commentCount: comments.length,
              likes: Math.floor(Math.random() * 100) + 50, // Higher likes for trending posts
              views: Math.floor(Math.random() * 5000) + 1000,
              trending: Math.floor(Math.random() * 30) + 70  // Trending percentage (70-100%)
            };
          })
        );

        // Sort by comment count to find trending posts
        const sortedPosts = postsWithComments.sort((a, b) => b.commentCount - a.commentCount);
        
        // Take top 5 trending posts
        const trending = sortedPosts.slice(0, 5);

        // Add random images and format the data
        const formattedPosts = trending.map(post => ({
          ...post,
          image: getRandomImage(600, 400),
          category: getRandomCategory()
        }));

        setTrendingPosts(formattedPosts);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  // Helper function to get random category
  const getRandomCategory = () => {
    const categories = [
      'Technology',
      'Lifestyle',
      'Food',
      'Travel',
      'Fashion',
      'Health',
      'Sports'
    ];
    return categories[Math.floor(Math.random() * categories.length)];
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
        <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp color="secondary" /> Trending Posts
        </Typography>
        <Chip 
          icon={<Whatshot />}
          label="Hot Topics" 
          color="secondary" 
          sx={{ borderRadius: 2, fontWeight: 500 }} 
        />
      </Paper>

      <Grid container spacing={3}>
        {trendingPosts.map((post, index) => (
          <Grid item xs={12} key={post.id}>
            <Card sx={{ overflow: 'hidden' }}>
              <Box sx={{ position: 'relative' }}>
                <Box 
                  sx={{ 
                    height: 200,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <img
                    src={post.image}
                    alt="Post content"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                    }}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      p: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip 
                        label={`#${index + 1} Trending`} 
                        color="secondary" 
                        size="small"
                        sx={{ borderRadius: 2, fontWeight: 600 }} 
                      />
                      <Chip 
                        label={post.category} 
                        color="primary" 
                        size="small"
                        sx={{ borderRadius: 2 }} 
                      />
                    </Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {post.content.substring(0, 80)}...
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Avatar
                  src={getRandomImage(50, 50)}
                  alt={post.userName}
                  sx={{ mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {post.userName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.views.toLocaleString()} views
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Favorite fontSize="small" color="secondary" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{post.likes}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ChatBubbleOutline fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{post.commentCount}</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider />

              <Box 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  bgcolor: 'background.default'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Whatshot color="secondary" />
                  <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {post.trending}% engagement rate
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="small"
                  sx={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }}
                >
                  View Full Post
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrendingPosts; 