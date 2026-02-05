// Check current authentication state
console.log('Checking authentication state...');

// Check if there's a token in localStorage
const token = localStorage.getItem('authToken');
console.log('Token in localStorage:', token);

// Check current user data
const userData = localStorage.getItem('user');
console.log('User data in localStorage:', userData);

// Check current URL
console.log('Current URL:', window.location.href);

// Check if we can navigate to register page
console.log('Attempting to navigate to /register...');
window.location.href = '/register';