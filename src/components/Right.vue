<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rigthsList" stirpe border style="width: 100%">
        <el-table-column type="index" label="序号" width="180"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
        <el-table-column prop="path" label="路径" width="180"></el-table-column>
        <el-table-column prop="level" label="等级">
          <el-template slot-scope="scope">
            <el-tag v-if="scope.row.level==0">一级</el-tag>
            <el-tag v-else-if="scope.row.level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </el-template>
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
    </el-card>
  </div>
</template>

<script>
// import mix from './Rights.mixins.js'
export default {
  // mixins:[mix]
  data() {
    return {
      rigthsList: [],
      querycdt: {
        qurey: '',
        pagenum: 1,
        pagesize: 5
      }
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list', {
        params: this.querycdt
      })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取列表失败',
          type: 'error',
          duration: 1000
        })
      }
    //   this.rigthsList = res.data
      this.querycdt.tot = res.data.total
      this.rigthsList = res.data
    },
    handleSizeChange(arg) {
      this.querycdt.pagesize = arg
      this.getUserInfos()
    },
    handleCurrentChange(arg) {
      this.querycdt.pagenum = arg
      this.getUserInfos()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
