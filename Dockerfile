# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY FalconPay.FraudShield.sln .
COPY src/Domain/FalconPay.FraudShield.Domain.csproj src/Domain/
COPY src/Shared/FalconPay.FraudShield.Shared.csproj src/Shared/
COPY src/Infrastructure/FalconPay.FraudShield.Infrastructure.csproj src/Infrastructure/
COPY src/Application/FalconPay.FraudShield.Application.csproj src/Application/
COPY src/Workers/FalconPay.FraudShield.Workers.csproj src/Workers/
COPY src/API/FalconPay.FraudShield.API.csproj src/API/

# Restore dependencies
RUN dotnet restore

# Copy everything else and build
COPY . .
WORKDIR /src/src/API
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "FalconPay.FraudShield.API.dll"]

