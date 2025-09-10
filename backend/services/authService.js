const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/auth');
const { generateToken } = require('../utils/auth');
const { validateSignupData, validateLoginData, validateUpdateProfileData } = require('../utils/validation');

// Register new user
const registerUser = async (userData) => {
  try {
    // Validate input data with Zod
    const validation = validateSignupData(userData);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      };
    }

    const validatedData = validation.data;
    const { name, email, password, class: userClass, state } = validatedData;

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

    // Create new user with validated and transformed data
    const newUser = new User({
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
    });

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
      data: { user }
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

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
