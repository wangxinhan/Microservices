package demo.msa.framework.registry;

/**
 * Created by wxh on 2017/3/26.
 */
public interface ServiceRegistry {

    /**
     *  注册服务信息
     *
     * @param serviceName 服务名称
     * @param serviceAddress 服务地址
     */
    public void register(String serviceName, String serviceAddress);
}
