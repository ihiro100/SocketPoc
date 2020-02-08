// let mysql = require("mysql")

function runQuery(sql, transaction) {
    return new Promise((resolve, reject) => {
        if(transaction != null){
            sqlDbConnection.query(sql, {transaction: transaction}).then(([results, metadata]) => {
                // Results will be an empty array and metadata will contain the number of affected rows.
                console.log("SQL request:"+ sql + " Result: "+ JSON.stringify(results)  );
                resolve(results);
            }).catch((err)=>{
                console.error("SQL request: " + sql + "Error: "+ JSON.stringify(err) );
                reject(err)
            })
        } else {
            sqlDbConnection.query(sql).then(([results, metadata]) => {
                // Results will be an empty array and metadata will contain the number of affected rows.
                console.log("SQL request:"+ sql + " Result: "+ JSON.stringify(results)  );
                resolve(results);
            }).catch((err)=>{
                console.error("SQL request: " + sql + "Error: "+ JSON.stringify(err) );
                reject(err)
            })
        }
    })
}
async function beginTransaction() {
    return sqlDbConnection.transaction({autocommit:false});
}

module.exports = {
    runQuery,
    beginTransaction
}