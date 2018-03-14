
### how to run the docker container? 

```
    sudo docker run -d --name gitlab --volumes-from gitlab_data -p 10080:80 -p 10022:22 --restart=always -m 2g \
    -e 'GITLAB_HOST=gitlab.yunkefu.cc' -e 'GITLAB_PORT=80' \
    -e 'GITLAB_SSH_PORT=10022' -e 'DB_TYPE=mysql' -e 'DB_HOST=10.0.3.11' -e='DB_PORT=3306' \
    -e 'DB_NAME=gitlabhq_production' -e 'DB_USER=gitlab' -e 'DB_PASS=gitlab_mysql' \
    -e 'REDIS_HOST=10.0.3.11' -e 'REDIS_PORT=6379' -e='Asia/Beijing' -e 'GITLAB_TIMEZONE=Beijing' \
    -e 'SMTP_DOMAIN=gitlab.yunkefu.cc' -e 'SMTP_HOST=10.0.0.10' -e 'SMTP_PORT=587' \
    -e 'SMTP_USER=unicall' -e 'SMTP_PASS=Qa21wzcwqe213asDC@3123wewe' -e 'SMTP_AUTHENTICATION=PLAIN' \
    -e 'GITLAB_EMAIL=gitlab@yunkefu.cc' -e 'GITLAB_EMAIL_REPLY_TO=noreply@yunkefu.cc' \
    -e 'GITLAB_BACKUPS=daily' -e 'GITLAB_BACKUP_TIME=01:00' \
    -e 'LDAP_ENABLED=true' -e 'LDAP_LABEL=LDAP' -e 'LDAP_HOST=10.0.3.11' -e 'LDAP_PORT=389' \
    -e 'LDAP_UID=cn' -e 'LDAP_METHOD=plain' -e 'LDAP_BIND_DN=uid=admin,ou=system' -e 'LDAP_PASS=secret' \
    -e 'LDAP_ACTIVE_DIRECTORY=false' -e 'LDAP_ALLOW_USERNAME_OR_EMAIL_LOGIN=true' -e 'LDAP_BLOCK_AUTO_CREATED_USERS=false' \
    -e 'LDAP_BASE=ou=people,dc=unicall,dc=cc' \
    -e 'GITLAB_HTTPS=true' -e 'GITLAB_PORT=443' \
    -e "USERMAP_UID=$(id -u git)" -e "USERMAP_GID=$(id -g git)"  registry.yunkefu.cc/unicall/gitlab:7.14.1
```

### upgrade from 7.14.1 to 8.0.5-1

    Step 1: Update the docker image.

```
        docker pull registry.yunkefu.cc/unicall/gitlab:8.0.5-1
```

    Step 2: Stop and remove the currently running image

```
        docker stop gitlab
```

    Step 3: Create a backup

```
        docker run --name gitlab1 -it --volumes-from gitlab_data -p 10080:80 -p 10022:22 -m 2g \
             -e 'GITLAB_HOST=gitlab.yunkefu.cc' -e 'GITLAB_PORT=80' \
             -e 'GITLAB_SSH_PORT=10022' -e 'DB_TYPE=mysql' -e 'DB_HOST=10.0.3.11' -e='DB_PORT=3306' \
             -e 'DB_NAME=gitlabhq_production' -e 'DB_USER=gitlab' -e 'DB_PASS=gitlab_mysql' \
             -e 'REDIS_HOST=10.0.3.11' -e 'REDIS_PORT=6379' -e='Asia/Beijing' -e 'GITLAB_TIMEZONE=Beijing' \
             -e 'SMTP_DOMAIN=gitlab.yunkefu.cc' -e 'SMTP_HOST=10.0.0.10' -e 'SMTP_PORT=587' \
             -e 'SMTP_USER=unicall' -e 'SMTP_PASS=Qa21wzcwqe213asDC@3123wewe' -e 'SMTP_AUTHENTICATION=PLAIN' \
             -e 'GITLAB_EMAIL=gitlab@yunkefu.cc' -e 'GITLAB_EMAIL_REPLY_TO=noreply@yunkefu.cc' \
             -e 'GITLAB_BACKUPS=daily' -e 'GITLAB_BACKUP_TIME=01:00' \
             -e 'LDAP_ENABLED=true' -e 'LDAP_LABEL=LDAP' -e 'LDAP_HOST=10.0.3.11' -e 'LDAP_PORT=389' \
             -e 'LDAP_UID=cn' -e 'LDAP_METHOD=plain' -e 'LDAP_BIND_DN=uid=admin,ou=system' -e 'LDAP_PASS=secret' \
             -e 'LDAP_ACTIVE_DIRECTORY=false' -e 'LDAP_ALLOW_USERNAME_OR_EMAIL_LOGIN=true' -e 'LDAP_BLOCK_AUTO_CREATED_USERS=false' \
             -e 'LDAP_BASE=ou=people,dc=unicall,dc=cc' \
             -e 'GITLAB_HTTPS=true' -e 'GITLAB_PORT=443' \
             -e "USERMAP_UID=$(id -u git)" -e "USERMAP_GID=$(id -g git)" \
             registry.yunkefu.cc/unicall/gitlab:7.14.1 app:rake gitlab:backup:create
```

    remove the container

