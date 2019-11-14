const router = require('koa-router')()
const query = require('../db/query')

router.get('/api/list', async ctx => {
        // let data = await query('select * from zsgc')
        // console.log(data)
        // return ctx.body = data;
        //查第一页的数据 pagenum=1   limit=5,意思是 一页有5条
        try {
            let { pagenum = 1, limit = 3 } = ctx.query;
            let startIndex = (pagenum - 1) * limit;
            //查询总条数
            let totalData = await query('select count(*) from zsgc')
            console.log(totalData.data[0]['count(*)'])

            let data = await query(`select * from zsgc limit ${startIndex},${limit}`)

            ctx.body = { code: 1, data: data.data, total: totalData.data[0]['count(*)'] }
        } catch (e) {
            ctx.body = { code: 0, msg: e.message }
        }
    })
    //添加
router.post('/api/add', async ctx => {
    let { name, password } = ctx.request.body;
    //需要向数据库里插入几个值
    let sql = 'insert into  zsgc (name,password) values(?,?)'
    if (!name || !password) {
        return ctx.body = { code: 3, msg: '缺少参数' }
    }
    //查找有没有name
    let isData = await query('select * from zsgc where name=?', [name])
    if (isData.data.length) {
        return ctx.body = { code: 2, msg: '此人已添加' }
    } else {
        let data = await query(sql, [name, password])
        if (data.msg === 'success') {
            ctx.body = { code: 1, msg: '添加成功' }
        } else {
            ctx.body = { code: 0, msg: '添加失败' }
        }
    }
})

//删除
router.get('/api/del', async ctx => {
    let { id } = ctx.query;
    let data = await query('select * from zsgc where id=?', [id])
    if (data.data.length) {
        let res = await query('delete from zsgc where id=?', [id])
        console.log(res)
        if (res.msg === 'success') {
            ctx.body = { code: 1, msg: '删除成功' }
        } else {
            ctx.body = { code: 0, msg: '删除失败' }
        }

    } else {
        return ctx.body = { code: 2, msg: '没有此人' }
    }
})

//修改
router.post('/api/update', async ctx => {
    let { name, password, id } = ctx.request.body;
    console.log(ctx.request.body)
    if (!name || !password || !id) {
        return ctx.body = { code: 2, msg: '缺少参数' }
    }

    let res = await query('update zsgc u set u.name=?,u.password=? where id=?', [name, password, id])
    if (res.msg === 'success') {
        ctx.body = { code: 1, msg: '修改成功' }
    } else {
        ctx.body = { code: 0, msg: '修改失败' }
    }
})
module.exports = router;