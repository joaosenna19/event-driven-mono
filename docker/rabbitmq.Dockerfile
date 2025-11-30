FROM rabbitmq:4.2.1-management

RUN rabbitmq-plugins enable rabbitmq_stream rabbitmq_management

EXPOSE 5552
EXPOSE 5672
EXPOSE 15672

