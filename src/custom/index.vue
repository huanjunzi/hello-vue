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
    import {formatDate} from '../utils/timeFormat'

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
                filterValue: {},
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
                        sortable: true,
                    },
                    {
                        title: '描述',
                        key: 'description'
                    },
                    {
                        title: '原价',
                        key: 'origin_price',
                        sortable: true
                    },
                    {
                        title: '现价',
                        key: 'price',
                         filters: [
                            {
                            label: '现价',
                            value: '2'
                            },
                            {
                            label: '原价',
                            value: '36.8'
                            }
                        ],
                        filterRemote: function (value,row) {
                            // this.status = value;
                            this.filterValue["price"] = value
                            this.handleListApproveHistory()
                            
                            // console.log('filterValue', this.filterValue)
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        sortable: true,
                        render: (h, ctx) => {
                            return <div>{formatDate(ctx.row.create_time)}</div>
                        }
                    },
                    {
                        title: '库存',
                        key: 'stock',
                        render: (h, ctx) => {
                            if(!ctx.row.stock){
                                return <div>没有库存</div>
                            }
                            return <div>{ctx.row.stock}</div>             
                        },
                        filters: [{
                            label: "有库存",
                            value: 5 
                        },{
                            label: "没库存",
                            value: 0
                        }],
                        filterMethod(value, row) {
                            return row.stock === value
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
            this.handleListApproveHistory()
        },
        methods:{
            async pageSend(type,url,limit,offset,filterValue = {}){
                let r = await this.$axios({
                    methods: type,
                    url: url,
                    params: {
                        limit,
                        offset,
                        filter: filterValue
                    }
                }).then(res => res.data)
                // console.log('r==', r)
                return r
            },
            // 禁用复选框
            disabledRow(data){
                for (var i = 0; i < data.length; i++) {
                 if (+data[i].stock >= 5) {
                    data[i]._disabled = true // 设置复选框禁用
                    data[i]._checked= true // 设置复选框选中状态
                 }
                }
            },
            // 获取历史记录信息
            
            async handleListApproveHistory(){
                console.log('this.filterValue.price', this.filterValue.price)
                if(_.isEmpty(this.filterValue.price)) {
                    this.filterValue = {}
                }
                let r = await this.pageSend('get','/api/users/pageQuery',0,0,this.filterValue)
                if(r.rows.length < this.pageSize){
                    this.historyData = r.rows
                    this.dataCount = r.rows.length
                    return
                } 
                this.dataCount = r.rows.length
                this.historyData = r.rows.slice(0, this.pageSize)
                this.disabledRow(this.historyData)
            },
            async changepage(index){
                var _start = ( index - 1 ) * this.pageSize;
                var _end = this.pageSize;
                let r = await this.pageSend('get', '/api/users/pageQuery', _start, _end, this.filterValue)
                this.historyData = r.rows;
                if(!_.isEmpty(this.filterValue.price)) {
                   this.dataCount = r.rows.length
                }
                this.disabledRow(this.historyData)
            },
            async handlePageSize(index){
              this.pageSize = index
              let _start = (this.pageNum  - 1) * index;
              let _end = this.pageNum  * index;
                let r = await this.pageSend('get', '/api/users/pageQuery', _start, _end, this.filterValue)
                this.historyData = r.rows;
                if(!_.isEmpty(this.filterValue.price)) {
                   this.dataCount = r.rows.length
                }
                this.disabledRow(this.historyData)
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
