/**
 * Utility functions for optimizing MongoDB queries
 */

// Create compound indexes for frequently queried fields
const createIndexes = async (mongoose) => {
  try {
    // Get all models
    const modelNames = mongoose.modelNames();
    console.log('Creating indexes for models:', modelNames);
    
    for (const modelName of modelNames) {
      const Model = mongoose.model(modelName);
      
      // Common index patterns based on model name
      switch(modelName) {
        case 'User':
          await Model.collection.createIndex({ email: 1 }, { unique: true });
          await Model.collection.createIndex({ role: 1 });
          await Model.collection.createIndex({ level: -1, xp: -1 }); // For leaderboards
          break;
          
        case 'Assignment':
          await Model.collection.createIndex({ user: 1, dueDate: 1 });
          await Model.collection.createIndex({ completed: 1 });
          break;
          
        case 'Exam':
          await Model.collection.createIndex({ user: 1, date: 1 });
          break;
          
        case 'StudySession':
          await Model.collection.createIndex({ user: 1, date: -1 });
          await Model.collection.createIndex({ duration: -1 });
          break;
          
        case 'Quest':
          await Model.collection.createIndex({ type: 1, difficulty: 1 });
          break;
          
        case 'UserQuest':
          await Model.collection.createIndex({ user: 1, quest: 1 }, { unique: true });
          await Model.collection.createIndex({ user: 1, completed: 1 });
          break;
          
        case 'Activity':
          await Model.collection.createIndex({ user: 1, createdAt: -1 });
          await Model.collection.createIndex({ type: 1 });
          break;
          
        default:
          // For all other models, create basic indexes
          if (Model.schema.paths.user) {
            await Model.collection.createIndex({ user: 1 });
          }
          if (Model.schema.paths.createdAt) {
            await Model.collection.createIndex({ createdAt: -1 });
          }
      }
    }
    
    console.log('✅ Database indexes created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
    return false;
  }
};

// Optimize query projection to return only needed fields
const optimizeProjection = (fields) => {
  if (!fields || !fields.length) return {};
  
  const projection = {};
  fields.forEach(field => {
    projection[field] = 1;
  });
  
  return projection;
};

// Optimize pagination for large datasets
const paginateResults = async (Model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 20,
    sort = { createdAt: -1 },
    projection = {},
    populate = []
  } = options;
  
  const skip = (page - 1) * limit;
  
  let queryBuilder = Model.find(query)
    .select(projection)
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  // Apply population if needed
  if (populate && populate.length) {
    populate.forEach(field => {
      queryBuilder = queryBuilder.populate(field);
    });
  }
  
  // Execute query
  const results = await queryBuilder.lean();
  
  // Get total count (only if needed)
  const totalCount = await Model.countDocuments(query);
  
  return {
    results,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1
    }
  };
};

module.exports = {
  createIndexes,
  optimizeProjection,
  paginateResults
};