---
title: 多表连接
---

## 牛客SQL213-查找所有员工的last_name和first_name以及对应的dept_name

#### 🔗
<a href="https://www.nowcoder.com/practice/5a7975fabe1146329cee4f670c27ad55?tpId=82&tqId=29771&rp=1&ru=/exam/company&qru=/exam/company&sourceUrl=%2Fexam%2Fcompany&difficulty=undefined&judgeStatus=undefined&tags=&title=">![20230512191543](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230512191543.png)</a>

#### 💡

三表查询，可存在 NULL，于是就 `FROM` 一个表，然后再额外连两个 `LEFT JOIN` 即可

#### ✅

```sql
SELECT 
    e.last_name,
    e.first_name,
    d1.dept_name
FROM 
    employees e
LEFT JOIN 
    dept_emp d2
ON 
    e.emp_no = d2.emp_no
LEFT JOIN
    departments d1
ON
    d2.dept_no = d1.dept_no;
```
<hr>
