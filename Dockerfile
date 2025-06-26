# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# Copy csproj and restore dependencies
COPY api/*.csproj api/
WORKDIR /source/api
RUN dotnet restore

# Copy everything else and build
COPY api/. .
RUN dotnet publish -c Release -o /app --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .

# Configure aspnet to use port from environment
ENV ASPNETCORE_URLS=http://+:${PORT}
ENV PORT=8080

# Make sure the app runs in production mode
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE ${PORT}

# Start the app
ENTRYPOINT ["dotnet", "api.dll"] 