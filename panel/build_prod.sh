rm -rf dist/

rm -rf panel.tar.gz

ng build --prod

tar -czvf panel.tar.gz dist/ 
