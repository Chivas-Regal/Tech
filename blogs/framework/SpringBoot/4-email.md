---
title: SpringBoot 邮件发送功能
---

## 前置准备：创建邮箱第三方登录密码

第三方工具登录邮箱发送邮件时，采用的是另一种可生成的密码  
创建第三方登录密码方式：  
1. 进入邮箱点击设置
2. 找到第三方服务模块并开启

![20231019190517](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231019190517.png)

3. 开启后会给出一个授权码，请妥善保管起来  

## SpringBoot配置

### 导入坐标

SpringBoot中存在简化配置mail信息的软件包  
将其坐标导入我们自己的项目中

```xml
<!-- pom.xml -->

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

### 配置属性

下面是 `application.yml` 的配置属性，已经逐个给出了注释说明  

```yml
# application.yml

spring:
  mail:
    host: smtp.qq.com # SMTP服务器主机地址
    username: chivas-regal@qq.com # SMTP服务器的登录用户（源邮箱地址）
    password: j.......bh # SMTP服务器的登录密码（为第三方登录给出的授权码）
    properties:
      mail:
        smtp:
          auth: true # 使用 AUTH 命令对用户进行身份验证
          # 下面这组保证必须使用 STARTTLS 将连接进行 tls 保护
          starttls:
            enable: true
            required: true
    default-encoding: UTF-8 # 邮件的默认编码
```

## 邮件本身的JavaBean

封装一个邮件的实体JavaBean，一个邮件需要  
- 发件人
- 收件人
- 主题
- 内容

其中发件人我们之前配置过了一个总的，这里就不装配了  
于是构建出下面一个 `Mail` 类

```java
// Mail.java

@Data
public class Mail implements Serializable {
    private static final long serialVersionUID = 4359709211352400087L;

    private String recipient; // 接收人

    private String subject; // 主题

    private String content; // 内容
}
```

## 发邮件的工具

我们上面的 starter 依赖实际上提供了一个 IoC 中的实例 `JavaMailSender`  
它会读取我们之前在配置文件中写好的信息在 Spring 启动时完成初始化  
且有一个 `send(SimpleMailMessage)` 功能可以用来发送邮件    
  
而参数 `SimpleMailMessage` 类则确定了我们上面提到的四要素：发件人、收件人、主题、内容  
第一个配置中有可以直接 `@Value` 获取，后面三个是动态的，我们装到 `Mail` 里面作为参数传入  
下面我们封装一个 Bean 工具类来简化我们调用  

```java
// MailUtils.java

@Component
@Slf4j
public class MailUtils {

    /* 发件人 */
    @Value("${spring.mail.username}")
    private String sender;

    /* IoC 中已经初始化好的邮件发送类 */
    @Autowired
    private JavaMailSender javaMailSender;

    /* 调用 mail 中的参数发送邮件 */
    public void sendMail (Mail mail) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            /* 四大要素的装配 */
            mailMessage.setFrom(sender);
            mailMessage.setTo(mail.getRecipient());
            mailMessage.setSubject(mail.getSubject());
            mailMessage.setText(mail.getContent());
            /* 邮件，发送！ */
            javaMailSender.send(mailMessage);
            log.info("邮件发送成功，收件人: {}", mail.getRecipient());
        } catch (Exception e) {
            log.error("邮件发送失败 {}", e.getMessage());
            throw new CustomException("邮件发送失败");
        }
    }
}
```

当然可以根据我们的需求做几个工具方法  
这里要实现一个登录的功能，所以做一个验证码的随机创建  

```java
// MailUtils.java

public class MailUtils {
    ...

    /* 按下面的 chars 生成随机不重复验证码 */
    public static String randomCode () {
        Character[] chars = new Character[]{
                '2', '3', '4', '5', '6', '7', '8', '9',
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        };
        /* 打乱集合顺序 */
        List<Character> list = Arrays.asList(chars);
        Collections.shuffle(list);
        /* 取中间 5 个 */
        StringBuilder string = new StringBuilder();
        for (char c : list) {
            string.append(c);
        }
        return string.substring(3, 8);
    }

    ...
}
```

## 测试使用

做一个如下的邮件(这个收件人换成自己的就行)    
邮件是支持 html 格式定制样式的  

```html
---
收件人：1411390466@qq.com
---
主题：平台登录验证
---

<div style="width: 100%; text-align: center;">
    <img style="width: 50%;" src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/f62fbb8f1cf266017e561c66bca0855c.gif"/>
</div>
<h4>来自snopzyz：</h4>


    亲爱的用户，你好
    这里是移动端登录窗口，请用以下验证码完成登录
        <p align="center" style="font-weight: bold; font-size: 20px;">[随机生成的code]</p>
    请在收到邮件的十分钟内使用，否则将过期失效
    感谢配合 ❤️

---
```

下面是将三块内容分别状态 `Mail` 的三个属性内，将 `Mail` 发送  
进行测试

```java
// CommonTest.java

@SpringBootTest
public class CommonTest {

    @Autowired
    private MailUtils mailUtils;

    @Test
    public void sendMailTest () {
        /* 设置发件人和随机的code */
        String dstMail = "1411390466@qq.com";
        String code = MailUtils.randomCode();

        Mail mail = new Mail();
        /* 发件人 */
        mail.setRecipient(dstMail);
        /* 主题 */
        mail.setSubject("平台登录验证");
        /* 内容 */
        mail.setContent("<div style=\"width: 100%; text-align: center;\">" +
                "<img style=\"width: 50%;\" src=\"https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/f62fbb8f1cf266017e561c66bca0855c.gif\"/>" +
                "</div>\n" +
                "<h4>来自snopzyz：</h4>\n\n" +
                "    亲爱的用户，你好！\n\n" +
                "    这里是移动端登录窗口，请用以下验证码完成登录\n" +
                "        <p align=\"center\" style=\"font-weight: bold; font-size: 20px;\">" + code + "</p>\n" +
                "    请在收到邮件的十分钟内使用，否则将过期失效\n\n" +
                "    感谢配合 ❤️");
        /* 发送邮件 */
        mailUtils.sendMail(mail);
    }
}
```

收到了，是可行的，测试通过  

![20231019201729](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231019201729.png)

<img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/d62e821f7199280c40fef23fb957d8c2_720.png" style="width: 40%;">