```    
        docker rm gitlab
```

    Step 4: Start the image

    Note: Since GitLab 8.0.0 you need to provide the GITLAB_SECRETS_DB_KEY_BASE parameter while starting the image.

```
    sudo docker run -d --name gitlab --volumes-from gitlab_data -p 10080:80 -p 10022:22 --restart=always -m 2g \
    -e 'GITLAB_HOST=gitlab.yunkefu.cc' -e 'GITLAB_PORT=80' \
    -e 'GITLAB_SSH_PORT=10022' -e 'DB_TYPE=mysql' -e 'DB_HOST=10.0.3.11' -e='DB_PORT=3306' \
    -e 'DB_NAME=gitlabhq_production' -e 'DB_USER=gitlab' -e 'DB_PASS=gitlab_mysql' \
    -e 'REDIS_HOST=10.0.3.11' -e 'REDIS_PORT=6379' -e='Asia/Beijing' -e 'GITLAB_TIMEZONE=Beijing' \
    -e 'SMTP_DOMAIN=gitlab.yunkefu.cc' -e 'SMTP_HOST=10.0.0.10' -e 'SMTP_PORT=587' \
    -e 'SMTP_USER=unicall' -e 'SMTP_PASS=Qa21wzcwqe213asDC@3123wewe' -e 'SMTP_AUTHENTICATION=PLAIN' \
    -e 'GITLAB_EMAIL=gitlab@yunkefu.cc' -e 'GITLAB_EMAIL_REPLY_TO=noreply@yunkefu.cc' \
    -e 'GITLAB_BACKUPS=daily' -e 'GITLAB_BACKUP_TIME=01:00' \
    -e 'LDAP_ENABLED=true' -e 'LDAP_LABEL=LDAP' -e 'LDAP_HOST=10.0.3.11' -e 'LDAP_PORT=389' \
    -e 'LDAP_UID=cn' -e 'LDAP_METHOD=plain' -e 'LDAP_BIND_DN=uid=admin,ou=system' -e 'LDAP_PASS=secret' \
    -e 'LDAP_ACTIVE_DIRECTORY=false' -e 'LDAP_ALLOW_USERNAME_OR_EMAIL_LOGIN=true' -e 'LDAP_BLOCK_AUTO_CREATED_USERS=false' \
    -e 'LDAP_BASE=ou=people,dc=unicall,dc=cc' \
    -e 'GITLAB_HTTPS=true' -e 'GITLAB_PORT=443' \
    -e "USERMAP_UID=$(id -u git)" -e "USERMAP_GID=$(id -g git)"  \
    -e 'GITLAB_SECRETS_DB_KEY_BASE=q5Q2LVRq953MwDrFxL8b3wndhqkr73gm9Z4VH6pwxgJgsksTfNBdZ397gr9VHCzM' \
    registry.yunkefu.cc/unicall/gitlab:8.0.5-1

```


### upgrade from 8.0.5-1 to 8.15.4


    Step 1: Update the docker image.

    ```
    docker pull registry.yunkefu.cc/unicall/gitlab:8.15.4
    ```

    Step 2: Stop and remove the currently running image

    ```
    docker stop gitlab
    docker rm gitlab
    ```

    Step 3: Create a backup

