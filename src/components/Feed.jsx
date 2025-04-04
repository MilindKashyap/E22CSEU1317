import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Avatar, 
  Box, 
  CircularProgress, 
  Chip,
  IconButton,
  Divider,
  CardActions,
  Button,
  Paper
} from '@mui/material';
import { 
  Favorite, 
  ChatBubbleOutline, 
  Share, 
  BookmarkBorder, 
  MoreHoriz 
} from '@mui/icons-material';
import { getUsers, getUserPosts, getPostComments, getRandomImage } from '../services/api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = [];
        const usersMap = new Map(Object.entries(users));

        for (const [userId, userName] of usersMap) {
          const userPosts = await getUserPosts(userId);
          allPosts.push(...userPosts.map(post => ({
            ...post,
            userName,
            userId
          })));
        }

        // Sort posts by ID in descending order (newest first)
        const sortedPosts = allPosts.sort((a, b) => b.id - a.id);

        // Add random images and fetch comments for each post
        const postsWithDetails = await Promise.all(
          sortedPosts.map(async (post) => {
            const comments = await getPostComments(post.id);
            return {
              ...post,
              image: getRandomImage(600, 400),
              commentCount: comments.length,
              likes: Math.floor(Math.random() * 100) + 1,
              timeAgo: getRandomTimeAgo(),
            };
          })
        );

        setPosts(postsWithDetails);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(users).length > 0) {
      fetchPosts();
    }
  }, [users]);

  // Set up polling for new posts every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const fetchNewPosts = async () => {
        try {
          const allPosts = [];
          const usersMap = new Map(Object.entries(users));

          for (const [userId, userName] of usersMap) {
            const userPosts = await getUserPosts(userId);
            allPosts.push(...userPosts.map(post => ({
              ...post,
              userName,
              userId
            })));
          }

          const sortedPosts = allPosts.sort((a, b) => b.id - a.id);
          const postsWithDetails = await Promise.all(
            sortedPosts.map(async (post) => {
              const comments = await getPostComments(post.id);
              return {
                ...post,
                image: getRandomImage(600, 400),
                commentCount: comments.length,
                likes: Math.floor(Math.random() * 100) + 1,
                timeAgo: getRandomTimeAgo(),
              };
            })
          );

          setPosts(postsWithDetails);
        } catch (error) {
          console.error('Error updating feed:', error);
        }
      };

      fetchNewPosts();
    }, 30000);

    return () => clearInterval(interval);
  }, [users]);

  // Helper function to get random time ago string
  const getRandomTimeAgo = () => {
    const times = [
      '2 minutes ago',
      '15 minutes ago',
      '1 hour ago',
      '3 hours ago',
      'Yesterday',
      '2 days ago'
    ];
    return times[Math.floor(Math.random() * times.length)];
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
          Your Feed
        </Typography>
        <Chip 
          label="Most Recent" 
          color="primary" 
          variant="outlined" 
          sx={{ borderRadius: 2, fontWeight: 500 }} 
        />
      </Paper>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card sx={{ mb: 2, overflow: 'visible' }}>
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={getRandomImage(50, 50)}
                      alt={post.userName}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {post.userName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.timeAgo}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size="small">
                    <MoreHoriz />
                  </IconButton>
                </Box>
                
                <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                  {post.content}
                </Typography>

                <Box 
                  sx={{ 
                    borderRadius: 3, 
                    overflow: 'hidden', 
                    mb: 2,
                    maxHeight: 400,
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.03)'
                  }}
                >
                  <img
                    src={post.image}
                    alt="Post content"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      maxHeight: 400
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                  <Chip 
                    size="small" 
                    icon={<Favorite fontSize="small" />} 
                    label={`${post.likes} likes`} 
                    variant="outlined" 
                    sx={{ borderRadius: 2 }} 
                  />
                  <Chip 
                    size="small" 
                    icon={<ChatBubbleOutline fontSize="small" />} 
                    label={`${post.commentCount} comments`} 
                    variant="outlined" 
                    sx={{ borderRadius: 2 }} 
                  />
                </Box>
              </CardContent>
              
              <Divider />
              
              <CardActions sx={{ px: 2, py: 1 }}>
                <Button 
                  startIcon={<Favorite />} 
                  color="primary" 
                  sx={{ flexGrow: 1, borderRadius: 2 }} 
                  variant="text"
                  size="small"
                >
                  Like
                </Button>
                <Button 
                  startIcon={<ChatBubbleOutline />} 
                  color="primary" 
                  sx={{ flexGrow: 1, borderRadius: 2 }} 
                  variant="text"
                  size="small"
                >
                  Comment
                </Button>
                <Button 
                  startIcon={<Share />} 
                  color="primary" 
                  sx={{ flexGrow: 1, borderRadius: 2 }} 
                  variant="text"
                  size="small"
                >
                  Share
                </Button>
                <Button 
                  startIcon={<BookmarkBorder />} 
                  color="primary" 
                  sx={{ flexGrow: 1, borderRadius: 2 }} 
                  variant="text"
                  size="small"
                >
                  Save
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Feed;