# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# Copy csproj and restore dependencies
COPY api/*.csproj api/
WORKDIR /source/api
RUN dotnet restore

# Copy everything else and build
COPY api/. .
RUN dotnet publish -c Release -o /app

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .

# Configure the port and force IPv4
ENV ASPNETCORE_URLS=http://+:8080
ENV DOTNET_SYSTEM_NET_DISABLEIPV6=1
ENV DOTNET_PREFER_IPV4=1
ENV DOTNET_HOST_STRICT_IP=4

EXPOSE 8080

# Start the app
ENTRYPOINT ["dotnet", "api.dll"] 