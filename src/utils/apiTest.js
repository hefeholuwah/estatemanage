import { API_URL } from './config';

// Simple API test function
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection to:', API_URL);
    
    const response = await fetch(`${API_URL.replace('/api', '')}/`);
    const data = await response.text();
    
    console.log('API Response:', data);
    
    if (response.ok) {
      console.log('✅ API connection successful!');
      return { success: true, message: 'API connection successful', data };
    } else {
      console.log('❌ API connection failed:', response.status);
      return { success: false, message: 'API connection failed', status: response.status };
    }
  } catch (error) {
    console.error('❌ API connection error:', error);
    return { success: false, message: 'API connection error', error: error.message };
  }
};

// Test specific endpoint
export const testAuthEndpoint = async () => {
  try {
    console.log('Testing auth endpoint...');
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'test@example.com',
        password: 'testpassword'
      })
    });
    
    const data = await response.json();
    console.log('Auth endpoint response:', data);
    
    return { success: response.ok, data };
  } catch (error) {
    console.error('Auth endpoint error:', error);
    return { success: false, error: error.message };
  }
}; 