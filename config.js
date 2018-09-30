
var environments = {};


environments.dev = {
  'httpPort' : 3080,
  'httpsPort' : 3443,
  'envName' : 'dev'
};

environments.prod = {
  'httpPort' : 80,
  'httpsPort' : 443,
  'envName' : 'prod'
};


var envVarEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to dev
var environment = typeof(environments[envVarEnvironment]) == 'object' ? environments[envVarEnvironment] : environments.dev;

// Export the module
module.exports = environment;
