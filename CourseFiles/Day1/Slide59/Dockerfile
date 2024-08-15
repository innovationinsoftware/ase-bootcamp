# This dockerfile utilizes components licensed by their respective owners/authors.
FROM mcr.microsoft.com/windows/servercore:ltsc2022
LABEL Description="IIS" Vendor="Microsoft" Version="10"
RUN powershell -Command Add-WindowsFeature Web-Server
COPY index.html c:/inetpub/wwwroot/index.html
CMD [ "ping", "localhost", "-t" ]
