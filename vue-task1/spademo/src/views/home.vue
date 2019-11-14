<template>

<el-container>
  <!-- <el-header>Header</el-header> -->

  <el-main>

     
    <el-button type="primary" @click="dialogFormVisible=true">添加</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="密码" prop="password"></el-table-column>
      <el-table-column align="right">
        <template slot="header">操作</template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="changePage"
      :page-size="limit"
      :total="total">
    </el-pagination>
  </el-main>

<el-dialog title="添加用户" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="姓名" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
         <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
     
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="curFun">确 定</el-button>
    </div>

</el-dialog>

  <!-- <el-footer>Footer</el-footer> -->
</el-container>

</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      total:0,//总数
      limit:3,  //page-size="limit"是页数，一页有几条
      pagenum:1,//第几页
        dialogFormVisible: false,
        form: {
          name: '',
          password: ''
        },
        id:null,
        formLabelWidth: '120px'
    };
  },
  created() {
    this.getData();//多次调用
  },
  methods: {
    //封装一个获取成员列表方法
    getData() {
      //请求数据库里所有的成员列表
      this.axios.get("/api/list",{params:{limit:this.limit,pagenum:this.pagenum}}).then(res => {
        console.log(res.data);
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    change(){

    },
    //修改
    handleEdit(index, row) {
      console.log(index, row);
      this.dialogFormVisible=true;   //打开弹框
      //row.id 要修改的
      this.id = row.id;
      this.form={
        name:row.name,
        password:row.password
      }
    },
    //删除
    handleDelete(index, row) {
      console.log(index, row); //index是下标，row是信息

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.axios.get("/api/del", { params: { id: row.id } }).then(res => {
            console.log(res);
            this.getData();//多次调用
              this.$message({
              type: "info",
              message: "删除成功"
            });
          });
        })
        .catch(() => {
            this.$message({
              type: "info",
              message: "取消删除"
            });
        });
    },
    curFun(){

      let url ="";

      //如果能拿到赋给row.id的this.id,它存在的话
      if(this.id){
        //修改
        url = "/api/update"
      }else{
        //添加
         url = "/api/add"
      }
      //添加的参数需注意
      this.axios.post(url,{...this.form,id:this.id}).then(res=>{
        console.log(res)
          if(res.data.code === 1){
              this.getData()//多次调用

              this.$message({
              type: "info",
              message: "添加成功"
            });
          }else{
            this.$message({
              type: "info",
              message:res.data.msg
            });
          }
           this.dialogFormVisible=false; //添加成功或者失败都得关掉弹框
           this.reset();//调用，是因为表单需清空一下
      })
    },
    //清空，只有添加完成，关闭弹框时清空表单
    reset(){
      this.form.name= '',
      this.form.password= ''
    },
    //分页
    changePage(cur){
      console.log(cur) //打印的是当前页
      this.pagenum = cur;
      this.getData()//多次调用
    }
  }
};
</script>

<style scoped>
</style>