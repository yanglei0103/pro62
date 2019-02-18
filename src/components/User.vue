<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            class="input-with-select"
            v-model="querycdt.query"
            :clearable="true"
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="110"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="70">
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            @change="changState(info.row.id,info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="querycdt.tot"
      ></el-pagination>
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        top="185px"
        :before-close="addDialogClose"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
          class="demo-rulesForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible=false">取消</el-button>
          <el-button type="primary" @click="addUser">确定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户弹出框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        top="185px"
        :before-close="editDialogCloseBefore"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogClose">取消</el-button>
          <el-button type="primary" @click="editUser">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserInfos()
  },
  methods: {
    editUser() {
      // this.editDialogVisible = true
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          this.editForm
        )
        if (res.meta.status !== 200) {
          this.$message({
            message: '修改用户失败',
            type: 'error',
            duration: 1000
          })
        }
        this.editDialogVisible = false
        this.getUserInfos()
        this.$refs.editFormRef.resetFields()
        this.$message({
          message: '修改用户成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    async showEditDialog(id) {
      this.editDialogVisible = true
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取用户信息失败',
          type: 'error',
          duration: 1000
        })
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogCloseBefore(done) {
      // console.log(this.$refs)
      this.$refs.editFormRef.resetFields()
      done()
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
    },
    async delUser(id) {
      const cfm = await this.$confirm('确定要删除用户吗', '删除', {
        confirmButtonText: '确定',
        cancleButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (cfm === 'confirm') {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status === 200) {
          this.$message({
            message: '用户删除成功',
            type: 'success',
            duration: '1000'
          })
          this.getUserInfos()
        } else {
          this.$message({
            message: '用户删除是失败',
            type: 'error',
            duration: '1000'
          })
        }
      }
    },
    addUser() {
      // console.log(this.$refs)
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message({
            message: '添加用户失败',
            type: 'error',
            duration: 1000
          })
        }
        this.addDialogVisible = false
        this.getUserInfos()
        this.$refs.addFormRef.resetFields()
        this.$message({
          message: '添加用户成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    async changState(uid, state) {
      const { data: res } = await this.$http.put(
        'users/' + uid + '/state/' + state
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    handleSizeChange(arg) {
      this.querycdt.pagesize = arg
      this.getUserInfos()
    },
    handleCurrentChange(arg) {
      this.querycdt.pagenum = arg
      this.getUserInfos()
    },
    async getUserInfos() {
      const { data: res } = await this.$http.get('users', {
        params: this.querycdt
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.querycdt.tot = res.data.total
      this.userInfos = res.data.users
    },
    addDialogClose(done) {
      this.$refs.addFormRef.resetFields()
      done()
    }
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('手机号码不能为空'))
      }
      if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(value)) {
        return callback(new Error('手机号码有误，请重新填写！'))
      } else {
        callback()
      }
    }
    return {
      keywords: '',
      userInfos: [],
      querycdt: {
        qurey: '',
        pagenum: 1,
        pagesize: 3
      },
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        eamil: '',
        moblie: ''
      },
      editForm: {
        username: '',
        eamil: '',
        moblie: ''
      },
      addFormRules: {
        username: [
          // required:非空  message:错误提示  trigger:触发校验机制
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }]
      },
      editFormRules: {
        username: [
          // required:非空  message:错误提示  trigger:触发校验机制
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
}
</style>
