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


def fetch_and_upload_commitcount_to_clickhouse(csv_file_path):

    # Step 1: 生成 CSV 文件并填充数据
    with open(csv_file_path, 'w', newline='') as csvfile:
        fieldnames = ['community', 'month', 'commitcount']
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
                        date_trunc('month', t.created_at) AS month,
                        COUNT(pull_commits) AS commits_count
                    FROM events t
                    WHERE repo_name IN ('{repo_list}') AND type = 10 AND pull_merge_commit_sha IS NOT NULL
                    GROUP BY month
                    ORDER BY month;
                """

                # 执行查询并获取结果
                result = source_client.execute(query)

                # 将每一行结果写入 CSV，包含 community 名称
                for row in result:
                    month, commit_count = row
                    writer.writerow(
                        {'community': community, 'month': month, 'commitcount': commit_count})

    print(f"CSV 文件已创建：{csv_file_path}")

    # Step 2: 删除目标表并重新创建
    try:
        # 删除现有表
        target_client.execute("DROP TABLE IF EXISTS community_commit_count")
        print("旧表已删除")
    except Exception as e:
        print(f"删除表时出错: {e}")

    # 重新创建目标表
    create_table_query = """
    CREATE TABLE community_commit_count
    (
        community String,
        month DateTime,
        commitcount Int32
    ) ENGINE = MergeTree()
    ORDER BY (community, month);
    """
    target_client.execute(create_table_query)
    print("目标表已重新创建")

    # Step 3: 读取 CSV 文件并将数据插入到目标数据库
    with open(csv_file_path, 'r') as csvfile:
        csv_reader = csv.DictReader(csvfile)

        # 将 CSV 数据插入到目标 ClickHouse 表
        for row in csv_reader:
            # 构造插入的 SQL 语句
            insert_query = """
                INSERT INTO community_commit_count (community, month, commitcount)
                VALUES
            """
            values = f"('{row['community']}', '{row['month']}', {row['commitcount']})"
            target_client.execute(insert_query + values)

    print("CSV 数据已成功上传到目标 ClickHouse 数据库")


def fetch_and_upload_PRinfo_to_clickhouse(csv_file_path):
    # Step 1: 生成 CSV 文件并填充数据
    with open(csv_file_path, 'w', newline='') as csvfile:
        fieldnames = ['community', 'month',
                      'opened_count', 'merged_count', 'closed_count']
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
                        date_trunc('month', created_at) AS month,
                        COUNT(CASE WHEN action IN ('opened', 'reopened') THEN 1 ELSE NULL END) AS opened_count,
                        COUNT(CASE WHEN pull_merged_at IS NOT NULL THEN 1 ELSE NULL END) AS merged_count,
                        COUNT(CASE WHEN pull_merged_at IS NULL AND action = 'closed' THEN 1 ELSE NULL END) AS closed_count
                    FROM
                        events
                    WHERE repo_name IN ('{repo_list}') AND type = 10
                    GROUP BY month
                    ORDER BY month;
                """

                # 执行查询并获取结果
                result = source_client.execute(query)

                # 将每一行结果写入 CSV，包含 community 名称和查询结果的各列
                for row in result:
                    month, opened_count, merged_count, closed_count = row
                    writer.writerow({
                        'community': community,
                        'month': month,
                        'opened_count': opened_count,
                        'merged_count': merged_count,
                        'closed_count': closed_count
                    })

    print(f"CSV 文件已创建：{csv_file_path}")

    # Step 2: 删除目标表并重新创建
    try:
        # 删除现有表
        target_client.execute("DROP TABLE IF EXISTS community_PR_info")
        print("旧表已删除")
    except Exception as e:
        print(f"删除表时出错: {e}")

    # 重新创建目标表
    create_table_query = """
    CREATE TABLE community_PR_info
    (
        community String,
        month DateTime,
        opened_count Int32,
        merged_count Int32,
        closed_count Int32
    ) ENGINE = MergeTree()
    ORDER BY (community, month);
    """
    target_client.execute(create_table_query)
    print("目标表已重新创建")

    # Step 3: 读取 CSV 文件并将数据插入到目标数据库
    with open(csv_file_path, 'r') as csvfile:
        csv_reader = csv.DictReader(csvfile)

        # 将 CSV 数据插入到目标 ClickHouse 表
        for row in csv_reader:
            # 构造插入的 SQL 语句
            insert_query = """
                INSERT INTO community_PR_info (community, month, opened_count, merged_count, closed_count)
                VALUES
            """
            values = f"('{row['community']}', '{row['month']}', {row['opened_count']}, {row['merged_count']}, {row['closed_count']})"
            target_client.execute(insert_query + values)

    print("CSV 数据已成功上传到目标 ClickHouse 数据库")


def fetch_and_upload_contributorinfo_to_clickhouse(csv_file_path):
    # Step 1: 生成 CSV 文件并填充数据
    with open(csv_file_path, 'w', newline='') as csvfile:
        fieldnames = ['community', 'repository', 'contributorcount']
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
                    SELECT t.repo_name AS repository, COUNT(DISTINCT t.actor_login) AS contributorcount
                    FROM events t
                    WHERE repo_name IN ('{repo_list}') AND type = 10
                    GROUP BY t.repo_name;
                """

                # 执行查询并获取结果
                result = source_client.execute(query)

                # 将每一行结果写入 CSV，包含 community 名称和查询结果的各列
                for row in result:
                    repository, contributorcount = row
                    writer.writerow(
                        {'community': community, 'repository': repository, 'contributorcount': contributorcount})

    print(f"CSV 文件已创建：{csv_file_path}")

    # Step 2: 删除目标表并重新创建
    try:
        # 删除现有表
        target_client.execute(
            "DROP TABLE IF EXISTS community_contributor_info")
        print("旧表已删除")
    except Exception as e:
        print(f"删除表时出错: {e}")

    # 重新创建目标表
    create_table_query = """
    CREATE TABLE community_contributor_info
    (
        community String,
        repository String,
        contributorcount Int32
    ) ENGINE = MergeTree()
    ORDER BY (community, repository);
    """
    target_client.execute(create_table_query)
    print("目标表已重新创建")

    # Step 3: 读取 CSV 文件并将数据插入到目标数据库
    with open(csv_file_path, 'r') as csvfile:
        csv_reader = csv.DictReader(csvfile)

        # 将 CSV 数据插入到目标 ClickHouse 表
        for row in csv_reader:
            # 构造插入的 SQL 语句
            insert_query = """
                INSERT INTO community_contributor_info (community, repository, contributorcount)
                VALUES
            """
            values = f"('{row['community']}', '{row['repository']}', {row['contributorcount']})"
            target_client.execute(insert_query + values)

    print("CSV 数据已成功上传到目标 ClickHouse 数据库")

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


fetch_and_upload_commitcount_to_clickhouse(
    '../data/community_commit_count.csv')

fetch_and_upload_PRinfo_to_clickhouse('../data/community_PR_info.csv')

fetch_and_upload_contributorinfo_to_clickhouse(
    '../data/community_contributor_info.csv')
