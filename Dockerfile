# Estágio 1: Build (Compilação)
# Usa uma imagem oficial do Maven com Java 21 para compilar o código
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app

# Copia e baixa as dependências (otimiza o cache do Docker)
# O pom.xml deve estar na raiz do seu repo
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia o código fonte e compila, gerando o JAR
# Assume que o código está na pasta 'src'
COPY src /app/src
RUN mvn package -DskipTests

# Estágio 2: Runtime (Execução)
# Usa uma imagem Java 21 mais leve (apenas JRE) para o deploy final
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copia o JAR compilado do estágio anterior para o ambiente de execução
# Se você usa Spring Boot/Maven, o JAR geralmente fica em 'target' e tem o sufixo 'jar'
# *Ajuste a linha abaixo se o nome do arquivo for diferente do padrão*
COPY --from=build /app/target/*.jar app.jar

# Define a porta que a aplicação Java escuta (pode ser 8080, 8081, etc.)
# É uma boa prática, mas a porta final deve ser configurada nas "Environment Variables" do Render
ENV PORT 8080
EXPOSE $PORT

# Comando para rodar a aplicação JAR
ENTRYPOINT ["java", "-jar", "app.jar"]