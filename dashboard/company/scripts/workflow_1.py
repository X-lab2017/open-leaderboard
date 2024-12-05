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


def fetch_and_upload_starcount_to_clickhouse(csv_file_path):
    # 准备输出 CSV 文件
    with open(csv_file_path, 'w', newline='') as csvfile:
        fieldnames = ['community', 'starcount']
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
                    SELECT count(*) FROM events
                    WHERE type = 14 AND repo_name IN ('{repo_list}')
                """

                # 执行查询并获取结果
                result = source_client.execute(query)
                count = result[0][0] if result else 0
                total_count += count

            # 将社区和 star 总数写入 CSV
            writer.writerow({'community': community, 'starcount': total_count})

    print(f"CSV 文件已创建：{csv_file_path}")

    # Step 2: 删除目标表并重新创建
    try:
        # 删除现有表
        target_client.execute("DROP TABLE IF EXISTS community_star_count")
        print("旧表已删除")
    except Exception as e:
        print(f"删除表时出错: {e}")

    # 重新创建目标表
    create_table_query = """
    CREATE TABLE community_star_count
    (
        community String,
        starcount Int32
    ) ENGINE = MergeTree()
    ORDER BY community;
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
                INSERT INTO community_star_count (community, starcount)
                VALUES
            """
            values = f"('{row['community']}', {row['starcount']})"
            target_client.execute(insert_query + values)

    print("CSV 数据已成功上传到目标 ClickHouse 数据库")


def fetch_and_upload_forkcount_to_clickhouse(csv_file_path):
    # 准备输出 CSV 文件
    with open(csv_file_path, 'w', newline='') as csvfile:
        fieldnames = ['community', 'forkcount']
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
                    SELECT count(*) FROM events
                    WHERE type = 4 AND repo_name IN ('{repo_list}')
                """

                # 执行查询并获取结果
                result = source_client.execute(query)
                count = result[0][0] if result else 0
                total_count += count

            # 将社区和 fork 总数写入 CSV
            writer.writerow({'community': community, 'forkcount': total_count})

    print(f"CSV 文件已创建：{csv_file_path}")

    # Step 2: 删除目标表并重新创建
    try:
        # 删除现有表
        target_client.execute("DROP TABLE IF EXISTS community_fork_count")
        print("旧表已删除")
    except Exception as e:
        print(f"删除表时出错: {e}")

    # 重新创建目标表
    create_table_query = """
    CREATE TABLE community_fork_count
    (
        community String,
        forkcount Int32
    ) ENGINE = MergeTree()
    ORDER BY community;
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
                INSERT INTO community_fork_count (community, forkcount)
                VALUES
            """
            values = f"('{row['community']}', {row['forkcount']})"
            target_client.execute(insert_query + values)

    print("CSV 数据已成功上传到目标 ClickHouse 数据库")


def fetch_and_upload_mergedPRcount_to_clickhouse(csv_file_path):
    # 准备输出 CSV 文件
    with open(csv_file_path, 'w', newline='') as csvfile:
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
                result = source_client.execute(query)
                count = result[0][0] if result else 0
                total_count += count

            # 将社区和 fork 总数写入 CSV
            writer.writerow(
                {'community': community, 'mergedcount': total_count})

    print(f"CSV 文件已创建：{csv_file_path}")

    # Step 2: 删除目标表并重新创建
    try:
        # 删除现有表
        target_client.execute("DROP TABLE IF EXISTS community_mergedPR_count")
        print("旧表已删除")
    except Exception as e:
        print(f"删除表时出错: {e}")

    # 重新创建目标表
    create_table_query = """
    CREATE TABLE community_mergedPR_count
    (
        community String,
        mergedcount Int32
    ) ENGINE = MergeTree()
    ORDER BY community;
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
                INSERT INTO community_mergedPR_count (community, mergedcount)
                VALUES
            """
            values = f"('{row['community']}', {row['mergedcount']})"
            target_client.execute(insert_query + values)

    print("CSV 数据已成功上传到目标 ClickHouse 数据库")


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

fetch_and_upload_starcount_to_clickhouse('../data/community_star_count.csv')

fetch_and_upload_forkcount_to_clickhouse('../data/community_fork_count.csv')

fetch_and_upload_mergedPRcount_to_clickhouse(
    '../data/community_mergedPR_count.csv')
