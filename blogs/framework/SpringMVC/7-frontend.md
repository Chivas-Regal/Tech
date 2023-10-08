---
title: SSM 前端加入
---

这里给出 vue 下的动作函数

```js
// books.html.<script>

var vue = new Vue({

    el: '#app',
    data:{
        pagination: {},
        dataList: [],//当前页要展示的列表数据
        formData: {},//表单数据
        dialogFormVisible: false,//控制表单是否可见
        dialogFormVisible4Edit:false,//编辑表单是否可见
        rules: {//校验规则
            type: [{ required: true, message: '图书类别为必填项', trigger: 'blur' }],
            name: [{ required: true, message: '图书名称为必填项', trigger: 'blur' }]
        }
    },

    //钩子函数，VUE对象初始化完成后自动执行
    created() {
        this.getAll();
    },

    methods: {
        //列表
        getAll() {},

        //弹出添加窗口
        handleCreate() {},

        //重置表单
        resetForm() {},

        //添加
        handleAdd () {},

        //弹出编辑窗口
        handleUpdate(row) {},

        //编辑
        handleEdit() {},

        // 删除
        handleDelete(row) {}
    }
})
```
后面的所有向后端发送数据的操作主要都是以 **axois异步提交，按对应的格式（路径变量、请求体内塞json）发送到我们后台指定的接收地址**

## getAll()

这个函数主要负责将后台查询数据填到前台显示的列表内，可以利用axois向我们的/books发送get无参请求

```js
getAll () {
  axois.get("/books").then((res) => {
  })
},
```
在提交后也就是里面的 =>{} 内，执行前台dataList列表用我们后端返回的 json 形式的 res 赋值
res 对应格式为：`res.data: {"data": [...], "code": ..., "msg": "..."}`

```js
	...
	this.dataList = res.data.data;
	...
```
那么这个函数的完整内容就是

```js
// books.html : vue.getAll()

  //列表
  getAll() {
      axios.get("/books").then((res) => {
          this.dataList = res.data.data
      })
  },
```
## handleCreate() & resetForm()

* handleCreate() 负责的就是把添加窗口弹出，对应我们变量的 `dialogFormVisible`，将其设置为 true
我们的添加窗口内不能有之前在这个窗口内填写的数据，就调用一下 resetForm() 进行清空即可
* resetForm() 就是清空填写的表单数据，将其设置为空对象

<p></p>

```js
// books.html : vue.handleCreate() & resetForm()

  //弹出添加窗口
  handleCreate() {
      this.dialogFormVisible = true;
      this.resetForm();
  },
  //重置表单
  resetForm() {
      this.formData = {};
  },
```

## handleAdd()

这个就是我们其中一个大头-**数据添加**了

我们利用 post 将 json 数据放入请求体内进行发送

```js
// books.html : vue.handleAdd()

  //添加
  handleAdd () {
      axios.post("/books", this.formData).then((res) => {
  },
```
这里 res 内容依旧是 `res.data: {"data": [...], "code": ..., "msg": "..."}`，这是我们后端返回的，不会变化
我们需要根据 code 来判断是否成功（20011）

* 成功的话弹出成功窗口，并关闭添加窗口（设置为 false）
* 失败的话弹失败窗口

最后再将数据回显到列表中，调用 getAll()

```js
// books.html : vue.handleAdd()

  //添加
  handleAdd () {
      axios.post("/books", this.formData).then((res) => {
          if (res.data.code === 20011) { // 成功
              /* 弹出成功窗口，并给出后端返回的信息 */
              this.$message.success(res.data.msg);
              /* 关闭添加窗口 */
              this.dialogFormVisible = false;
          } else { // 失败
              /* 弹出失败窗口，并给出后端返回的信息 */
              this.$message.error(res.data.msg);
          }
      }).finally(() => {
          /* 数据回显 */
          this.getAll();
      });
  },
```
## handleUpdate(row)

这里有一个 row 参数，在 html 表单中具备的内容有 `row{id, type, name, description)`

这里弹出的窗口内的信息输入框中需要已经有我们对应行的信息
所以要按 id 先进行查询（路径变量），然后将数据填到输入表单中并将其打开

```js
// books.html : vue.handleUpdate(row)

  //弹出编辑窗口
  handleUpdate(row) {
      /* 向 /books/<id> 发送 get 请求按 id 查询 */
      axios.get("/books/" + row.id).then((res) => {
          /* 数据填写到 formData 上 */
          this.formData = res.data.data;
          /* 打开输入表单 */
          this.dialogFormVisible4Edit = true;
      })
  },
```
在这之后我们就可以进行我们下面的编辑操作了

## handleEdit()

编辑用的是 put 操作将 formData 中的数据作为 json 放入请求体内传给后端
然后就和我们的添加操作是一样的道理了

```js
// books.html : vue.handleEdit()

  //编辑
  handleEdit() {
      /* 向 /books 发送 put 请求，请求体内的 json 为 formData */
      axios.put("/books", this.formData).then((res) => {
          if (res.data.code === 20031) { // 成功
              this.$message.success(res.data.msg) // 给出成功提示框
              this.dialogFormVisible4Edit = false;	// 关闭输入表单
          } else {	// 失败
              this.$message.error(res.data.msg) // 给出失败提示框
          }
      }).finally (() => {
          this.getAll(); // 数据回显
      });
  },
```
## handleDelete(row)

这个大差不差，主要是外面要包一层删除确认框

利用 $confirm 来实现，如果取消删除被 catch 到了要报一个 message.info 来提示取消操作

```js
// books.html : vue.handleDelete(row)

  // 删除
  handleDelete(row) {
      this.$confirm("永久删除，操作不可逆，是否确定删除《" + row.name  + "》？", "提示", {
          type: 'info'
      }).then(() => {
          /* !! 这里是删除业务 !! */
      }).catch(() => {
          this.$message.info("取消删除操作")
      })
  }
```
那么删除业务就和我们的更新业务很像，只是用 delete 请求完成的

```js
// books.html : vue.handleDelete(row) : 删除业务

 axios.delete("/books/" + row.id).then((res) => {
    if (res.data.code === 20021) {
        this.$message.success(res.data.msg);
    } else {
        this.$message.error(res.data.msg);
    }
}).finally(() => {
    this.getAll();
});
```
合并起来的代码就是

```java
  // 删除
  handleDelete(row) {
      this.$confirm("永久删除，操作不可逆，是否确定删除《" + row.name  + "》？", "提示", {
          type: 'info'
      }).then(() => {
          axios.delete("/books/" + row.id).then((res) => {
              if (res.data.code === 20021) {
                  this.$message.success(res.data.msg);
              } else {
                  this.$message.error(res.data.msg);
              }
          }).finally(() => {
              this.getAll();
          });
      }).catch(() => {
          this.$message.info("取消删除操作")
      })
  }
```
