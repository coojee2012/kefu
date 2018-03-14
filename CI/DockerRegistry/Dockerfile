FROM registry:2.1.1

COPY config.yml /etc/docker/registry/config.yml

VOLUME ["/var/lib/registry"]
EXPOSE 5000
ENTRYPOINT ["/bin/registry"]
CMD ["/etc/docker/registry/config.yml"]