var queryHandler = require("../helpers/query.js")
var response = require("../helpers/sendResponse.js")

async function getPost(req, res) {
    try {

        let limit = req.query.limit;
        let offset = req.query.offset;
        let userId = req.query.userId;
        let sql = `SELECT a.id, post_description,d.user,a.date_created,count( distinct b.id ) "like",
        count( distinct c.id ) "comment",
        case when sum( case when b.user_id = ${userId} then 1 else 0 end ) >0 then 1 else 0 end "liked"
        FROM tab_post a left join tab_likes b on a.id=b.post_id left join tab_comment c on a.id=c.post_id
        left join tab_user d on a.user_id=d.id group by id, post_description,date_created,d.user order by a.date_created desc limit ${limit} offset ${offset}`;

        let postData = await queryHandler.runQuery(sql);

        if (postData != null && postData.length > 0) {
            let data = [];
            postData.forEach(async(element) => {
                let opts = {
                    id: element.id,
                    userId: element.user_id,
                    user: element.user,
                    description: element.post_description,
                    dateCreated: element.date_created,
                    like: parseInt(element.like),
                    comment: parseInt(element.comment),
                    liked: parseInt(element.liked) 
                };
                data.push(opts);
            });
            response.sendResponse(res, response.responseStatus.success, response.responseMessage.success, data)
        }

    } catch (error) {
        console.log(error);
        response.sendResponse(res, response.responseStatus.somethingWentWrong, response.responseMessage.somethingWentWrong, error)
    }
}

async function createPost(req, res) {
    var transaction = await queryHandler.beginTransaction();

    try {
        let description = req.body.description;
        let user = req.body.userId;

        let sql = `SELECT * from tab_user where id = ${user}`;
        let userData = await queryHandler.runQuery(sql);

        if (userData != null && userData.length > 0) {

            sql = `INSERT INTO tab_post (post_description, user_id) values("${description}", ${user});`;
            let insertId = await queryHandler.runQuery(sql, transaction);
            await transaction.commit();
            
            if (insertId != null && insertId > 0) {
                // sql = `INSERT INTO tab_likes (post_id, user_id) values(${insertId}, ${user});`;

                // let likeInsertId = await queryHandler.runQuery(sql, transaction)

                // sql = `INSERT INTO tab_comment (post_id, user_id, ) values(${insertId}, ${user});`;

                // let commentInsertId = await queryHandler.runQuery(sql, transaction);

                // if(likeInsertId > 0 && commentInsertId > 0){

                sql = `SELECT tp.id id, tu.id user_id, tu.user, post_description, date_created FROM tab_post tp INNER join tab_user tu ON tp.user_id = tu.id where tp.id = ${insertId}`
                let postData = await queryHandler.runQuery(sql);

                if (postData == null || postData.length == 0) response.sendResponse(res, response.responseStatus.somethingWentWrong, response.responseMessage.somethingWentWrong, null)
                else response.sendResponse(res, response.responseStatus.success, response.responseMessage.success, {
                    id: postData[0].id,
                    userId: postData[0].user_id,
                    user: postData[0].user,
                    description: postData[0].post_description,
                    dateCreated: postData[0].date_created
                })
                return;

                // } else {
                //     response.sendResponse(res, response.responseStatus.somethingWentWrong, response.responseMessage.somethingWentWrong, null)
                // }

            } else {
                response.sendResponse(res, response.responseStatus.somethingWentWrong, response.responseMessage.somethingWentWrong, null)
            }

        } else {
            response.sendResponse(res, response.responseStatus.notFound, response.responseMessage.notFound, "USER NOT FOUND")
        }
        await transaction.rollback();
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        response.sendResponse(res, response.responseStatus.somethingWentWrong, response.responseMessage.somethingWentWrong, null)
    }
}
async function toggleLike(req, res) {
    let transaction = await queryHandler.beginTransaction();
    try {
        let postId = req.body.postId;
        let userId = req.body.userId;

        if(checkForPost(postId) == false) {
            response.sendResponse(res, response.responseStatus.notFound, response.responseMessage.notFound, "Post Doesn't Exist");
            return;
        }
        
        let sql = `SELECT id from tab_likes where post_id = ${postId} AND user_id =${userId}`;
        let data = await queryHandler.runQuery(sql);

        if (data == null || data.length == 0) {
            sql = `INSERT INTO tab_likes (post_id, user_id) values(${postId}, ${userId});`;
            let likeInsertId = await queryHandler.runQuery(sql,transaction);
            response.sendResponse(res, response.responseStatus.success, response.responseMessage.success, {id: likeInsertId});
        } else {
            data = data[0].id;
            sql = `DELETE FROM tab_likes where id = ${data};`;
            await queryHandler.runQuery(sql,transaction);
            response.sendResponse(res, response.responseStatus.success, response.responseMessage.success, null);
        }
        transaction.commit();
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        response.sendResponse(res, response.responseStatus.somethingWentWrong, response.responseMessage.somethingWentWrong, null)
    }
}
async function comment(req, res) {
    let transaction = await queryHandler.beginTransaction();
    try {
        let postId = req.body.postId;
        let userId = req.body.userId;
        let comment = req.body.comment;

        if(checkForPost(postId) == false) {
            response.sendResponse(res, response.responseStatus.notFound, response.responseMessage.notFound, "Post Doesn't Exist");
            return;
        }

        let sql = `INSERT INTO tab_comment (post_id, user_id, comment) values(${postId}, ${userId},"${comment}")`
        let insertId = await queryHandler.runQuery(sql,transaction);
        await transaction.commit();
        sql = sql = `SELECT date_created from tab_comment where id =${insertId}`;
        let data = await queryHandler.runQuery(sql);
        response.sendResponse(res, response.responseStatus.success, response.responseMessage.success, {dateCreated: data[0].date_created});

    } catch (error) {
        console.log(error);
        transaction.rollback();
        response.sendResponse(res, response.responseStatus.somethingWentWrong, response.responseMessage.somethingWentWrong, null)
    }
}

