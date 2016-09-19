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
    <flexbox class="vux-1px-b" v-for="(idx, msg) in msgList" v-on:click="showMsg(msg, idx)">
      <flexbox-item :span="1/3">
        <div :class="msgClass(msg)">{{msg.state}}</div>
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
      msgList: [],
      rId: ''
    }
  },
  computed: {
    btnNextDisabled () {
      if (this.status === 0) return true
      else return false
    }
  },
  methods: {
    msgClass (msg) {
      if (msg.state === '未读') return 'f-item-notice'
      else return 'f-item'
    },
    showMsg (msg, idx) {
      console.log('showMsg idx=' + msg.idx)
      console.log(msg)
      this.setCurOrder(msg)
      let params = {
        idx: msg.idx
      }
      this.$http.get('http://tdkjgzh.applinzi.com/Home/Qrorder/msgIsRead', {params: params}).then((response) => {
        console.log('msgIsRead:' + response.data)
      }, (response) => {
        console.log('msgIsRead failed:')
        console.log(response)
      })
      if (msg.type === '点餐') {
        clearInterval(threadId)
        this.$route.router.go('/subpages/foodList')
      } else {
        this.msgList[idx].state = '已读'
      }
    },
    getOrders (_this) {
      let params = {
        r_id: this.rId
      }

      _this.$http.get('http://tdkjgzh.applinzi.com/Home/Qrorder/getNewMsgs', {params: params}).then((response) => {
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
          msg.state = strList[i].state
          msg.type = strList[i].type
          if (msg.type === '点餐') {
            msg.openid = strList[i].openid
            msg.content = []
            let foodList = JSON.parse(strList[i].content)
            for (let i = 0; i < foodList.length; i++) {
              msg.content.push(JSON.parse(foodList[i]))
            }
          }

          _this.msgList.push(msg)
        }
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
    }, 30000)
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
  .f-item-notice {
    color: @theme-color-dianjing;
    padding: 5px 5px;
  }
</style>