package demo.msa.framework.registry;

import org.apache.zookeeper.*;
import org.apache.zookeeper.data.Stat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.concurrent.CountDownLatch;


/**
 * Created by wxh on 2017/3/26.
 */
@Component
public class ServiceRegistryImpl implements ServiceRegistry, Watcher {

    private static Logger logger = LoggerFactory.getLogger(ServiceRegistryImpl.class);
    private static CountDownLatch latch = new CountDownLatch(1);
    private ZooKeeper zk;
    private static final String REGISTRY_PATH = "/registry";
    private static final int SESSION_TIMEOUT = 5000;

    public ServiceRegistryImpl () {

    }

    public ServiceRegistryImpl (String zkServers) {
        try {
            zk = new ZooKeeper(zkServers, SESSION_TIMEOUT, this);
            latch.await();
            logger.debug("connected to zookeeper");
        } catch (Exception e) {
            logger.error("create zookerper client failure", e);
        }
    }

    @Override
    public void register(String serviceName, String serviceAddress) {
        try {
            //创建根节点 (持久节点)
            String registryPath = REGISTRY_PATH;
            Stat stat = zk.exists(registryPath, false);
            System.out.print("111" + zk.exists(registryPath, false));
            if (zk.exists(registryPath, false) == null) {
                zk.create(registryPath, null, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
                logger.debug("create registry node: {}", registryPath);
            }
            //创建服务节点 (持久节点)
            String servicePath = registryPath + "/" + serviceName;
            if (zk.exists(servicePath, false) == null) {
                zk.create(servicePath, null, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
                logger.debug("create service node: {}" + servicePath);
            }
            //创建地址节点 (临时顺序节点)
            String addressPath = servicePath +"/address-0000";
            String addressNode = zk.create(addressPath, serviceAddress.getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
            logger.debug("create address node: {}", addressNode, serviceAddress);

        } catch (Exception e) {
            logger.error("create node failure", e);
        }
    }

    @Override
    public void process(WatchedEvent event) {
        if (event.getState() == Event.KeeperState.SyncConnected) {
            latch.countDown();
        }
    }
}
