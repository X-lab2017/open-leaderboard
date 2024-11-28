import pandas as pd
import requests
import re
from datetime import datetime, timedelta
from clickhouse_driver import Client

# 月度数据下载与聚合
def down_data_and_aggregate_monthly(url, org_repo_platform_df, metric):
    all_data = pd.DataFrame()
    current_date = datetime.now()
    recent_six_months = [(current_date - timedelta(days=30 * i)).strftime("%Y-%m") for i in range(6)]

    for index, row in org_repo_platform_df.iterrows():
        org_repo = row['repo_name']
        platform = row['platform']
        
        cur_url = f"{url}{platform}/{org_repo}/{metric}"
        response = requests.get(cur_url)
        
        if response.status_code == 200:
            data = response.json()
            filtered_data = {k: v for k, v in data.items() if re.match(r"^\d{4}-\d{2}$", k) and k in recent_six_months}
            
            rows = []
            for month, contributors in filtered_data.items():
                for contributor, value in contributors:
                    if value is None:
                        value = None  # Explicitly set to None if no value
                    rows.append([org_repo, month, contributor, value])

            df = pd.DataFrame(rows, columns=['org_repo', 't_month', 'contributor', 'value'])
            all_data = pd.concat([all_data, df], axis=0)
        else:
            print(f"Error: {cur_url} - HTTP Status Code: {response.status_code}")

    return all_data


# 年度数据下载与聚合
def down_data_and_aggregate_yearly(url, org_repo_platform_df, metrics_dict):
    """下载数据并按项目求和后聚合到一个DataFrame"""
    all_data = pd.DataFrame()  # 初始化空的DataFrame以聚合所有数据

    # 遍历每个仓库、平台和所需的指标
    for index, row in org_repo_platform_df.iterrows():
        org_repo = row['repo_name']
        platform = row['platform']
        
        repo_data = {'org_repo': org_repo, 'stars': 0, 'forks': 0, 'participants': 0, 'merged_PRs': 0}
        
        for metric, metric_name in metrics_dict.items():
            cur_url = f"{url}{platform}/{org_repo}/{metric}"
            response = requests.get(cur_url)
            
            if response.status_code == 200:
                data = response.json()
                # 只保留年份格式为 "yyyy" 的数据
                filtered_data = {k: v for k, v in data.items() if re.match(r"^\d{4}$", k)}
                
                # 计算当前指标的总和，并存储在repo_data字典中
                repo_data[metric_name] = sum(filtered_data.values())
            else:
                print(f"Error: {cur_url} - HTTP Status Code: {response.status_code}")

        # 将当前项目的数据添加到总体数据中
        all_data = pd.concat([all_data, pd.DataFrame([repo_data])], ignore_index=True)

    return all_data


