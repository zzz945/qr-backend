export function totalPrice (state) {
  let sum = 0
  console.log('totalPrice')
  let foodList = state.curOrder.content
  for (let i = 0; i < foodList.length; i++) {
    sum += parseInt(foodList[i].PRICE) * foodList[i].NUM
  }
  return sum
}
