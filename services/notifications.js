const db = require('../utilities/dbModule');



function reqData(req) {
    data = {

    }

    return data;
}

exports.get = (req, res) => {
    let supportKey = req.headers['supportkey'];
    const q = `select * from view_notifications where 1 AND BRANCH_ID = ${req.body.BRANCH_ID} AND USER_ID = ${req.body.USER_ID}  AND STATUS = '${req.body.STATUS}' order by CREATED_ON_DATETIME DESC`
    db.executeQuery(q, supportKey, (error, results) => {
        if (error) {
            console.log("error", error);

            res.send({
                "code": 400,
                "message": "Failed to get Notification info"
            })
        }
        else {
            res.send({
                "code": 200,
                "message": "OK",
                "data": results
            })

        }
    })

}

exports.create = (req, res) => {
    const supportKey = req.headers['supportkey'];


    const data = reqData(req);
    const q = `insert into notifications set ?`

    db.executeQueryData(q, req.body, supportKey, (error) => {

        if (error) {
            console.log("error", error);
            res.send({
                "code": 400,
                "message": "Failed to save notification information"
            })
        }
        else {
            res.send({
                "code": 200,
                "message": "notification information saved successfully"
            })

        }
    })



}

exports.update = (req, res) => {
    const supportKey = req.headers['supportkey'];


    const data = reqData(req);
    let setData = '';
    let recData = [];

    Object.keys(data).forEach(key => {
        setData += `${key} = ? ,`;
        recData.push(data[key]);
    });

    setData2 = setData.slice(0, -1);


    const q = `update notifications set ${setData2} where ID = ${req.body.ID}`
    db.executeQueryData(q, recData, supportKey, (error) => {
        if (error) {
            console.log(error);
            res.send({
                "code": 400,
                "message": "Failed to update notification info."
            })

        }
        else {
            res.send({
                "code": 200,
                "message": "notification information updated successfully"
            })

        }

    })


}

exports.getUserToNotify = (req, res) => {
    let supportKey = req.headers['supportkey'];
    if (req.body.BRANCH_ID && req.body.ROLE_ID) {
        let filter = ` AND BRANCH_ID = ${req.body.BRANCH_ID} AND ROLE_ID = ${req.body.ROLE_ID} `
        let query = `select ID, NAME from user_master where 1 ` + filter
        db.executeQueryData(query, '', supportKey, (error, results) => {
            if (error) {
                console.log("err", error);

                res.send({
                    "code": 400,
                    "message": "Error" + error,


                })

            }
            else {
                res.send({
                    "code": 200,
                    "message": "ok",
                    "data": results
                })
            }

        })
    }

}


exports.getProposal = (req, res) => {
    let supportKey = req.headers['supportkey'];
    if (req.body.APPLICANT_ID && req.body.BRANCH_ID) {
        let filter = ` AND CREATED_BRANCH_ID = ${req.body.BRANCH_ID} AND ID = ${req.body.APPLICANT_ID} `
        let query = `select * from basic_details where 1 ` + filter
        db.executeQueryData(query, '', supportKey, (error, results) => {
            if (error) {
                console.log("err", error);

            }
            else {
                res.send({
                    "code": 200,
                    "message": "ok",
                    "data": results
                })
            }
        })
    }

}

exports.closeNotification = (req, res) => {
    try {
        let supportKey = req.headers['supportkey'];
        if (req.body.NOTIFICATION_ID) {
            let NotificationId = req.body.NOTIFICATION_ID;

            let query = `Update notifications set STATUS = 'H' where ID = ?`

            db.executeQueryData(query, NotificationId, supportKey, (error, results) => {
                if (error) {
                    res.send({
                        "code": 400,
                        "message": "Failed to close notification"
                    })
                }
                else {
                    res.send({
                        "code": 200,
                        "message": "notification closed successful"
                    })
                }

            })


        }else{
            res.send({
                "code": 404,
                "message": "notification data not found"
            })
        }

    } catch (error) {
        console.log("err ali", error);
        
        res.send({
            "code": 400,
            "message": "Error"
        })
    }


}