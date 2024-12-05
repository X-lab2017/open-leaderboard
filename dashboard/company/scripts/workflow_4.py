import json
import csv
import requests
import os
import pandas as pd
from datetime import datetime, timedelta
from clickhouse_driver import Client

# 从环境变量中获取数据库信息
xlabDB_host = os.getenv('DB_HOST')
xlabDB_user = os.getenv('DB_USER')
xlabDB_password = os.getenv('DB_PASSWORD')

dashboard_host = os.getenv('DASHBOARDS_DB_HOST')
dashboard_user = os.getenv('DASHBOARDS_DB_USER')
dashboard_password = os.getenv('DASHBOARDS_DB_PASSWORD', '').strip()


def fetch_and_upload_contributorcount_by_month_to_clickhouse(csv_file_path):
    # Step 1: 生成 CSV 文件并填充数据
    with open(csv_file_path, 'w', newline='') as csvfile:
        fieldnames = ['community', 'repository', 'month', 'count']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        # 批处理大小（可根据实际需求调整）
        batch_size = 100

        # 处理每个社区及其仓库
        for community, repos in data.items():
            print(f"正在处理 {community} 社区的仓库")

            # 分批处理仓库列表
            for i in range(0, len(repos), batch_size):
                batch = repos[i:i + batch_size]
                repo_list = "', '".join(batch)

                # 创建查询语句
                query = f"""
                    SELECT 
                        repo_name,
                        formatDateTime(created_at, '%Y-%m') AS month,
                        COUNT(DISTINCT actor_id) AS count
                    FROM 
                        events
                    WHERE 
                        repo_name IN ('{repo_list}') AND
                        formatDateTime(created_at, '%Y-%m') > '2021-06'
                    GROUP BY 
                        repo_name, 
                        formatDateTime(created_at, '%Y-%m')
                    ORDER BY 
                        month;
                """

                # 执行查询并获取结果
                result = source_client.execute(query)

                # 将每一行结果写入 CSV，包含 community 名称和查询结果的各列
                for row in result:
                    repo_name, month, count = row
                    writer.writerow({
                        'community': community,
                        'repository': repo_name,
                        'month': month,
                        'count': count
                    })

    print(f"CSV 文件已创建：{csv_file_path}")

    # Step 2: 读取 CSV 文件并筛选出每个 community 中贡献者数最多的前5个仓库
    data = pd.read_csv(csv_file_path)

    # 筛选出每个 community 中 count 最高的前 5 个不同的 repository
    top_repos = (data.sort_values(by=['community', 'count'], ascending=[True, False])
                 .drop_duplicates(subset=['community', 'repository'])
                 .groupby('community')
                 .head(5)['repository'])

    # 从原始数据中过滤出这些 top repository 对应的所有行（包括所有月份）
    filtered_data = data[data['repository'].isin(top_repos)]

    # 将筛选后的数据保存到新的 CSV 文件
    filtered_csv_file_path = 'filtered_community_contributorbymonth.csv'
    filtered_data.to_csv(filtered_csv_file_path, index=False)
    print(f"筛选后的数据已保存为新的 CSV 文件：{filtered_csv_file_path}")

    # Step 3: 删除目标表并重新创建
    try:
        # 删除现有表
        target_client.execute(
            "DROP TABLE IF EXISTS filtered_community_contributor_count")
        print("旧表已删除")
    except Exception as e:
        print(f"删除表时出错: {e}")

    # 重新创建目标表
    create_table_query = """
    CREATE TABLE filtered_community_contributor_count
    (
        community String,
        repository String,
        month String,
        count Int32
    ) ENGINE = MergeTree()
    ORDER BY (community, repository, month);
    """
    target_client.execute(create_table_query)
    print("目标表已重新创建")

    # Step 4: 读取筛选后的 CSV 文件并将数据插入到目标数据库
    with open(filtered_csv_file_path, 'r') as csvfile:
        csv_reader = csv.DictReader(csvfile)

        # 将筛选后的 CSV 数据插入到目标 ClickHouse 表
        for row in csv_reader:
            # 构造插入的 SQL 语句
            insert_query = """
                INSERT INTO filtered_community_contributor_count (community, repository, month, count)
                VALUES
            """
            values = f"('{row['community']}', '{row['repository']}', '{row['month']}', {row['count']})"
            target_client.execute(insert_query + values)

    print("筛选后的 CSV 数据已成功上传到目标 ClickHouse 数据库")


