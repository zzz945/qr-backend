<template>
  <div style="width=100%;">
    <flexbox class="vux-1px-b">
      <flexbox-item :span="1/2">
        <div class="f-item">{{order.t_id}}号桌订单</div>
      </flexbox-item>
      <flexbox-item :span="1/2">
        <div class="f-item">共￥{{totalPrice}}</div>
      </flexbox-item>
    </flexbox>
    <flexbox class="vux-1px-b">
      <flexbox-item :span="1/2">
        <div class="f-item">菜名</div>
      </flexbox-item>
      <flexbox-item :span="1/4">
        <div class="f-item">价格</div>
      </flexbox-item>
      <flexbox-item :span="1/4">
        <div class="f-item">数量</div>
      </flexbox-item>
    </flexbox>
    <flexbox class="vux-1px-b" v-for="(idx, item) in foodList">
      <flexbox-item :span="1/2">
        <div class="f-item">{{ item.NAME }}</div>
      </flexbox-item>
      <flexbox-item :span="1/4">
        <div class="f-item">￥{{ parseInt(item.PRICE) * item.NUM }}</div>
      </flexbox-item>
      <flexbox-item :span="1/4">
        <div class="f-item">{{ 1 * item.NUM }}</div>
      </flexbox-item>
    </flexbox>
    <x-button class="bottom-box" text="打印订单" @click="print"></x-button>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, XButton } from '../components'
import { totalPrice } from '../vuex/getters'

export default {
  components: {
    Flexbox,
    FlexboxItem,
    XButton
  },
  vuex: {
    getters: {
      foodList: (state) => state.curOrder.content,
      totalPrice
    }
  },
  methods: {
    print () {
      console.log('print')
    }
  },
  ready () {
    console.log(this.foodList)
  }
}
</script>

<style lang="less" scoped>
  @import '../styles/index.less';
  @import '../styles/variable.less';

  .f-item {
    color: @theme-color-text;
    padding: 5px 5px;
  }
  .bottom-box {
    width: 100%;
    height: 48px;
    position: absolute;
    bottom: 0;
    z-index: 5001;
  }
</style>