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

#### <img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/greencode1.png">

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
