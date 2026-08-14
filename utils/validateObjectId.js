const mongoose = require('mongoose');

/**
 * Validates a MongoDB ObjectId string.
 * Returns an error object if invalid, null if valid.
 */
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ID format: ${id}`);
    error.statusCode = 400;
    return error;
  }
  return null;
};

module.exports = validateObjectId;