async function getComments(req, res) {
    try {
        let postId = req.query.postId;
        let limit = req.query.limit || 10;
        let offset = req.query.offset || 10;
        if(checkForPost(postId) == false) {
            response.sendResponse(res, response.responseStatus.notFound, response.responseMessage.notFound, "Post Doesn't Exist");
            return;
        }
        
        let data = await fetchComments(postId, limit, offset);
        response.sendResponse(res, response.responseStatus.success, response.responseMessage.success, data.sort((a,b)=> a.dateCreated>b.dateCreated ? 1:0));

    } catch (error) {
        console.error(error);
        response.sendResponse(res, response.responseStatus.somethingWentWrong, response.responseMessage.somethingWentWrong, null)
    }
}

async function checkForPost(postId) {
    let sql = `SELECT * from tab_post where id = ${postId}`;
    let data =  await queryHandler.runQuery(sql);
    return data[0] || false;
}

async function checkForUser(userId) {
    let sql = `SELECT * from tab_user where id = ${userId} OR user = ${userId}`;
    let data =  await queryHandler.runQuery(sql);
    return data[0] || false;
}
async function countLikes(postId){
    let sql = `SELECT count(*) as count from tab_likes where post_id = ${postId}`;
    let data =  await queryHandler.runQuery(sql);    
    return data[0].count || false;
}
async function fetchComments(postId,limit,offset){
    let sql = `SELECT tc.date_created as dateCreated, tc.comment, user from tab_comment tc inner join tab_user tu on tc.user_id = tu.id where post_id = ${postId} order by tc.date_created desc limit ${limit} offset ${offset}`;
    let data =  await queryHandler.runQuery(sql);
    // data = data.map(element => {
    //     delete element.post_id;
    // });
    return data;
}

async function countComments(postId){
    let sql = `SELECT count(*) as count from tab_comment where post_id = ${postId}`;
    let data =  await queryHandler.runQuery(sql);
    return data[0].count || false;
}

async function loginUser(req, res) {
    try {
        let user = req.query.user;
        let getUserSql = `SELECT * from tab_user where user="${user}";`;
        let userData = await queryHandler.runQuery(getUserSql);

        if (userData.length == 0) {
            createUserSql = `Insert into tab_user (user) values("${user}");`;
            userData = await queryHandler.runQuery(createUserSql);

            if (userData > 0) {
                userData = await queryHandler.runQuery(getUserSql);
                response.sendResponse(res, response.responseStatus.success, response.responseMessage.success, {
                    id: userData[0].id,
                    user: userData[0].user
                })
            } else {
                response.sendResponse(res, response.responseStatus.somethingWentWrong, response.responseMessage.somethingWentWrong, null)
            }
        } else {
            response.sendResponse(res, response.responseStatus.success, response.responseMessage.success, {
                id: userData[0].id,
                user: userData[0].user
            })
        }

    } catch (error) {
        console.log(error);
        response.sendResponse(res, response.responseStatus.somethingWentWrong, response.responseMessage.somethingWentWrong, null)
    }
}


module.exports = {
    getPost,
    loginUser,
    createPost,
    toggleLike,
    comment,
    getComments
}