---
title: 案例：MySQL数据迁移
---

我们用 <a href="https://github.com/Chivas-Regal/Tech/raw/main/static/es/tb_hotel.sql" download>黑马给出的酒店数据<Badge type="tip" text="download" vertical="top" /></a> 进行演示  
用这个 sql 文件生成 tb_hotel 表。  

如何获取到表内的数据这里就不说了，就是 Mybatis 的那一套，不会的请自行翻阅 [Mybatis学习](../../framework/Mybatis/0-quickstart.html)。  
这里生成了一个 `HotelService` 做业务类，用 `getAll()` 可以查询出 `List<Hotel>` 数据。  

主要思路与重心要放在索引库的创建 与 数据从MySQL读出并写入ES。  

## 索引创建

根据 sql 中字段的属性
- `id` 酒店id
- `name` 酒店名称
- `address` 酒店地址
- `price` 酒店价格
- `score` 酒店评分
- `brand` 酒店品牌
- `city` 所在城市
- `star_name` 酒店星级，1星到5星，1钻到5钻
- `business` 商圈
- `latitude` 纬度
- `longitude` 经度
- `pic` 酒店图片

生成 es 中索引库 hotels 的字段映射。  

将编号、地址、品牌、城市、商圈、图片、星级这种一体的作为关键字，不对具体地址和图片这种太精细的值设置倒排索引。    
酒店名称、品牌、商圈应是可以放在一起查询的，所以将品牌和商圈都 `copy_to` 进一个字段 `all` 中创建倒排索引。   
酒店地理位置用字段 `location` 表示，类型为 `geo_point`，直接从 MySQL 中 `latitude` 和 `longitude` 中取出。  
至于评分和价格都是使用 `integer` 即可。  

```json
{
    "mappings": {
        "properties": {
            "id": {
                "type": "keyword"
            },
            "name": {
                "type": "text",
                "analyzer": "ik_max_word",
                "copy_to": "all"
            },
            "address": {
                "type": "keyword",
                "index": false
            },
            "price": {
                "type": "integer"
            },
            "score": {
                "type": "integer"
            },
            "brand": {
                "type": "keyword",
                "copy_to": "all"
            },
            "city": {
                "type": "keyword"
            },
            "starName": {
                "type": "keyword"
            },
            "business": {
                "type": "keyword",
                "copy_to": "all"
            },
            "location": {
                "type": "geo_point"
            },
            "pic": {
                "type": "keyword",
                "index": false
            }
        }
    }
}
```

## 数据体

这里因为 `location` 的原因，es数据体和mysql数据体有些出入，所以根据索引再写一个es用的数据体，并做一个 `of()` 方法来转换 `Hotel` 类。  

```java
@Data
public class HotelDoc {

    private Long id;

    private String name;

    private String address;

    private Integer price;

    private Integer score;

    private String brand;

    private String city;

    private String starName;

    private String business;

    private String location;

    private String pic;

    public static HotelDoc of (Hotel hotel) {
        HotelDoc hotelDoc = new HotelDoc();
        hotelDoc.setId(hotel.getId());
        hotelDoc.setName(hotel.getName());
        hotelDoc.setAddress(hotel.getAddress());
        hotelDoc.setPrice(hotel.getPrice());
        hotelDoc.setScore(hotel.getScore());
        hotelDoc.setBrand(hotel.getBrand());
        hotelDoc.setCity(hotel.getCity());
        hotelDoc.setStarName(hotel.getStarName());
        hotelDoc.setBusiness(hotel.getBusiness());
        // 地理位置格式转换
        hotelDoc.setLocation(hotel.getLatitude() + ", " + hotel.getLongitude());
        hotelDoc.setPic(hotel.getPic());
        return hotelDoc;
    }

}
```

## 数据取出与填入

数据取出就是直接使用 `getAll()` 就行。  
而填入就要用到之前说的文档的插入了，为了更加具备线上保证网络性能的方式，这里使用分批的批量插入。  

```java
// 索引库创建，HOTEL_MAPPINGS就是上面索引库的json格式
CreateIndexRequest createIndexRequest = new CreateIndexRequest("hotels");
createIndexRequest.source(HOTEL_MAPPINGS, XContentType.JSON);
client.indices().create(createIndexRequest, RequestOptions.DEFAULT);

// 文档 id
AtomicInteger hotelId = new AtomicInteger();
// 分批发送（20个为一批）
Lists.partition(hotelService.getAll(), 20).forEach(hotelList -> {
    // 批量插入的请求对象
    BulkRequest batchReq = new BulkRequest();
    for (Hotel hotel : hotelList) {
        // 数据转换，并填入插入对象中
        HotelDoc hotelDoc = HotelDoc.of(hotel);
        batchReq.add(new IndexRequest("hotels")
                .id(String.valueOf(hotelId.incrementAndGet()))
                .source(JSON.toJSONString(hotelDoc), XContentType.JSON)
        );
    }
    try {
        // 发送请求做保存
        client.bulk(batchReq, RequestOptions.DEFAULT);
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
});
```

这段代码执行完之后，可以在 postman 上发一个查询全部的 DSL 看一下数据。  

![20240106214518](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240106214518.png)

可以看到数据已经成功插入到创建的 hotels 索引库中了，并且 location 也变成了我们需要的格式。  