# Microservices

## 微服务架构探索与实践

### 整体步骤

1、构建第一个服务

 图书分享、借阅平台 后端服务
 
 技术栈：  
 
* koa2：Node.js后端框架
* Vue: 前端框架
* mongo: 数据库

 交互方式： Rest HAL
     
2、构建Docker映像

3、部署Docker映像

4、持续集成 、持续部署、 持续交付

* 概念： http://blog.fir.im/cicd_difference/
* docker方案： https://yq.aliyun.com/articles/32071
   
5、日志聚合

 * ELK  https://kibana.logstash.es/content/
 
     http://mubanjiu.com/2016/10/17/ELK/
     
 * splunk  https://www.splunk.com/
     
6、监控与告警

  * ELK 告警方案：https://www.elastic.co/products/watcher
  * nagios：https://www.nagios.org/
  
7、功能迭代


### 初期方案

初期实现一个Hello World API，整体流程跑通之后，执行功能迭代。