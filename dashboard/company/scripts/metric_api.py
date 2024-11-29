import json
import requests
import pandas as pd
from datetime import datetime, timedelta

# 加载仓库名称
with open('../data/repository_names.json', 'r') as f:
    repo_dict = json.load(f)

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
for community, repos in repo_dict.items():
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

# 转换为DataFrame并保存为CSV
df = pd.DataFrame(data)
df.to_csv("../data/repository_data.csv", index=False)
print("数据已保存到 repository_data.csv")
