<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
      <el-table :data="rolesList" stirpe border style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="level" label="操作" width="300">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              >编辑</el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delRoles(scope.row.id)"
              >删除</el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini">分配角色</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
          <el-form-item label="角色名称" prop="rolename">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roledesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible=false">取消</el-button>
          <el-button type="primary" @click="addUser">确定</el-button>
        </span>
      </el-dialog>
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
          <el-form-item label="角色名称" prop="rolename">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色权限" prop="roledesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogClose">取消</el-button>
          <el-button type="primary" @click="editRoles">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// import mix from './Rights.mixins.js'
export default {
  // mixins:[mix]
  data() {
    return {
      rolesList: [],
      addForm: {
        rolename: '',
        roledesc: ''
      },
      editForm: {
        roleId: 31,
        roleName: '',
        roleDesc: ''
      },
      addDialogVisible: false,
      editDialogVisible: false,
      addFormRules: {
        roleName: [
          // required:非空  message:错误提示  trigger:触发校验机制
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        roleDesc: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      editFormRules: {
        roleName: [
          // required:非空  message:错误提示  trigger:触发校验机制
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        roleDesc: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    editRoles() {
      // this.editDialogVisible = true
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          this.editForm
        )
        console.log(this.editForm.roleName)
        if (res.meta.status !== 200) {
          this.$message({
            message: '修改用户失败',
            type: 'error',
            duration: 1000
          })
        }
        console.log(res)
        this.editDialogVisible = false
        this.getRolesList()
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
      const { data: res } = await this.$http.get('roles/' + id)
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
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取列表失败',
          type: 'error',
          duration: 1000
        })
      }
      this.rolesList = res.data
    },
    async delRoles(id) {
      const cfm = await this.$confirm('确定要删除用户吗', '删除', {
        confirmButtonText: '确定',
        cancleButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (cfm === 'confirm') {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status === 200) {
          this.$message({
            message: '用户删除成功',
            type: 'success',
            duration: '1000'
          })
          this.getRolesList()
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
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message({
            message: '添加用户失败',
            type: 'error',
            duration: 1000
          })
        }
        this.addDialogVisible = false
        this.getRolesList()
        this.$refs.addFormRef.resetFields()
        this.$message({
          message: '添加用户成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    addDialogClose(done) {
      this.$refs.addFormRef.resetFields()
      done()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
