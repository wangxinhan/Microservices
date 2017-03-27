package demo.msa.config;

import demo.msa.framework.registry.ServiceRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.util.Map;

/**
 * Created by wxh on 2017/3/26.
 */
@Component
public class WebListener implements ServletContextListener {

    @Value("${server.address}")
    private String serverAddress = "127.0.0.1";

    @Value("${server.port}")
    private int serverPort = 8989;

    @Autowired
    private ServiceRegistry serviceRegistry;

    @Override
    public void contextInitialized(ServletContextEvent event) {
        //获取请求映射
        ServletContext servletContext = event.getServletContext();
        ApplicationContext applicationContext = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
        RequestMappingHandlerMapping mapping = applicationContext.getBean(RequestMappingHandlerMapping.class);
        Map<RequestMappingInfo, HandlerMethod> infoMap = mapping.getHandlerMethods();
        for (RequestMappingInfo info: infoMap.keySet()) {
            String serviceName = info.getName();
            if (serviceName != null) {
                //注册服务
                serviceRegistry.register(serviceName, String.format("%s:%d", serverAddress, serverPort));
            }
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {

    }
}
