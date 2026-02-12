#!/bin/bash

# 服务器配置
SERVER="root@47.115.38.232"
REMOTE_PATH="/var/www/bot/website"
PEM_KEY="$HOME/Desktop/dev/book-subscription/book.pem"

# 本地路径
DOWNLOADS_DIR="public/downloads"
VERSION_FILE="public/version.json"

echo "扫描安装包..."

# 查找安装包
APK_FILE=$(ls ${DOWNLOADS_DIR}/*.apk 2>/dev/null | head -1)
DMG_FILE=$(ls ${DOWNLOADS_DIR}/*.dmg 2>/dev/null | head -1)
EXE_FILE=$(ls ${DOWNLOADS_DIR}/*.exe 2>/dev/null | head -1)

# 提取文件名
APK_NAME=$(basename "$APK_FILE" 2>/dev/null)
DMG_NAME=$(basename "$DMG_FILE" 2>/dev/null)
EXE_NAME=$(basename "$EXE_FILE" 2>/dev/null)

echo "  Android: ${APK_NAME:-未找到}"
echo "  macOS:   ${DMG_NAME:-未找到}"
echo "  Windows: ${EXE_NAME:-未找到}"

# 更新 version.json
echo "更新 version.json..."
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('${VERSION_FILE}', 'utf8'));

const normalizeEntry = (value) => {
  if (value && typeof value === 'object') return value;
  if (typeof value === 'string') return { url: value };
  return {};
};

data.android = normalizeEntry(data.android);
data.mac = normalizeEntry(data.mac);
data.windows = normalizeEntry(data.windows);

if ('${APK_NAME}') data.android.url = '/downloads/${APK_NAME}';
if ('${DMG_NAME}') data.mac.url = '/downloads/${DMG_NAME}';
if ('${EXE_NAME}') data.windows.url = '/downloads/${EXE_NAME}';

if ('apk' in data) delete data.apk;

fs.writeFileSync('${VERSION_FILE}', JSON.stringify(data, null, 2) + '\n');
console.log('  version.json 已更新');
"

echo "开始本地构建..."
npx nuxi generate

if [ $? -ne 0 ]; then
    echo "构建失败"
    exit 1
fi

echo "上传构建产物..."
rsync -avz --delete -e "ssh -i ${PEM_KEY}" dist/ ${SERVER}:${REMOTE_PATH}/.output/public/

echo "上传安装包..."
rsync -avz -e "ssh -i ${PEM_KEY}" ${DOWNLOADS_DIR}/ ${SERVER}:${REMOTE_PATH}/.output/public/downloads/ --exclude='.gitkeep'

echo ""
echo "部署完成!"
