---
title: 自行建表查询
---

## 牛客SQL206-获取每个部门中当前员工薪水最高的相关信息

#### 🔗
<a href="https://www.nowcoder.com/practice/4a052e3e1df5435880d4353eb18a91c6?tpId=82&tqId=29764&rp=1&ru=/exam/oj&qru=/exam/oj&sourceUrl=%2Fexam%2Foj%3Fpage%3D1%26tab%3DSQL%25E7%25AF%2587%26topicId%3D82&difficulty=undefined&judgeStatus=undefined&tags=&title=">![20230509202522](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230509202522.png)</a>

#### 💡

薪水是部门中的最高薪水，来一张 (部门，最高薪水) 的表  

```sql
SELECT 
    d.dept_no,
    MAX(s.salary) maxSalary
FROM 
    dept_emp d,
    salaries s
WHERE
    d.emp_no = s.emp_no
GROUP BY d.dept_no
```

得到表 `t1`

| dept_no | maxSalary |
|---------|-----------|
| d001    |     88958 |
| d002    |     92527 |

紧接着我们需要组合进 “员工号” ，故再开一张 (员工号，部门，薪水) 的表

```sql
SELECT 
    d.dept_no,
    d.emp_no,
    s.salary
FROM 
    dept_emp d,
    salaries s
WHERE
    d.emp_no = s.emp_no
```

得到表 `t2`  

| dept_no | emp_no | salary |
|---------|--------|--------|
| d001    |  10001 |  88958 |
| d001    |  10002 |  72527 |
| d002    |  10003 |  92527 |

在 `t2` 中找能匹配到 `t1` 的项  
组合两表进行查询，令 `dept_no` 与 `salary` 均一致即可

#### ✅

```sql
SELECT 
	t1.dept_no,
	t2.emp_no,
	t1.maxSalary
FROM
	(
		SELECT 
			d.dept_no,
			MAX(s.salary) maxSalary
		FROM 
			dept_emp d,
			salaries s
		WHERE
			d.emp_no = s.emp_no
		GROUP BY d.dept_no
	) t1
	,
	(
		SELECT 
			d.dept_no,
			d.emp_no,
			s.salary
		FROM 
			dept_emp d,
			salaries s
		WHERE
			d.emp_no = s.emp_no
	) t2
WHERE
	t1.dept_no = t2.dept_no AND
	t1.maxSalary = t2.salary
ORDER BY
	t1.dept_no;
```
<hr>

## 牛客SQL215-查找在职员工自入职以来的薪水涨幅情况

#### 🔗
<a href="https://www.nowcoder.com/practice/fc7344ece7294b9e98401826b94c6ea5?tpId=82&tqId=29773&rp=1&ru=/exam/oj&qru=/exam/oj&sourceUrl=%2Fexam%2Foj%3Fpage%3D1%26tab%3DSQL%25E7%25AF%2587%26topicId%3D82&difficulty=undefined&judgeStatus=undefined&tags=&title=">![20230512194645](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230512194645.png)</a>

#### 💡

有涨幅，那就一定要做 在职现在的工资 和 刚入职时的工资 的差  
这可以分为两部分，我们先建立一下查询 **刚入职时的工资 `table: t_comein`**    
就是让 `salaries` 表的起始时间 `from_date` 和 `employees` 表的入职时间 `hire_date` 对应起来  

```sql
SELECT
    e.emp_no,
    s.salary
FROM
    employees e,
    salaries s
WHERE
    s.emp_no = e.emp_no AND
    s.from_date = e.hire_date
```

然后是 **在职现在的工资 `table: t_leave`**  
这个很好弄，就是保证 `to_date = '9999-01-01'` 即可  
然后为了和上面表格式一样，我们依然要把工号输出来  

```sql
SELECT
    s.emp_no,
    s.salary
FROM
    salaries s
WHERE 
    s.to_date = '9999-01-01'
```

在建的这两张表进行查询，让两表工号一致下，第二列为 `t_leave.salary - t_comein.salary`  即可  


#### ✅

```sql
SELECT 
    t_leave.emp_no,
    (t_leave.salary - t_comein.salary) as growth
FROM 
    (   
        SELECT
            e.emp_no,
            s.salary
        FROM
            employees e,
            salaries s
        WHERE
            s.emp_no = e.emp_no AND
            s.from_date = e.hire_date
    ) t_comein,
    (
        SELECT
            s.emp_no,
            s.salary
        FROM
            salaries s
        WHERE 
            s.to_date = '9999-01-01'
    ) t_leave
WHERE
    t_leave.emp_no = t_comein.emp_no
ORDER BY
    growth;
```
<hr>
