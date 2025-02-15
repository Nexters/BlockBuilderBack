#!/bin/bash

URL="http://211.188.61.227:3000/api/v1/ca/adm/vote"
HEADER="Content-Type: application/json"

# 고정된 투표 데이터 50개
for i in {1..50}
do
    EOA="0xAf150Cb45FF446C856F9de79aa316174ef4b39"

    JSON_DATA=$(cat <<EOF
{
    "question": "평생 고기 없이 살기 vs 평생 야채 없이 살기",
    "eoa": "$EOA",
    "option_one": "고기 없이",
    "option_two": "야채 없이",
    "end_time": "2025-02-22"
}
EOF
)

    curl --location "$URL" --header "$HEADER" --data "$JSON_DATA"
    echo "" # 줄바꿈
done

