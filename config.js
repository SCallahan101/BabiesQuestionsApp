"use strict";
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://boardCreator619:board123@ds111025.mlab.com:11025/questionsboard';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test_database_url';
exports.PORT = process.env.PORT || 4747;
