const mysql = require('mysql2');
const dbConfig = require('./dbConfig');

var poolConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    timezone: "+00:00",
    multipleStatements: true,
    port: process.env.MYSQL_PORT,
    dateStrings: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
};

var counter = 0;

exports.executeQueryData = (query, data, supportKey, callback) => {
    try {
        dbConfig.getConnection(function (error, connection) {
            if (error) {
                console.error("DB getConnection error in executeQueryData:", error);
                if (typeof callback === 'function') callback(error, null);
                return;
            }
            console.log(query, data);
            connection.query(query, data, function (err, results, fields) {
                connection.release();
                if (err) {
                    console.error("DB query error in executeQueryData:", err);
                }
                if (typeof callback === 'function') callback(err, results, fields);
            });
        });
    } catch (error) {
        console.error("Exception in executeQueryData:", error);
        if (typeof callback === 'function') callback(error, null);
    }
};

exports.executeQuery = (query, supportKey, callback) => {
    try {
        dbConfig.getConnection(function (error, connection) {
            if (error) {
                console.error("DB getConnection error in executeQuery:", error);
                if (typeof callback === 'function') callback(error, null);
                return;
            }
            connection.query(query, function (err, results, fields) {
                connection.release();
                if (err) {
                    console.error("DB query error in executeQuery:", err);
                }
                if (typeof callback === 'function') callback(err, results, fields);
            });
        });
    } catch (error) {
        console.error("Exception in executeQuery:", error);
        if (typeof callback === 'function') callback(error, null);
    }
};

exports.executeDML = (query, values, supportKey, con, callback) => {
    try {
        con.query(query, values, callback);
    } catch (error) {
        console.error("Error in executeDML:", error);
        if (typeof callback === 'function') callback(error, null);
    }
};

const queryAsync = (query) => {
    return new Promise((resolve, reject) => {
        dbConfig.getConnection((error, connection) => {
            if (error) {
                console.error("DB getConnection error in queryAsync:", error);
                return reject(error);
            }
            connection.query(query, (err, results) => {
                connection.release();
                if (err) {
                    console.error("DB query error in queryAsync:", err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    });
};

exports.executeQueryAsyncAwait = async (query, supportKey) => {
    try {
        console.log(query);
        const results = await queryAsync(query);
        return results;
    } catch (error) {
        console.error("Exception in executeQueryAsyncAwait:", error);
        throw error;
    }
};

const queryDataAsync = (query, data) => {
    return new Promise((resolve, reject) => {
        dbConfig.getConnection((error, connection) => {
            if (error) {
                console.error("DB getConnection error in queryDataAsync:", error);
                return reject(error);
            }
            connection.query(query, data, (err, results) => {
                connection.release();
                if (err) {
                    console.error("DB query error in queryDataAsync:", err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    });
};

exports.executeQueryDataAsyncAwait = async (query, data, supportKey) => {
    try {
        console.log(query, data);
        const results = await queryDataAsync(query, data);
        return results;
    } catch (error) {
        console.error("Exception in executeQueryDataAsyncAwait:", error);
        throw error;
    }
};

// connection related services

exports.openConnection = () => {
    var connection = mysql.createConnection(poolConfig);
    counter += 1;

    connection.on('error', (err) => {
        console.error("Standalone MySQL connection error:", err.code || err);
    });

    connection.connect((err) => {
        if (err) {
            console.error("Standalone connection connect error:", err);
        }
    });

    connection.beginTransaction((error) => {
        if (error) {
            console.error("Transaction error : ", error);
        }
    });

    return connection;
};

exports.rollbackConnection = (connection) => {
    try {
        if (connection) {
            connection.rollback(function () {
                console.log("Connection Rolled Back and Closed.");
                try {
                    connection.end();
                } catch (e) {
                    try { connection.destroy(); } catch (_) {}
                }
            });
        }
    } catch (error) {
        console.error("Exception in rollbackConnection : ", error);
        try {
            if (connection) connection.destroy();
        } catch (_) {}
    }
};

exports.commitConnection = (connection) => {
    try {
        if (connection) {
            connection.commit(function () {
                console.log("Connection Committed and Closed.");
                try {
                    connection.end();
                } catch (e) {
                    try { connection.destroy(); } catch (_) {}
                }
            });
        }
    } catch (error) {
        console.error("Exception in commitConnection : ", error);
        try {
            if (connection) connection.destroy();
        } catch (_) {}
    }
};