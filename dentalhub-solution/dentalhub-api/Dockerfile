FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["dentalhub-api/dentalhub-api.csproj", "dentalhub-api/"]
RUN dotnet restore "./dentalhub-api/dentalhub-api.csproj"
COPY . .
WORKDIR "/src/dentalhub-api"
RUN dotnet build "./dentalhub-api.csproj" -c $BUILD_CONFIGURATION -o /app/build
EXPOSE 8080
EXPOSE 8081

# Install dotnet-ef globally
RUN dotnet tool install --global dotnet-ef --version 8.0.4

# Add dotnet tools directory to PATH
ENV PATH="${PATH}:/root/.dotnet/tools"

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./dentalhub-api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "dentalhub-api.dll"]