# 保存数据到ClickHouse
def save_to_clickhouse(client, table_name, df, columns):
    """将数据保存到ClickHouse"""
    # 确保日期字段为字符串
    if 't_month' in df.columns:
        df['t_month'] = df['t_month'].astype(str)
    
    # 清空目标表
    client.execute(f"TRUNCATE TABLE {table_name}")

    # 转换为记录字典列表并插入
    records = df.where(pd.notnull(df), None).to_dict('records')
    client.execute(f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES", records)
    print(f"数据已成功保存到表 {table_name}")


# 从ClickHouse查询数据
def query_clickhouse(client, table_name):
    """从ClickHouse查询数据"""
    query = f"SELECT * FROM {table_name}"
    result = client.execute(query)
    return pd.DataFrame(result, columns=['org_repo', 't_month', 'contributor', 'value'])


# 从ClickHouse加载repo_name和platform列
def load_org_repo_platform_from_clickhouse(client, table_name):
    """从ClickHouse查询repo_name和platform列"""
    query = f"SELECT repo_name, platform FROM {table_name}"
    result = client.execute(query)
    return pd.DataFrame(result, columns=['repo_name', 'platform'])


if __name__ == '__main__':
    url = "https://oss.x-lab.info/open_digger/"  # 基础API URL
    metric_monthly = "activity_details.json"
    metrics_dict_yearly = {
        "stars.json": "stars",
        "technical_fork.json": "forks",
        "participants.json": "participants",
        "change_requests_accepted.json": "merged_PRs"
    }
    platform_project_mapping_table = 'platform_project_mapping'  # 存储repo_name和platform信息的表名
    aggregated_table_monthly = "REPO_activity_details"  # 月度聚合后的数据表名
    aggregated_table_yearly = "REPO_starfork_participant_data"  # 年度聚合后的数据表名

    # 连接到ClickHouse
    target_client = Client(
        host=dashboard_host,  # 目标服务器地址
        port=9000,  # ClickHouse 默认端口
        user=dashboard_user,  # 目标服务器用户名
        password=dashboard_password,  # 目标服务器密码
        database='opensource',  # 目标数据库名称
        send_receive_timeout=600
    )

    # 从ClickHouse表加载repo_name和platform列
    org_repo_platform_df = load_org_repo_platform_from_clickhouse(target_client, platform_project_mapping_table)

    # -------------------- 第一组指标：贡献者月度数据 --------------------
    all_data_monthly = down_data_and_aggregate_monthly(url, org_repo_platform_df, metric_monthly)
    # 保存月度数据到ClickHouse
    save_to_clickhouse(target_client, aggregated_table_monthly, all_data_monthly, ['org_repo', 't_month', 'contributor', 'value'])

    # -------------------- 第二组指标：star, fork, pr, participant数据 --------------------
    all_data_yearly = down_data_and_aggregate_yearly(url, org_repo_platform_df, metrics_dict_yearly)
    # 保存年度数据到ClickHouse
    save_to_clickhouse(target_client, aggregated_table_yearly, all_data_yearly, ['org_repo', 'stars', 'forks', 'participants', 'merged_PRs'])

    # -------------------- 第三组指标：代码变更月度数据 --------------------
    metrics_list_3 = ["code_change_lines_add.json", "code_change_lines_remove.json", "code_change_lines_sum.json"]
    all_data_3 = down_data_and_aggregate_monthly(url, org_repo_platform_df, metrics_list_3)
    aggregated_table_3 = "REPO_code_change_data"
    save_to_clickhouse(target_client, aggregated_table_3, all_data_3, ['org_repo', 't_month', 'code_change_lines_add', 'code_change_lines_remove', 'code_change_lines_sum'])

    # -------------------- 第四组指标：issues数据 --------------------
    metrics_list_4 = ["issues_new.json", "issues_closed.json", "issue_comments.json"]
    all_data_4 = down_data_and_aggregate_monthly(url, org_repo_platform_df, metrics_list_4)
    aggregated_table_4 = "REPO_issues_data"
    save_to_clickhouse(target_client, aggregated_table_4, all_data_4, ['org_repo', 't_month', 'issues_new', 'issues_closed', 'issue_comments'])

    # -------------------- 第五组指标：pr请求数据 --------------------
    metrics_list_5 = ["change_requests.json", "change_requests_accepted.json"]
    all_data_5 = down_data_and_aggregate_monthly(url, org_repo_platform_df, metrics_list_5)
    aggregated_table_5 = "REPO_pr_data"
    save_to_clickhouse(target_client, aggregated_table_5, all_data_5, ['org_repo', 't_month', 'change_requests', 'change_requests_accepted'])

    # -------------------- 第六组指标：活跃度，openrank与关注度数据 --------------------
    metrics_list_6 = ["activity.json", "openrank.json", "attention.json"]
    all_data_6 = down_data_and_aggregate_monthly(url, org_repo_platform_df, metrics_list_6)
    aggregated_table_6 = "REPO_aggregated_data"
    save_to_clickhouse(target_client, aggregated_table_6, all_data_6, ['org_repo', 't_month', 'activity', 'openrank', 'attention'])

    # -------------------- 第七组指标：最新月份活跃度、openrank数据 --------------------
    latest_data_7 = get_latest_data(all_data_6)
    latest_table_7 = "REPO_latest_month_data"
    save_to_clickhouse(target_client, latest_table_7, latest_data_7, ['org_repo', 't_month', 'activity', 'openrank', 'attention'])

    # -------------------- 查询ClickHouse --------------------
    print("查询月度聚合数据表：")
    aggregated_data_monthly = query_clickhouse(target_client, aggregated_table_monthly)
    print(aggregated_data_monthly.head())

    print("查询年度聚合数据表：")
    aggregated_data_yearly = query_clickhouse(target_client, aggregated_table_yearly)
    print(aggregated_data_yearly.head())

    print("查询代码变更数据表：")
    aggregated_data_3 = query_clickhouse(target_client, aggregated_table_3)
    print(aggregated_data_3.head())

    print("查询问题数据表：")
    aggregated_data_4 = query_clickhouse(target_client, aggregated_table_4)
    print(aggregated_data_4.head())

    print("查询拉取请求数据表：")
    aggregated_data_5 = query_clickhouse(target_client, aggregated_table_5)
    print(aggregated_data_5.head())

    print("查询活动与关注度数据表：")
    aggregated_data_6 = query_clickhouse(target_client, aggregated_table_6)
    print(aggregated_data_6.head())

    print("查询最新月份数据表：")
    latest_data_from_clickhouse = query_clickhouse(target_client, latest_table_7)
    print(latest_data_from_clickhouse.head())