def fetch_and_upload_api_data_to_clickhouse(csv_file_path):
    # 获取最近6个月的日期
    def get_last_six_months():
        today = datetime.today()
        return [(today - timedelta(days=30 * i)).strftime('%Y-%m') for i in range(6)][::-1]

    last_six_months = get_last_six_months()

    # API请求的基础URL模板
    activity_url_template = "https://oss.x-lab.info/open_digger/github/{}/activity.json"
    openrank_url_template = "https://oss.x-lab.info/open_digger/github/{}/openrank.json"

    # 数据存储
    data = []

    # 从URL获取数据并过滤最近六个月的数据
    def fetch_and_filter(url, months):
        try:
            response = requests.get(url)
            response.raise_for_status()
            json_data = response.json()
            return {month: json_data.get(month, None) for month in months}
        except requests.RequestException as e:
            print(f"请求失败 {url}: {e}")
            return {month: None for month in months}

    # 遍历每个社区和仓库
    for community, repos in data.items():
        for repo_name in repos:
            print(f"处理仓库: {repo_name}")

            # 获取数据
            activity_url = activity_url_template.format(repo_name)
            openrank_url = openrank_url_template.format(repo_name)

            activity_data = fetch_and_filter(activity_url, last_six_months)
            openrank_data = fetch_and_filter(openrank_url, last_six_months)

            # 将数据存储到目标格式
            for month in last_six_months:
                data.append({
                    "community": community,
                    "repo_name": repo_name,
                    "month": month,
                    "activity": activity_data.get(month),
                    "openrank": openrank_data.get(month)
                })

    # 转换为DataFrame
    df = pd.DataFrame(data)

    # 删除 activity 和 openrank 列中有空值的行
    df_cleaned = df.dropna(subset=['activity', 'openrank'])

    # 保存清洗后的结果到 CSV 文件
    df_cleaned.to_csv(csv_file_path, index=False)
    print(f"数据已保存到 {csv_file_path}")

    # Step 2: 删除目标表并重新创建
    try:
        # 删除现有表
        target_client.execute(
            "DROP TABLE IF EXISTS community_repository_data_cleaned")
        print("旧表已删除")
    except Exception as e:
        print(f"删除表时出错: {e}")

    # 重新创建目标表
    create_table_query = """
    CREATE TABLE community_repository_data_cleaned
    (
        community String,
        repo_name String,
        month String,
        activity String,
        openrank String
    ) ENGINE = MergeTree()
    ORDER BY (community, repo_name, month);
    """
    target_client.execute(create_table_query)
    print("目标表已重新创建")

    # Step 3: 读取清洗后的 CSV 文件并将数据插入到目标数据库
    with open(csv_file_path, 'r') as csvfile:
        csv_reader = csv.DictReader(csvfile)

        # 将清洗后的 CSV 数据插入到目标 ClickHouse 表
        for row in csv_reader:
            # 构造插入的 SQL 语句
            insert_query = """
                INSERT INTO community_repository_data_cleaned (community, repo_name, month, activity, openrank)
                VALUES
            """
            values = f"('{row['community']}', '{row['repo_name']}', '{row['month']}', '{row['activity']}', '{row['openrank']}')"
            target_client.execute(insert_query + values)

    print("清洗后的 CSV 数据已成功上传到目标 ClickHouse 数据库")


# 配置源 ClickHouse 的连接参数
source_client = Client(
    host=xlabDB_host,
    port=9000,
    user=xlabDB_user,
    password=xlabDB_password,
    database='opensource'
)

# 配置目标 ClickHouse 的连接参数
target_client = Client(
    host=dashboard_host,  # 目标服务器地址
    port=9000,  # ClickHouse 默认端口
    user=dashboard_user,  # 目标服务器用户名
    password=dashboard_password,  # 目标服务器密码
    database='opensource'  # 目标数据库名称
)

with open('../data/repository_names.json', 'r') as file:
    data = json.load(file)


fetch_and_upload_contributorcount_by_month_to_clickhouse(
    '../data/community_contributorbymonth.csv')

fetch_and_upload_api_data_to_clickhouse(
    '../data/community_repository_data_cleaned.csv')
