echo "Deployment starting..."
git pull origin
NODE_ENV=development pnpm i || exit
pnpm run build || exit
pm2 delete frontend-main
pm2 start app.json
echo "Deployment done."