```
    sudo docker run -it --name gitlab --volumes-from gitlab_data -p 10080:80 -p 10022:22 --restart=always -m 2g \
    -e 'GITLAB_HOST=gitlab.yunkefu.cc' -e 'GITLAB_PORT=80' \
    -e 'GITLAB_SSH_PORT=10022' -e 'DB_TYPE=mysql' -e 'DB_HOST=10.0.3.11' -e='DB_PORT=3306' \
    -e 'DB_NAME=gitlabhq_production' -e 'DB_USER=gitlab' -e 'DB_PASS=gitlab_mysql' \
    -e 'REDIS_HOST=10.0.3.11' -e 'REDIS_PORT=6379' -e='Asia/Beijing' -e 'GITLAB_TIMEZONE=Beijing' \
    -e 'SMTP_DOMAIN=gitlab.yunkefu.cc' -e 'SMTP_HOST=10.0.0.10' -e 'SMTP_PORT=587' \
    -e 'SMTP_USER=unicall' -e 'SMTP_PASS=Qa21wzcwqe213asDC@3123wewe' -e 'SMTP_AUTHENTICATION=PLAIN' \
    -e 'GITLAB_EMAIL=gitlab@yunkefu.cc' -e 'GITLAB_EMAIL_REPLY_TO=noreply@yunkefu.cc' \
    -e 'GITLAB_BACKUPS=daily' -e 'GITLAB_BACKUP_TIME=01:00' \
    -e 'LDAP_ENABLED=true' -e 'LDAP_LABEL=LDAP' -e 'LDAP_HOST=10.0.3.11' -e 'LDAP_PORT=389' \
    -e 'LDAP_UID=cn' -e 'LDAP_METHOD=plain' -e 'LDAP_BIND_DN=uid=admin,ou=system' -e 'LDAP_PASS=secret' \
    -e 'LDAP_ACTIVE_DIRECTORY=false' -e 'LDAP_ALLOW_USERNAME_OR_EMAIL_LOGIN=true' -e 'LDAP_BLOCK_AUTO_CREATED_USERS=false' \
    -e 'LDAP_BASE=ou=people,dc=unicall,dc=cc' \
    -e 'GITLAB_HTTPS=true' -e 'GITLAB_PORT=443' \
    -e "USERMAP_UID=$(id -u git)" -e "USERMAP_GID=$(id -g git)"  \
    -e 'GITLAB_SECRETS_DB_KEY_BASE=q5Q2LVRq953MwDrFxL8b3wndhqkr73gm9Z4VH6pwxgJgsksTfNBdZ397gr9VHCzM' \
    registry.yunkefu.cc/unicall/gitlab:8.0.5-1 app:rake gitlab:backup:create
```

    Step 4: Start the image

    Note: Since GitLab 8.11.0 you need to provide the GITLAB_SECRETS_SECRET_KEY_BASE and GITLAB_SECRETS_OTP_KEY_BASE parameters while starting the image. These should initially both have the same value as the contents of the /home/git/data/.secret file. See Available Configuration Parameters for more information on these parameters.

```
    sudo docker run -d --name gitlab --volumes-from gitlab_data -p 10080:80 -p 10022:22 --restart=always -m 2g \
    -e 'GITLAB_HOST=gitlab.yunkefu.cc' -e 'GITLAB_PORT=80' \
    -e 'GITLAB_SSH_PORT=10022' -e 'DB_TYPE=mysql' -e 'DB_HOST=10.0.3.11' -e='DB_PORT=3306' \
    -e 'DB_NAME=gitlabhq_production' -e 'DB_USER=gitlab' -e 'DB_PASS=gitlab_mysql' \
    -e 'REDIS_HOST=10.0.3.11' -e 'REDIS_PORT=6379' -e='Asia/Beijing' -e 'GITLAB_TIMEZONE=Beijing' \
    -e 'SMTP_DOMAIN=gitlab.yunkefu.cc' -e 'SMTP_HOST=10.0.0.10' -e 'SMTP_PORT=587' \
    -e 'SMTP_USER=unicall' -e 'SMTP_PASS=Qa21wzcwqe213asDC@3123wewe' -e 'SMTP_AUTHENTICATION=PLAIN' \
    -e 'GITLAB_EMAIL=gitlab@yunkefu.cc' -e 'GITLAB_EMAIL_REPLY_TO=noreply@yunkefu.cc' \
    -e 'GITLAB_BACKUPS=daily' -e 'GITLAB_BACKUP_TIME=01:00' \
    -e 'LDAP_ENABLED=true' -e 'LDAP_LABEL=LDAP' -e 'LDAP_HOST=10.0.3.11' -e 'LDAP_PORT=389' \
    -e 'LDAP_UID=cn' -e 'LDAP_METHOD=plain' -e 'LDAP_BIND_DN=uid=admin,ou=system' -e 'LDAP_PASS=secret' \
    -e 'LDAP_ACTIVE_DIRECTORY=false' -e 'LDAP_ALLOW_USERNAME_OR_EMAIL_LOGIN=true' -e 'LDAP_BLOCK_AUTO_CREATED_USERS=false' \
    -e 'LDAP_BASE=ou=people,dc=unicall,dc=cc' \
    -e 'GITLAB_HTTPS=true' -e 'GITLAB_PORT=443' \
    -e "USERMAP_UID=$(id -u git)" -e "USERMAP_GID=$(id -g git)"  \
    -e 'GITLAB_SECRETS_DB_KEY_BASE=q5Q2LVRq953MwDrFxL8b3wndhqkr73gm9Z4VH6pwxgJgsksTfNBdZ397gr9VHCzM' \
    -e 'GITLAB_SECRETS_SECRET_KEY_BASE=0edcce97b47ed57d3d8d1546b83234bfe70272b14c3729c56e2c3156dc5217b22087a3d10a3ab5a47a18f8ecacf5e29a79fec3cb1127adb99e55b2ac66c7e99b' \
    -e 'GITLAB_SECRETS_OTP_KEY_BASE=0edcce97b47ed57d3d8d1546b83234bfe70272b14c3729c56e2c3156dc5217b22087a3d10a3ab5a47a18f8ecacf5e29a79fec3cb1127adb99e55b2ac66c7e99b' \
    registry.yunkefu.cc/unicall/gitlab:8.15.4
```