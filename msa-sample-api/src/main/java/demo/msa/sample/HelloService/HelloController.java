package demo.msa.sample.HelloService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by wxh on 2017/3/26.
 */
@RestController
public class HelloController {
    @RequestMapping(name = "HelloService", method = RequestMethod.GET, path = "/hello")
    public String hello () {
        return "Hello!";
    }
}
