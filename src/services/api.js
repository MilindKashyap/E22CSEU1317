import axios from 'axios';

const BASE_URL = '/evaluation-service';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNzQ3MTYyLCJpYXQiOjE3NDM3NDY4NjIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjBhZDJkMWM3LWRkZmMtNGEyOC04MGRjLTJkZjc0MzlmMDZiZSIsInN1YiI6ImUyMmNzZXUxMzIxQGJlbm5ldHQuZWR1LmluIn0sImVtYWlsIjoiZTIyY3NldTEzMjFAYmVubmV0dC5lZHUuaW4iLCJuYW1lIjoiemFpZCBuYXdheiBraGFuIiwicm9sbE5vIjoiZTIyY3NldTEzMjEiLCJhY2Nlc3NDb2RlIjoicnRDSFpKIiwiY2xpZW50SUQiOiIwYWQyZDFjNy1kZGZjLTRhMjgtODBkYy0yZGY3NDM5ZjA2YmUiLCJjbGllbnRTZWNyZXQiOiJlYnlBbVZ4d2tSWnpQdWNDIn0.bEAwWgFk8I5HUecoK_n0S8CWGmQSKGFgSzNM1FsCUAc';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserPosts = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/posts`);
    return response.data.posts;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

export const getPostComments = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data.comments;
  } catch (error) {
    console.error('Error fetching post comments:', error);
    throw error;
  }
};

export const getRandomImage = (width = 200, height = 200) => {
  return `https://picsum.photos/${width}/${height}`;
}; 