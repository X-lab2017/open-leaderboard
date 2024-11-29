# 企业社区级别大屏

这个目录下存放了企业社区级别大屏的数据文件和脚本。

 scripts/clickhouse_sql.py 脚本用于远程连接clickhouse获取数据。需要预先填写clickhouse登录信息。中间的query需要自行修改。

 scripts/metric_api.py 脚本用于获取openrank和活跃度的数据。