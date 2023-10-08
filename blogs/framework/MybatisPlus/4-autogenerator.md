---
title: 快速生成 —— 代码生成器
---

这是一种简化开发的工具  
旨在通过扫描数据表信息，利用模板帮助我们构建出 `controller, dao, domain, server` 包的所有代码  
使用之前导入坐标  

```xml
<!-- pom.xml -->

<!--代码生成器-->
<dependency>
   <groupId>com.baomidou</groupId>
   <artifactId>mybatis-plus-generator</artifactId>
   <version>3.4.1</version>
</dependency>

<!-- velocity模板引擎 -->
<dependency>
   <groupId>org.apache.velocity</groupId>
   <artifactId>velocity-engine-core</artifactId>
   <version>2.3</version>
</dependency>
```

然后做一个可运行 main 程序，里面内容和需要配置的如下  

```java
// App.java

public class App {
    public static void main(String[] args) {
        /* 自动生成器 */
        AutoGenerator autoGenerator = new AutoGenerator();

        DataSourceConfig dataSource = new DataSourceConfig();
        dataSource.setDriverName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/learn_info?serverTimezone=UTC");
        dataSource.setUsername("root");
        dataSource.setPassword("***************");
        autoGenerator.setDataSource(dataSource);

        /*
           全局设置
        */
        GlobalConfig globalConfig = new GlobalConfig();
        /* 设置代码生成位置 */
        globalConfig.setOutputDir(System.getProperty("user.dir") + "/src/main/java");
        /* 设置代码生成后是否打开对应目录 */
        globalConfig.setOpen(false);
        /* 设置作者 */
        globalConfig.setAuthor("snopzyz");
        /* 设置文件生成是否覆盖原始生成文件 */
        globalConfig.setFileOverride(true);
        /* 设置数据层接口名，%s是占位符指代模块名 */
        globalConfig.setMapperName("%sDao");
        /* 设置数据层主键生成策略 */
        globalConfig.setIdType(IdType.AUTO);
        autoGenerator.setGlobalConfig(globalConfig);

        /*
           包设置
        */
        PackageConfig packageConfig = new PackageConfig();
        /* 设置包名 */
        packageConfig.setParent("com.snopzyz");
        /* 设置实体类包名 */
        packageConfig.setEntity("domain");
        /* 设置数据层接口包名 */
        packageConfig.setMapper("dao");
        autoGenerator.setPackageInfo(packageConfig);

        /*
           策略设置
        */
        StrategyConfig strategyConfig = new StrategyConfig();
        /* 设置参与生成的数据表名 */
        strategyConfig.setInclude("tbl_book");
        /* 设置数据库表的前缀，后面省略 */
        strategyConfig.setTablePrefix("tbl_");
        /* 设置是否开启 REST */
        strategyConfig.setRestControllerStyle(true);
        /* 设置乐观锁属性 */
        strategyConfig.setVersionFieldName("version");
        /* 设置逻辑删除属性 */
        strategyConfig.setLogicDeleteFieldName("deleted");
        /* 设置是否开启 lombok */
        strategyConfig.setEntityLombokModel(true);
        autoGenerator.setStrategy(strategyConfig);

        autoGenerator.execute();
    }
}
```

然后直接运行即可生成这样一份程序  

![20231007202032](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231007202032.png)