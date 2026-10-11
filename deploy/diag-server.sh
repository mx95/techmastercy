#!/usr/bin/env bash
set -u

echo "========== 1. DOCKER CONTAINERS =========="
docker ps -a

echo
echo "========== 2. DOCKER COMPOSE STATUS =========="
docker compose -f /opt/techmastercy/docker-compose.yml --project-directory /opt/techmastercy ps 2>&1

echo
echo "========== 3. APPLICATION DIRECT RESPONSE =========="
curl -sS -I --max-time 10 http://127.0.0.1:3000/

echo
echo "========== 4. APPLICATION RESPONSE BODY =========="
curl -sS -L --max-time 10 -o /dev/null \
  -w "HTTP status: %{http_code}\nTime: %{time_total}s\n" \
  http://127.0.0.1:3000/

echo
echo "========== 5. NGINX LOCAL RESPONSE =========="
curl -sS -I --max-time 10 http://127.0.0.1/

echo
echo "========== 6. NGINX RESPONSE BODY =========="
curl -sS -L --max-time 10 -o /dev/null \
  -w "HTTP status: %{http_code}\nTime: %{time_total}s\n" \
  http://127.0.0.1/

echo
echo "========== 7. NGINX CONFIGURATION TEST =========="
sudo nginx -t

echo
echo "========== 8. NGINX ROUTING CONFIGURATION =========="
sudo nginx -T 2>/dev/null | grep -nE \
'server_name|proxy_pass|listen|default_server|root |try_files'

echo
echo "========== 9. NGINX ERROR LOG =========="
sudo tail -n 50 /var/log/nginx/error.log

echo
echo "========== 10. NGINX ACCESS LOG =========="
sudo tail -n 30 /var/log/nginx/access.log

echo
echo "========== 11. APPLICATION LOGS =========="
docker logs --tail 100 techmastercy-app 2>&1

echo
echo "========== 12. LISTENING PORTS =========="
sudo ss -lntp

echo
echo "========== 13. UFW FIREWALL =========="
sudo ufw status verbose

echo
echo "========== 14. PUBLIC IP CHECK =========="
curl -sS --max-time 10 https://api.ipify.org
echo

echo
echo "========== 15. SERVER RESOURCE CHECK =========="
free -h
df -h /
uptime

echo
echo "========== 16. NGINX SERVICE STATUS =========="
sudo systemctl --no-pager --full status nginx
