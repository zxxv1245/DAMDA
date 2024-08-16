FROM openjdk:17
ARG JAR_FILE=build/libs/shoppingMart-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
