#!/bin/bash

# API URL
API_URL="http://211.188.61.227:3000/api/v1/pinata/json-to-ipfs"

# JSON 파일 위치
JSON_FILE="nft_data.json"

# 데이터를 하나씩 추출하여 API 요청
jq -c '.[]' "$JSON_FILE" | while read -r nft; do
    echo "Uploading NFT: $(echo "$nft" | jq -r '.name')"

    curl --location "$API_URL" \
        --header 'Content-Type: application/json' \
        --data "$nft"

    echo -e "\nUpload complete for: $(echo "$nft" | jq -r '.name')\n"
    sleep 1 # API 요청 간 짧은 대기 (필요에 따라 조정)
done
