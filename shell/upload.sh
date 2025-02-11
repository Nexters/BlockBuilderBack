#!/bin/bash

# 업로드할 파일이 위치한 디렉토리 (수정 가능)
UPLOAD_DIR="/home/robert/사진/bodoblock"

# 서버 주소
SERVER_URL="http://localhost:3000/upload"

# 1.png ~ 47.png 파일을 반복적으로 업로드
#for i in {1..47}; do
for i in {48..56}; do
    FILE_PATH="$UPLOAD_DIR/$i.png"

    # 파일이 존재하는지 확인
    if [[ -f "$FILE_PATH" ]]; then
        echo "Uploading: $FILE_PATH"
        curl -X POST "$SERVER_URL" \
            -H "Content-Type: multipart/form-data" \
            -F "file=@$FILE_PATH"

        echo -e "\nUpload completed for: $FILE_PATH"
    else
        echo "File not found: $FILE_PATH"
    fi

    # 딜레이 추가 (선택 사항)
    sleep 1
done

echo "✅ All uploads completed!"
