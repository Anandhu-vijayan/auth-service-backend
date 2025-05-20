const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Validate and parse request body with Zod
      req.body = schema.parse(req.body);
      next(); // Proceed to the next middleware or controller
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        // Return the first validation error message
        return res.status(400).json({
          success: false,   
          message: "Validation failed",
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      // Fallback for other unexpected errors
      return res.status(500).json({
        success: false,
        message: "Something went wrong during validation",
      });
    }
  };
};

module.exports = validateRequest;
