(async () => {
  try {
    const registerRes = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        email: 'admin@example.com',
        password: 'Admin123!',
        roles: ['admin'],
        permissions: ['manage_products', 'manage_inventory', 'view_reports']
      })
    });
    const registerData = await registerRes.json();
    console.log('Register response:', registerData);

    const loginRes = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'Admin123!' })
    });
    const loginData = await loginRes.json();
    console.log('Login response:', loginData);

    const token = loginData.token;
    if (!token) {
      console.error('Login failed, cannot create record');
      process.exit(1);
    }

    const categoryRes = await fetch('http://localhost:3001/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: 'Test Category', description: 'Created for backend verification' })
    });
    const categoryData = await categoryRes.json();
    console.log('Category created:', categoryData);
  } catch (error) {
    console.error('Error:', error.message || error);
    process.exit(1);
  }
})();