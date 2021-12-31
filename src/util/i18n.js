import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          // here we will place our translations...
          navBar:{
              enterprise: 'Enterprise',
              project: 'Project',
              bot: 'Bot'
          },
          month:'Monthly',
          year:'Yearly',
          rank:'Rank',
          company:'company',
          project:'project',
          bot:'bot',
          activity:'Activity',
          influence:'Influence',
          details:'details',
          showMore:'show more',
          noMore:'no more',
          analysisConclusion:'The table below shows the OpenIsight-Index rankings for GitHub activity and influence up to end of November 2021. Positions are compared to the rankings at the end of October. As for activity The top 4 leading organizations remain consistent this month with QingCloud progressing well above their closest neighbour’s growth figures，Contrastingly Alibaba, JD and Bytedance also see a decline in their activity this month. As for influence... ',
          contributeProject:'miss your project?',
          contributeCompany:'miss your company?',
          tip:'miss your item?',
          introduction:'Welcome to OpenInsight-Index, where Chinese companys, projects ant robot accounts are ranked by the activity and influence on GitHub, the leading source code repository for free and open source (FOSS) projects.',
          updateTime:'Updated December 1st, 2021',  
          openinsight:'Openinsight is a complete set of tools integrating open source data collection, open source data development and open source data visualization. It can solve the open source data analysis and reporting in a one-stop way. It has a professional and in-depth understanding of various indicators of various open source projects to help the community operate reasonably.',      
          opendigger:'OpenDigger is an open source analysis report project for all open source data initiated by X-lab, this project aims to combine the wisdom of global developers to jointly analyze and insight into open source related data to help everyone better understand and participate in open source.',
          Question:{
            Q1: 'Your business or project is not here, and how to add it?',
            Q2: 'The items that have been fed back are not seen in the ranking.',
            Q3: 'What is X-lab？'
          },
          Answer:{
            A1:'Please submit feedback to GitHub warehouse: https://github.com/X-lab2017/open-digger Description of feedback method: (link to contribution process document) Open the submit modification template, fill in the project name, path, country and other information, and submit to issue. For template, please refer to: (issue template link)',
            A2:'We have limited the number of projects. You can try to search for the name of your project in the search box at the top of the ranking to locate your item.',
            A3:'X-Lab is a combination of two leading and pioneering laboratories from computer science and data science and engineering respectively in Tongji University and East China Normal University.The lab is supported by a number of core members, including doctorial supervisors, Ph.D students, master students and undergraduate students. X-Lab is an intercross multi-discipline, cutting-edge research lab which focuses on the following research domains: Cloud Computing, Big Data, Data Intelligence, and Education Science & Technology.'
          },
          glossary:'GLOSSARY',
          Glossary:{
            activity:'Activity is an algorithm based on the analysis method of historical behavior log data, which counts the behavior of all warehouses and developers of GitHub in the whole domain, and weights the behavior data of GitHub. The specific calculation method is: ad = ∑ wiciad = ∑ wici, where ADAD is the developer activity, and CICI is the occurrence times of the above five behavior events triggered by the developer, Wiwi is the weighted proportion of the behavior event. According to a simple value evaluation, we can set this value to 1 - 5, that is, 1 point for issue comment, 2 points for issue, 3 points for PR, 4 points for code review comment on PR, and 5 points for pr. After the activity of each developer is calculated, the activity of the project can be calculated by a weighted sum method. The previously given method is: ar = ∑ ad − − √ ar = ∑ ad, that is, the activity of the project is the sum of the activity of all developers. Here, the square is to reduce the impact of the excessive activity of core developers. (project activity only considers the behavior data of developers in the current project.) for more information about activity, please check how to evaluate an open source project (I) - activity blog.',
            influence:'On the basis of activity, a new upper layer algorithm is designed, which is a project influence evaluation method based on the global developer cooperation network. While evaluating the cooperation influence of all projects at one time, it can also deeply explore the cooperation relevance of the project and automatically judge the category of the project, So as to obtain the network cooperation influence of projects and individuals. For more information about influence, please see how to evaluate an open source project (2) - influence blog.',
            bot:''
          }
      },
      },
      zh_CN: {
          translation:{
            navBar:{
                enterprise: '企业',
                project: '项目',
                bot: '机器人'
            },
            month:'月度',
            year:'年度',
            rank:'排名',
            company:'企业',
            project:'项目',
            bot:'机器人',
            activity:'活跃度',
            influence:'影响力',
            details:'详情',
            showMore:'展示更多',
            noMore:'没有更多啦',
            analysisConclusion:'下表显示了截止 2021 年 11 月底，基于 GitHub 数据，OpenInsight 定义的活跃度排名和影响力排名。与 10 月底的排名进行比较，在活跃度方面，前四名领先组织保持一致，QingCloud 有所提升，相比之下，阿里巴巴、京东和字节活跃度有所下降；在影响力方面....',
            contributeProject:'没有您的项目?',
            contributeCompany:'没有您的企业?',
            tip:'没有您的数据?',
            introduction:'欢迎来到 OpenInsight-Index，我们对 GitHub 上国内的企业、项目以及机器人账号进行了活跃度和影响力的排名。（GitHub 是全球最大的社交编程及代码托管网站。）',
            updateTime:'2021 年 12 月 1 日 更新',
            openinsight:'OpenInsight 是一个集开源数据采集、开源数据开发、开源数据可视化一整套工具，一站式解决开源数据分析与报告，专业并且具有深度的了解各个开源项目各项指标，帮助社区合理运营。',
            opendigger:'OpenDigger是对开源数据进行分析的项目，该项目旨在结合全球开发者的智慧，共同分析和洞察开源相关数据，帮助大家更好地了解和参与开源。',
            Question:{
              Q1: '没有您的企业或项目，如何添加？',
              Q2: '已经添加过项目，排行中却没有看到。',
              Q3: 'X-lab是什么的组织？'
            },
            Answer:{
              A1:'提交反馈请到GitHub仓库：https://github.com/X-lab2017/open-digger反馈方式说明：（贡献流程文档链接）打开提交修改模版，填写项目名称、路径、国家等信息，提交issue。模板请参考：（issue模板链接）',
              A2:'对于项目我们限制了展示数量，可以尝试在排行头部搜索项目名称，即可定位到您的项目。',
              A3:'X-Lab由同济大学和华东师范大学计算机科学和数据科学与工程两个领先和开创性实验室组合而成。实验室由多名核心成员支持， 包括博士生导师、博士生、硕士生和本科生。X-Lab是一个交叉的多学科前沿研究实验室，重点研究以下研究领域：云计算、大数据、数据智能和教育科学与技术。'
            },
            glossary:'词典',
            Glossary:{
              activity:'活跃度是基于历史行为日志数据的分析方法，在全域范围内统计 GitHub 所有仓库和开发者的行为，并对 GitHub 行为数据的加权的算法，具体的计算方式为：Ad=∑wiciAd=∑wici 其中的 AdAd 为开发者活跃度，而 cici 为上述五种行为事件由该开发者触发的发生次数，wiwi 为该行为事件的加权比例。按照一个简单的价值评判，我们可以将这个值设置为 1 - 5，即 Issue 评论每个计 1 分、发起 Issue 每个计 2 分、发起 PR 每个计 3 分、PR 上的代码 review 评论每个计 4 分、PR 合入一个计 5 分。在计算出每个开发者的活跃度后，可以通过一种加权和的方式来计算项目的活跃度，之前给出的方式是：Ar=∑Ad−−−√Ar=∑Ad 即项目的活跃度为所有开发者活跃度的开方和，这里开方是为了降低核心开发者过高的活跃度带来的影响。（项目的活跃度只考虑开发者在当前项目中的行为数据。）想要了解更多有关活跃度的信息，请查看如何评价一个开源项目（一）——活跃度这篇博客。',
              influence:'在活跃度的基础上设计了一种新的上层算法，一种基于全域开发者协作网络的项目影响力评估方法，在一次性评估出所有项目的协作影响力的同时，也可以对项目的协作关联度进行深入探索，并对项目的所属类别进行自动判断，从而得出项目和个人的网络协作影响力。想要了解更多有关影响力的信息，请查看如何评价一个开源项目（二）——影响力这篇博客。',
              bot:''
            }
          }
      }
    }
  });

export default i18n;
