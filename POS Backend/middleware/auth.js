const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    // If user is not present, deny
    if (!req.user) {
      return res.status(403).json({ error: 'Access denied. No user found.' });
    }
    
    // Check if user has any of the required roles
    const userRoles = req.user.roles || [];
    if (requiredRoles.some(role => userRoles.includes(role))) {
      console.log('✅ User granted access with role(s):', userRoles);
      return next();
    }
    
    // If no roles match, deny
    console.log('❌ User denied access. Required roles:', requiredRoles, 'User roles:', userRoles);
    return res.status(403).json({ 
      error: 'Access denied. Insufficient role permissions.',
      required: requiredRoles,
      userRoles: userRoles
    });
  };
};

const requirePermission = (permissions) => {
  return (req, res, next) => {
    // If user is not present, deny
    if (!req.user) {
      return res.status(403).json({ error: 'Access denied. No user found.' });
    }
    
    // If user is admin, grant access to all permissions
    if (req.user.roles && req.user.roles.includes('admin')) {
      console.log('✅ Admin user granted access to:', permissions);
      return next();
    }
    
    // Check if user has any of the required permissions
    const userPermissions = req.user.permissions || [];
    if (permissions.some(perm => userPermissions.includes(perm))) {
      console.log('✅ User granted access to:', permissions);
      return next();
    }
    
    // If no permissions match, deny
    console.log('❌ User denied access to:', permissions, 'User permissions:', userPermissions);
    return res.status(403).json({ 
      error: 'Access denied. Insufficient permissions.',
      required: permissions,
      userPermissions: userPermissions
    });
  };
};

module.exports = { auth, requireRole, requirePermission };