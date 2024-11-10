import json
import csv
from clickhouse_driver import Client

# 配置远程 ClickHouse 的连接参数
client = Client(
    host='host',
    port=9000,  # ClickHouse 默认端口为 9000
    user='xlab',
    password='password',
    database='opensource'  # 数据库名称
)
print(client.execute("SHOW TABLES"))

# 从 JSON 文件中加载仓库名称
with open('../data/repository_names.json', 'r') as file:
    data = json.load(file)

# 准备输出 CSV 文件
with open('../data/community_mergedcount.csv', 'w', newline='') as csvfile:
    fieldnames = ['community', 'mergedcount']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    # 批处理大小（可根据实际需求调整）
    batch_size = 100

    # 处理每个社区及其仓库
    for community, repos in data.items():
        print(f"正在处理 {community} 社区的仓库")
        total_count = 0

        # 分批处理仓库列表
        for i in range(0, len(repos), batch_size):
            batch = repos[i:i + batch_size]
            repo_list = "', '".join(batch)

            # 创建查询语句
            query = f"""
                SELECT COUNT(DISTINCT t.issue_id) AS merged_pr_count FROM events t
                WHERE type = 10 AND pull_merged_at IS NOT NULL AND repo_name IN ('{repo_list}')
            """

            # 执行查询并获取结果
            result = client.execute(query)
            count = result[0][0] if result else 0
            total_count += count

        # 将社区和 star 总数写入 CSV
        writer.writerow({'community': community, 'mergedcount': total_count})

print("CSV 文件已创建：community_mergedcount.csv")
