var zookeeper = require('node-zookeeper-client');

var CONNECTION_STRING = '192.168.220.102:2181,192.168.220.102:2182,192.168.220.102:2183';
var OPTIONS = {
	sessionTimeout: 5000
};

var zk = zookeeper.createClient(CONNECTION_STRING, OPTIONS);
var path = "/registry/HelloService";

function listChildren(zk, path) {
    zk.getChildren(
        path,
        function (event) {
            console.log('Got watcher event: %s', event);
            listChildren(zk, path);
        },
        function (error, children, stat) {
            if (error) {
                console.log(
                    'Failed to list children of %s due to: %s.',
                    path,
                    error
                );
                return;
            }
 
            console.log('Children of %s are: %j.', path, children);
        }
    );
}
 
zk.once('connected', function () {
    console.log('Connected to ZooKeeper.');
    listChildren(zk, path);
});
 
zk.connect();

// zk.connect();
// zk.on('connected', function(){
// 	console.log("zookeeper连接成功" + zk);
// });

// zk.getChildren('/', function(error, chilldren, stat){
// 	if (error) {
// 		console.log(error.stack);
// 		return;
// 	}
// 	console.log(chilldren);
// });


// zk.exists('/foo', function(error, stat){
// 	if (error) {
// 		console.log(error.stack);
// 		return;
// 	}
// 	if (stat) {
// 		console.log('node exists');
// 	}else {
// 		console.log('node does not exist');
// 	}
// });

// zk.create('/foo', new Buffer('hello'), function(error, path){
// 	console.log(path);
// });

// zk.getData('/foo', function(error, data, stat){
// 	console.log(data.toString());
// });

// zk.setData('/foo', new Buffer('hi'), function(error, stat){
// 	console.log(stat)
// });

// zk.remove('/foo', function(error){
// 	if (!error) {
// 		console.log('node is delete');
// 	}
// });