// 获取右侧菜单id
var topleftnone = document.getElementById('topleftnone')
// 获取用户头像标签
var userheadimg = document.getElementById('userheadimg')
// 点击显示
userheadimg.onclick = function () {
    console.log('显示左边小菜单')
    topleftnone.style.left = '0px'
    // 隐藏右边的菜单
    topleftlist.style.right = '-40VW'
    topleftlistbodys.style.display = 'none'
}
topleftnoneright.onclick = function () {
    console.log('关闭左边小菜单【外】')
    topleftnone.style.left = '-100VW'
}
exitleft.onclick = function () {
    console.log('关闭左边小菜单【x】')
    topleftnone.style.left = '-100VW'
}

// 点击显示加号菜单
// 获取加号
var topusname = document.getElementById('topusname')
// 获取加号菜单
var topleftlist = document.getElementById('topleftlist')
var topleftlistbodys = document.getElementById('topleftlistbodys')
// 点击显示
topusname.onclick = function () {
    console.log(111)
    topleftlist.style.right = '0px'
    topleftlistbodys.style.display = 'block'
}
topleftlistbodys.onclick = function () {
    topleftlist.style.right = '-40VW'
    topleftlistbodys.style.display = 'none'
}