git pull origin master
echo 123456 | sudo -s systemctl stop integral-admin-panel
pnpm run build
echo 123456 | sudo -s systemctl start integral-admin-panel