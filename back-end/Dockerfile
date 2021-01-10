FROM python:3.8
ENV PYTHONUNBUFFERED=1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/

# FROM python:3.6
# ENV PYTHONUNBUFFERED 1
# RUN apt-get update
# RUN apt-get install default-jdk -y
# RUN mkdir /usr/src/app
# WORKDIR /usr/src/app
# COPY requirements.txt /usr/src/app/
# RUN pip install -r /usr/src/app/requirements.txt
# COPY . /usr/src/app