<template>
  <div style="width=100%;">
    <flexbox class="vux-1px-b">
      <flexbox-item :span="1/3">
        <div class="f-item">消息状态</div>
      </flexbox-item>
      <flexbox-item :span="1/3">
        <div class="f-item">桌牌号码</div>
      </flexbox-item>
      <flexbox-item :span="1/3">
        <div class="f-item">消息类型</div>
      </flexbox-item>
    </flexbox>
    <flexbox class="vux-1px-b" v-for="order in orderList" v-on:click="showOrder(order)">
      <flexbox-item :span="1/3">
        <div class="f-item">未读</div>
      </flexbox-item>
      <flexbox-item :span="1/3">
        <div class="f-item">{{ order.t_id + '号桌' }}</div>
      </flexbox-item>
      <flexbox-item :span="1/3">
        <div class="f-item">点餐</div>
      </flexbox-item>
    </flexbox>
    <flexbox class="vux-1px-b" v-for="msg in msgList" v-on:click="showMsg(msg)">
      <flexbox-item :span="1/3">
        <div class="f-item">未读</div>
      </flexbox-item>
      <flexbox-item :span="1/3">
        <div class="f-item">{{ msg.t_id + '号桌' }}</div>
      </flexbox-item>
      <flexbox-item :span="1/3">
        <div class="f-item">{{msg.type}}</div>
      </flexbox-item>
    </flexbox>
  </div>
</template>
<script>
import { Flexbox, FlexboxItem } from './components'
import * as actions from './vuex/actions'

const myarray = [
  {
    openid: 'oRcn4wF1K1KZc_eELqveTXpKTNuQ',
    r_id: '1'
  },
  {
    openid: 'oRcn4wBwTAXzYScKJxqrtsFEM97w',
    r_id: '2'
  },
  {
    openid: 'oRcn4wF2xiKZL1hGdS6IW4UOc6TQ',
    r_id: '3'
  }
]

var threadId

export default {
  components: {
    Flexbox,
    FlexboxItem
  },
  vuex: {
    actions: actions
  },
  data () {
    return {
      myarray: myarray,
      orderList: [],
      msgList: [],
      rId: '',
      title: '没有新消息'
    }
  },
  methods: {
    showOrder (order) {
      console.log('showOrder idx=' + order.idx)
      console.log(order)
      clearInterval(threadId)
      this.setCurOrder(order)
      let params = {
        idx: order.idx
      }
      this.$http.get('http://tdkjgzh.applinzi.com/Home/Qrorder/orderIsRead', {params: params}).then((response) => {
        console.log('orderIsRead:' + response.data)
      }, (response) => {
        console.log('orderIsRead failed:')
        console.log(response)
      })
      this.$route.router.go('/subpages/foodList')
    },
    showMsg (msg) {
      console.log('showMsg idx=' + msg.idx)
      console.log(msg)
      let params = {
        idx: msg.idx
      }
      let _this = this
      _this.$http.get('http://tdkjgzh.applinzi.com/Home/Qrwaiter/msgIsRead', {params: params}).then((response) => {
        console.log('msgIsRead:' + response.data)
        msg.new = false
      }, (response) => {
        console.log('msgIsRead failed:')
        console.log(response)
      })
    },
    getOrders (_this) {
      let params = {
        r_id: this.rId
      }

      _this.$http.get('http://tdkjgzh.applinzi.com/Home/Qrorder/getNewOrder', {params: params}).then((response) => {
        console.log('getNewOrder')
        console.log(response.data)
        if (response.data === '') {
          return
        }
        let strList = JSON.parse(response.data)
        _this.orderList = []
        for (let i = 0; i < strList.length; i++) {
          let order = {}
          order.idx = strList[i].idx
          order.openid = strList[i].openid
          order.r_id = strList[i].r_id
          order.t_id = strList[i].t_id
          order.is_new = strList[i].is_new
          order.food_list = []
          let foodList = JSON.parse(strList[i].food_list)
          for (let i = 0; i < foodList.length; i++) {
            order.food_list.push(JSON.parse(foodList[i]))
          }
          _this.orderList.push(order)
        }
        _this.title = '有新消息了'
        console.log('_this.orderList:')
        console.log(_this.orderList)
      }, (response) => {
        console.log('getNewOrder failed:')
        console.log(response)
      })

      _this.$http.get('http://tdkjgzh.applinzi.com/Home/Qrwaiter/getNewMsgs', {params: params}).then((response) => {
        console.log('getNewMsgs')
        console.log(response.data)
        if (response.data === '') {
          return
        }

        let strList = JSON.parse(response.data)
        _this.msgList = []
        for (let i = 0; i < strList.length; i++) {
          let msg = {}
          msg.idx = strList[i].idx
          msg.r_id = strList[i].r_id
          msg.t_id = strList[i].t_id
          msg.type = strList[i].type
          msg.new = strList[i].new
          _this.msgList.push(msg)
        }

        _this.title = '有新消息了'
        console.log('_this.msgList:')
        console.log(_this.msgList)
      }, (response) => {
        console.log('getNewMsgs failed:')
        console.log(response)
      })
    }
  },
  ready () {
    let openid = document.getElementById('arg_openid').innerHTML
    for (let i = 0; i < this.myarray.length; i++) {
      if (openid === myarray[i].openid) {
        this.rId = myarray[i].r_id
      }
    }

    if (this.rId === '') {
      this.$vux.alert.show({
        title: '错误',
        content: '很抱歉，您不是已注册客服人员',
        onHide () {
        }
      })
      return
    }

    let _this = this
    _this.getOrders(_this)
    threadId = setInterval(function () {
      _this.getOrders(_this)
    }, 60000)
  }
}
</script>

<style lang="less" scoped>
  @import './styles/index.less';
  @import './styles/variable.less';
  .f-item {
    color: @theme-color-text;
    padding: 5px 5px;
  }
</style>