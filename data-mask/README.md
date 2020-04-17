# data-mask
数据脱敏平台后端项目。

# 安装JDK和maven
  ...安装省略...
  
# 下载源码
cd /opt
git clone https://github.com/zhaizhifen/data-mask.git

# 编译打包程序
cd /opt/data-mask
mvn install package -Dmaven.test.skip=true

# 下载tomcat
cd /opt
wget https://mirrors.tuna.tsinghua.edu.cn/apache/tomcat/tomcat-8/v8.5.54/bin/apache-tomcat-8.5.54.tar.gz
tar xvf apache-tomcat-8.5.54.tar.gz

# 修改tomcat配置server.xml
在
<Host name="localhost"  appBase="webapps"
            unpackWARs="true" autoDeploy="true">
后添加如下
<Context path="/" docBase="/opt/apache-tomcat-8.5.54/webapps/data-mask" reloadable="false" allowLinking="true"></Context>

# 导入库表数据
mysql -uroot -p < /opt/data-mask/sql/datamaskdb.sql

# 将打包好的war包拷贝到tomcat的webapps下
cp -rp /opt/data-mask/target/data-mask.war /opt/apache-tomcat-8.5.54/webapps/
cd /opt/apache-tomcat-8.5.54/bin
./start.sh

# 访问数据脱敏系统（用户/密码：admin/123456）
http://xxx.xxx.xxx.xxx:8080
