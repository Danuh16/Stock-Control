const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes files to generate documentation for
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
