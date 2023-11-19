---
title: 常用纯命令行操作
---

## 服务端

- 启动服务：`./zkServer.sh start`
- 查看服务状态：`./zkServer.sh status`
- 停止服务：`./skServer.sh stop`
- 重启服务：`./skServer.sh restart`

## 客户端

### 连接

默认 `./zkCli.sh` 一执行就是连接上了本机  
正常使用若不在一台主机上，执行 `./zkCli.sh -server <ip>:<port>`  
例如我的服务端在 10.211.55.16 上，端口号为 $2181$   
那么我应当执行 `./zkCli.sh -server 10.211.55.16:2181`

### 内置命令行操作

连接上之后会展开一个  

```sh
[zk: ip:port(CONNECTED) 0] ...
```

的命令行，在这里进行操作有如下几种命令

- 断开连接：`quit`
- 查看节点下的子节点：`ls <被查看的节点路径>`
- 创建节点：`create <节点路径> [节点数据]` ，注意这里的节点路径中父节点一定要存在
- 删除节点：
  - 安全删除（有子节点不执行）：`delete <节点路径>`
  - 强制删除（删除子树）：`deleteall <节点路径>`
- 获取节点数据：`get <节点路径>`
- 设置节点数据：`set <已存在节点> <数据>`

::: tip

这里我们给出一个例子，根据如下 yml 完成 zk 树的创建：  

```yml
/book:
  name: 《夏摩山谷》
  author: 
    name: 庆山
    birth: 19740711
  createTime: 201901
```

我们分别执行如下命令  

```sh
create /book
create /book/name 《夏摩山谷》
create /book/author
create /book/author/name 庆山
create /book/author/birth 19740711
create /book/createTime 201901
```

下面测试一下看看：  

```sh
# 构建 zk 树
[zk: localhost:2181(CONNECTED) 16] create /book
Created /book
[zk: localhost:2181(CONNECTED) 17] create /book/name 《夏摩山谷》
Created /book/name
[zk: localhost:2181(CONNECTED) 18] create /book/author
Created /book/author
[zk: localhost:2181(CONNECTED) 19] create /book/author/name 庆山
Created /book/author/name
[zk: localhost:2181(CONNECTED) 20] create /book/author/birth 19740711
Created /book/author/birth
[zk: localhost:2181(CONNECTED) 21] create /book/createTime 201901
Created /book/createTime

# 检查树结构
[zk: localhost:2181(CONNECTED) 22] ls /book
[author, createTime, name]
[zk: localhost:2181(CONNECTED) 23] ls /book/author
[birth, name]
# 检查树数据
[zk: localhost:2181(CONNECTED) 24] get /book/author/name
庆山
[zk: localhost:2181(CONNECTED) 25] get /book/name
《夏摩山谷》
```

测试成功 

:::

- 创建临时节点：`create -e <节点路径> [保存值]`
- 创建顺序节点：`create -s <节点路径> [保存值]`
- 查询节点信息：`ls -s <节点路径>`
  - `czxid`：节点被创建的事务 id
  - `ctime`：创建时间
  - `mzxid`：最后一次被更新的事务 id
  - `mtime：修改时间
  - `pzxid`：子节点列表最后一次被更新的事务 id
  - `cversion`：子节点的版本号
  - `dataversion`：数据版本号
  - `aclversion`：权限版本号
  - `ephemeralOwner`：
    - 当前节点是临时节点：创建临时节点的事务 id
    - 当前节点是持久节点：0
  - `dataLength`：节点存储的数据长度
  - `numChildren`：当前节点的子节点个数