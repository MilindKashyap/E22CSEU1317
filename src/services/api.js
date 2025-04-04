import axios from 'axios';

const BASE_URL = '/evaluation-service';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNzQ1NjUwLCJpYXQiOjE3NDM3NDUzNTAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjNhMTc5MmNiLTI3NTUtNGMyNS1hYjgyLWU2ZDkwOGQ0NTA2ZiIsInN1YiI6ImUyMmNzZXUxMzE3QGJlbm5ldHQuZWR1LmluIn0sImVtYWlsIjoiZTIyY3NldTEzMTdAYmVubmV0dC5lZHUuaW4iLCJuYW1lIjoibWlsaW5kIGthc2h5YXAiLCJyb2xsTm8iOiJlMjJjc2V1MTMxNyIsImFjY2Vzc0NvZGUiOiJydENIWkoiLCJjbGllbnRJRCI6IjNhMTc5MmNiLTI3NTUtNGMyNS1hYjgyLWU2ZDkwOGQ0NTA2ZiIsImNsaWVudFNlY3JldCI6InNZZFdXVU1TVnNiblNXRmoifQ.YKb701t5qV6vQ1S4FRFErJhs4QOih5JM_RUiNJyQU-g';

// Create an axios instance with the token in the Authorization header
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // Add a timeout to prevent hanging requests
});

// Add request interceptor for logging
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for handling common errors
api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  error => {
    if (error.response) {
      console.error(`API Error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`);
      
      // Handle 401 unauthorized errors
      if (error.response.status === 401) {
        console.error('Authentication failed - please check your token');
      }
    } else if (error.request) {
      console.error('API Error: No response received', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Mock data for fallback in case API is unreachable
const mockUsers = {
  '1': 'Milind Kashyap',
  '2': 'John Smith',
  '3': 'Sarah Jones',
  '4': 'Alex Williams',
  '5': 'Morgan Lee'
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    console.log('Falling back to mock users data');
    return mockUsers; // Fallback to mock data
  }
};

export const getUserPosts = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/posts`);
    return response.data.posts;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    // Generate fake posts if API fails
    return Array.from({ length: 3 }, (_, i) => ({
      id: `${userId}-${i+1}`,
      content: `This is a sample post ${i+1} by user ${userId}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      title: `Post ${i+1} Title`
    }));
  }
};

export const getPostComments = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data.comments;
  } catch (error) {
    console.error('Error fetching post comments:', error);
    // Return mock comments if API fails
    return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
      id: `${postId}-comment-${i+1}`,
      content: `This is a comment ${i+1} on post ${postId}`,
      user: `User ${Math.floor(Math.random() * 5) + 1}`
    }));
  }
};

export const getRandomImage = (width = 200, height = 200) => {
  return `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`;
}; 