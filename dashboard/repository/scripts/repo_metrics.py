import pandas as pd
import requests
import re
from clickhouse_driver import Client


def down_data_and_aggregate(url, org_repo_platform_df, metrics_list):
    """下载数据并聚合到一个DataFrame"""
    all_data = pd.DataFrame()  # 初始化空的DataFrame

    for index, row in org_repo_platform_df.iterrows():
        org_repo = row['repo_name']
        platform = row['platform']

        # 遍历每个指标
        for metric in metrics_list:
            cur_url = f"{url}{platform}/{org_repo}/{metric}"
            response = requests.get(cur_url)

            if response.status_code == 200:
                data = response.json()
                filtered_data = {k: v for k, v in data.items() if re.match(r"^\d{4}-\d{2}$", k)}

                metric_name = metric.split('.')[0]  # 使用指标名去除扩展名
                df = pd.DataFrame(list(filtered_data.items()), columns=['t_month', metric_name])
                df['org_repo'] = org_repo
                all_data = pd.concat([all_data, df], axis=0)  # 聚合数据
            else:
                print(f"Error: {cur_url} - HTTP Status Code: {response.status_code}")

    # 聚合数据，按 "org_repo" 和 "t_month" 进行透视
    all_data = all_data.pivot_table(index=['org_repo', 't_month'], 
                                    values=[metric.split('.')[0] for metric in metrics_list],
                                    aggfunc='first').reset_index()

    return all_data


def get_latest_data(all_data):
    """获取每个项目最新一个月的数据"""
    all_data['t_month'] = pd.to_datetime(all_data['t_month'], format='%Y-%m')
    latest_data = all_data.sort_values('t_month').groupby('org_repo').tail(1)
    latest_data['t_month'] = latest_data['t_month'].dt.strftime('%Y-%m')
    return latest_data


def save_to_clickhouse(client, table_name, df):
    """将数据保存到ClickHouse"""
    client.execute(f"TRUNCATE TABLE {table_name}")
    records = df.to_dict('records')
    client.execute(f"INSERT INTO {table_name} (org_repo, t_month, activity, openrank, attention) VALUES", records)
    print(f"数据已成功保存到表 {table_name}")


def query_clickhouse(client, table_name):
    """从ClickHouse查询数据"""
    query = f"SELECT * FROM {table_name}"
    result = client.execute(query)
    return pd.DataFrame(result, columns=['org_repo', 't_month', 'activity', 'openrank', 'attention'])


def load_org_repo_platform_from_clickhouse(client, table_name):
    """从ClickHouse查询repo_name和platform列"""
    query = f"SELECT repo_name, platform FROM {table_name}"
    result = client.execute(query)
    return pd.DataFrame(result, columns=['repo_name', 'platform'])


if __name__ == '__main__':
    url = "https://oss.x-lab.info/open_digger/"  # 基础API URL
    metrics_list = ["activity.json", "openrank.json", "attention.json"]
    platform_project_mapping_table = 'platform_project_mapping'  # 存储repo_name和platform信息的表名

    # 连接到ClickHouse
    target_client = Client(
        host='47.116.118.218',
        port=9000,
        user='USERS',
        database='opensource',
        send_receive_timeout=600
    )

    # 从ClickHouse表加载repo_name和platform列
    org_repo_platform_df = load_org_repo_platform_from_clickhouse(target_client, platform_project_mapping_table)

    # 下载并聚合数据
    all_data = down_data_and_aggregate(url, org_repo_platform_df, metrics_list)

    # 获取最新月份数据
    latest_data = get_latest_data(all_data)

    # 保存聚合数据到ClickHouse
    aggregated_table = "REPO_aggregated_data"
    save_to_clickhouse(target_client, aggregated_table, all_data)

    # 保存最新月份数据到ClickHouse
    latest_table = "REPO_latest_month_data"
    save_to_clickhouse(target_client, latest_table, latest_data)

    # # 从ClickHouse查询聚合数据表
    # print("查询聚合数据表：")
    # aggregated_data_from_clickhouse = query_clickhouse(target_client, aggregated_table)
    # print(aggregated_data_from_clickhouse.head())

    # # 从ClickHouse查询最新月份数据表
    # print("查询最新月份数据表：")
    # latest_data_from_clickhouse = query_clickhouse(target_client, latest_table)
    # print(latest_data_from_clickhouse.head())