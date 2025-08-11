const mysql = require('mysql2');
const dbConfig = require('./dbConfig');
const util = require('util');

var poolConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    timezone: "+00:00",
    multipleStatements: true,
   // port:process.env.MYSQL_PORT,
    dateStrings: true
}


var counter = 0;

exports.executeQueryData = (query, data, supportKey, callback) => {

    try {
        dbConfig.getConnection(function (error, connection) {
            if (error) {
                console.log(error);

                throw error;
            }
            console.log(query, data);
            connection.query(query, data, callback);
            connection.on('error', function (error) {
            console.log("Con", connection);
                throw error;
                return;
            });
            
            connection.release();

        });

    } catch (error) {
        console.log("Exception  In : " + query + " Error : ", error);

    } finally {
        // dbConfig.end();
    }
}



// exports.executeQueryData = (query, data, supportKey, callback) => {
//     dbConfig.getConnection((error, connection) => {
//         if (error) {
//             console.error("Connection error:", error);
//             return callback(error, null);
//         }

//         console.log(query, data);

//         connection.query(query, data, (err, results) => {
//             // ✅ Always release the connection AFTER the query
//             connection.release();

//             if (err) {
//                 console.error("Query error:", err);
//                 return callback(err, null);
//             }

//             callback(null, results);
//         });

//         // ❌ DO NOT add `connection.on('error')` inside here
//     });
// };


exports.executeQuery = (query, supportKey, callback) => {
    try {
        dbConfig.getConnection(function (error, connection) {

            if (error) {
                throw error;
            }
           console.log("Con", connection);
            connection.query(query, callback);

            connection.release();


        })
    } catch (error) {
        error.log("error in execute query ", error)

    }

}

exports.executeDML = (query, values, supportKey, con, callback) => {
    try {

        con.query(query, values, callback)

    } catch (error) {
        console.log("Error ---- ", error);
    }

}



const queryAsync = util.promisify((query, callback) => {
    dbConfig.getConnection((error, connection) => {
        if (error) {
            callback(error);
            return;
        }
        connection.query(query, callback);
        connection.release();
    });
});

// Define the asynchronous version of executeQuery
exports.executeQueryAsyncAwait = async (query, supportKey) => {
    try {
        console.log(query);

        // const connection = await getConnectionAsync();

        const results = await queryAsync(query);

        // connection.release();

        return results;
    } catch (error) {
        console.log("Exception  In : " + query + " Error : ", error);
        throw error;
    }
};

const queryDataAsync = util.promisify((query, data, callback) => {
    dbConfig.getConnection((error, connection) => {
        if (error) {
            callback(error);
            return;
        }
        connection.query(query, data, callback);
        connection.release();
    });
});

exports.executeQueryDataAsyncAwait = async (query, data, supportKey) => {

    try {
        console.log(query, data);
        const results = await queryDataAsync(query, data);

      

        return results
    } catch (error) {
        console.log("Exception  In : " + query + " Error : ", error);
        throw error;
    }
};



// connection related services



exports.openConnection = () => {
    var connection = mysql.createConnection(poolConfig);
    counter += 1;

    connection.connect();
    connection.beginTransaction((error) => {
        if (error)
            console.log("Transaction error : ", error);
    });

    return connection;
}

exports.rollbackConnection = (connection) => {
    try {
        connection.rollback(function () {
            console.log(" Connection Released. ");
            //connection.release();
        });
    } catch (error) {
        console.log("Exception in rollbackConnection : ", error);
    }
}

exports.commitConnection = (connection) => {
    try {

        connection.commit(function () {
            connection.end();
        });
    } catch (error) {
        console.log("Exception in rollbackConnection : ", error);
    }
}