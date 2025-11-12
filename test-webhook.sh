#!/bin/bash
# Test ANSVIS webhook with current timestamp

curl -X POST https://us-central1-hsb-library.cloudfunctions.net/ansvisWebhook \
  -H "Content-Type: application/json" \
  -d "{
    \"EventName\": \"test_event\",
    \"CameraID\": 450820011,
    \"CameraName\": \"hsb_1_test\",
    \"Detections\": [{
      \"DetectionData\": [{
        \"UserInfo\": {
          \"UserID\": \"TEST_$(date +%s)\",
          \"UserName\": \"Test Student\"
        },
        \"Detections\": [{
          \"Score\": 0.99,
          \"BoundingBox\": {
            \"Left\": 100,
            \"Top\": 100,
            \"Right\": 300,
            \"Bottom\": 300
          },
          \"Time\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"
        }],
        \"Name\": \"Test Student\"
      }]
    }]
  }"

echo ""
echo "Check Firestore attendance_records for new TEST_* record"
