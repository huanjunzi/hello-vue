<template>
    <div>
        <Button type='primary' @click="handleRender('multi', '')" :loading="showButton" style='margin: 10px 0 10px -772px;'>批量编辑</Button>
        <div style='margin: 0 20% 0 20%;'>
        <Table :columns="historyColumns" :data="historyData" ref="selection"  @on-selection-change="selectChange" :row-class-name="rowClassName"></Table>
        <Page :total="dataCount" :page-size="pageSize" :current="pageNum" show-elevator show-sizer class="paging" @on-change="changepage" @on-page-size-change="handlePageSize"></Page>
        </div>
    </div>
</template>
<script>
    import {showModal} from '../modals'
    import tableEdit from './tableEdit'
    import _ from 'underscore'
    export default {
        data () {
            return {
                // 初始化信息总条数
                dataCount:0,
                // 每页显示多少条
                pageSize:10,
                // 当前页数
                pageNum: 1,
                selectedItems: [],
                // 批量按钮隐藏和显示
                showButton: false,
                historyColumns: [
                    {
                        type: 'selection',
                        width: 55,
                        align: 'center'
                    },
                    {
                        title: '名字',
                        key: 'name',
                        // className: 'demo-table-info-column'
                    },
                    {
                        title: '描述',
                        key: 'description'
                    },
                    {
                        title: '原价',
                        key: 'origin_price'
                    },
                    {
                        title: '现价',
                        key: 'price'
                    },
                    {
                        title: '库存',
                        key: 'stock',
                        render: (h, ctx) => {
                            if(!ctx.row.stock){
                                return <div>没有库存</div>
                            }
                            return ctx.row.stock               
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        type: 'error',
                        width: 180,
                        render: (h, ctx) => 
                        <div>
                            <a on-click={() => this.clickTest(ctx.row)} style="margin-right:10px">测试</a>
                            <a on-click={() => this.handleRender('single',ctx.row)} style="margin-right:10px">编辑</a>
                            <a on-click={() => this.clickDelete(ctx.row)}>删除</a>
                        </div>
                    }

                ],
                historyData: []
            }
        },
        created(){
            this.handleListApproveHistory();
        },
        methods:{
            // 获取历史记录信息
            async handleListApproveHistory(){
                let r = await this.$axios({
                methods: 'get',
                url: '/api/users/pageQuery',
                params: {
                    limit: 0,
                    offset: 0
                }
                }).then(res => res.data)
                if(r.rows.length < this.pageSize){
                    this.historyData = r.rows
                    return
                } 
                this.dataCount = r.rows.length
                this.historyData = r.rows.slice(0, this.pageSize)
            },
            async changepage(index){
                var _start = ( index - 1 ) * this.pageSize;
                var _end = this.pageSize;
                let r = await this.$axios({
                methods: 'get',
                url: '/api/users/pageQuery',
                params: {
                  limit : _start,
                  offset : _end
                }
                }).then(res => res.data)
                this.historyData = r.rows;
            },
            async handlePageSize(index){
              this.pageSize = index
              let _start = (this.pageNum  - 1) * index;
              let _end = this.pageNum  * index;
              let r = await this.$axios({
                methods: 'get',
                url: '/api/users/pageQuery',
                params: {
                  limit : _start,
                  offset : _end
                }
                }).then(res => res.data)
                this.historyData = r.rows;
            },
            selectChange(selection) {
            this.selectedItems = []
            _.extend(this.selectedItems, selection)
            // console.log(this.selectedItems)
            },
            async handleRender (type, rows) {
                if (type === 'multi') {
                if (!this.selectedItems.length) return this.$Message.error("请先选择项目")
                }
                this.showButton = true
                let data
                data = type === 'single' ?  rows : { data: this.selectedItems }
                let r = await showModal(tableEdit, { data, type }, { title: "单个编辑", width: 'default', styles: {top: '40px'} })
                this.showButton = false
                if(r) {
                    // 清空选中框数据
                    this.selectedItems = []
                    this.handleListApproveHistory()
                }
            },
            rowClassName (row, index) {
                if(row.stock === 5){
                   return 'demo-table-info-row';
                }
                return '';
            }
        }
    }
</script>

<style lang="less">
.layout-logo-left {
    width: 90%;
    margin: 15px auto;
    .text{
      color: #fff;
      font-weight: 300
    }
    text-align: center;
}
.paging{
      float:right;
      margin-top:10px;
  }
.ivu-menu.ivu-menu-dark.ivu-menu-vertical {
  height:100%; 
  position:absolute;
  left:0; top:0;
}
  .ivu-table td.demo-table-info-column{
        background-color: #2db7f5;
        color: #fff;
  }
  .ivu-table .demo-table-info-row td{
        background-color: #2db7f5;
        color: #fff;
  }
  .ivu-table .demo-table-error-row td{
        background-color: #ff6600;
        color: #fff;
  }
</style>
