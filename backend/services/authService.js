const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/auth');
const { generateToken } = require('../utils/auth');
const { validateSignupData, validateLoginData, validateUpdateProfileData } = require('../utils/validation');
const { OAuth2Client } = require('google-auth-library');

// Helper function to optimize Google avatar URLs for better CORS handling
const optimizeGoogleAvatarUrl = (googleUrl) => {
  if (!googleUrl || !googleUrl.includes('googleusercontent.com')) {
    return googleUrl;
  }
  
  try {
    const url = new URL(googleUrl);
    // Add parameters that might help with CORS
    url.searchParams.set('sz', '128'); // Set size to 128px
    url.searchParams.delete('s'); // Remove old size parameter if present
    return url.toString();
  } catch (error) {
    console.error('Error optimizing Google avatar URL:', error);
    return googleUrl; // Return original if parsing fails
  }
};

// Register new user
const registerUser = async (requestData) => {
  try {
    // Validate input data with Zod
    const validation = validateSignupData(requestData);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      };
    }

    const validatedData = validation.data;
    const { name, email, password, class: userClass, state, stream, field } = validatedData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: 'User already exists with this email',
        errors: ['Email is already registered']
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user data object
    const userData = {
      name,
      email,
      password: hashedPassword,
      class: userClass,
      state,
      preferences: {
        interestedStreams: [],
        careerGoals: [],
        studyPreference: 'both'
      }
    };

    // Add stream if provided (for class 10 and 12)
    if (stream && (userClass === '10' || userClass === '12')) {
      userData.stream = stream;
    }

    // Add field if provided (for class 12 with stream)
    if (field && userClass === '12' && stream) {
      userData.field = field;
    }

    // Create new user with validated and transformed data
    const newUser = new User(userData);

    // Save user to database
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = generateToken(savedUser._id);

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        user: savedUser,
        token
      }
    };

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return {
        success: false,
        message: 'User already exists with this email',
        errors: ['Email is already registered']
      };
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return {
        success: false,
        message: 'Validation failed',
        errors
      };
    }

    return {
      success: false,
      message: 'Registration failed',
      errors: ['An unexpected error occurred']
    };
  }
};

// Login user
const loginUser = async (loginData) => {
  try {
    // Validate input data with Zod
    const validation = validateLoginData(loginData);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      };
    }

    const validatedData = validation.data;
    const { email, password } = validatedData;

    // Find user by email
    const user = await User.findOne({ 
      email,
      isActive: true 
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials',
        errors: ['Invalid email or password']
      };
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid credentials',
        errors: ['Invalid email or password']
      };
    }

    // Generate JWT token
    const token = generateToken(user._id);

    return {
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Login failed',
      errors: ['An unexpected error occurred']
    };
  }
};

// Get user profile
const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        errors: ['User does not exist']
      };
    }

    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: { user }
    };

  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      message: 'Failed to retrieve profile',
      errors: ['An unexpected error occurred']
    };
  }
};

// Update user profile
const updateUserProfile = async (userId, updateData) => {
  try {
    // Validate input data with Zod
    const validation = validateUpdateProfileData(updateData);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      };
    }

    const validatedData = validation.data;

    const user = await User.findByIdAndUpdate(
      userId,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return {
        success: false,
        message: 'User not found',
        errors: ['User does not exist']
      };
    }

    return {
      success: true,
      message: 'Profile updated successfully',
      data: { 
        user,
        token: generateToken(user._id) // Generate a fresh token after profile update
      }
    };

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return {
        success: false,
        message: 'Validation failed',
        errors
      };
    }

    return {
      success: false,
      message: 'Failed to update profile',
      errors: ['An unexpected error occurred']
    };
  }
};

// Google OAuth authentication
const handleGoogleAuth = async (idToken) => {
  try {
    // Initialize Google OAuth client
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });

    if (user) {
      // User exists - update Google ID and avatar if not set
      let shouldSave = false;
      
      if (!user.googleId) {
        user.googleId = googleId;
        shouldSave = true;
      }
      
      // Update avatar with Google profile picture if not already set
      if (!user.avatar && picture) {
        // Optimize Google avatar URL to avoid CORS issues
        user.avatar = optimizeGoogleAvatarUrl(picture);
        shouldSave = true;
      }
      
      if (shouldSave) {
        await user.save();
      }

      // Generate token and return user data
      const token = generateToken(user._id);
      
      // Check if profile is complete (has state, class, stream)
      const isProfileComplete = user.state && user.class && user.stream;
      
      return {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            googleId: user.googleId,
            avatar: user.avatar || picture,
            class: user.class,
            state: user.state,
            stream: user.stream,
            field: user.field,
            createdAt: user.createdAt,
            isProfileComplete
          },
          token,
          requiresProfileCompletion: !isProfileComplete
        }
      };
    } else {
      // New user - create account
      const newUser = new User({
        name,
        email,
        googleId,
        avatar: optimizeGoogleAvatarUrl(picture),
        preferences: {
          interestedStreams: [],
          careerGoals: [],
          studyPreference: 'both'
        }
      });

      await newUser.save();
      const token = generateToken(newUser._id);

      return {
        success: true,
        message: 'Account created successfully',
        data: {
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            googleId: newUser.googleId,
            avatar: newUser.avatar,
            class: newUser.class,
            state: newUser.state,
            stream: newUser.stream,
            field: newUser.field,
            createdAt: newUser.createdAt,
            isProfileComplete: false
          },
          token,
          requiresProfileCompletion: true
        }
      };
    }

  } catch (error) {
    console.error('Google Auth error:', error);
    
    if (error.message?.includes('Token used too early') || error.message?.includes('Invalid token')) {
      return {
        success: false,
        message: 'Invalid Google token',
        errors: ['Google authentication failed']
      };
    }

    return {
      success: false,
      message: 'Google authentication failed',
      errors: ['An unexpected error occurred during Google authentication']
    };
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  handleGoogleAuth
};
