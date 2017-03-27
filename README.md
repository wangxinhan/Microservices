# Microservices

## 微服务架构探索与实践

### 整体步骤

1、构建服务
     
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


### 微服务基础设施 1.0

* 注册中心 zookeeper: 服务注册 健康检查
* 服务网关 Node服务: 接口路由 反向代理 服务发现
* 数据库 mongodb
* 缓存 redis
* 持续部署 持续交付 jenkins + docker
* 日志聚合 ELK
* 消息队列 后台任务 (任务 队列 定时器 执行器) | RabbitMQ
* 配置中心 调研 | 无

### 技术栈
 * Node: koa2 | koa | Express
 * 前端: vue 
 * java: Sping Boot
 * 服务交互方式: restApi HAL协议 
 
### 产品 
 [图书分享、借阅平台](https://github.com/wangxinhan/Microservices/blob/master/book/README.md)  
 
 
