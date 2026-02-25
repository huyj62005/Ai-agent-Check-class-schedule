# Live API - Web Console:
- AI Agent hỗ trợ kiểm tra thời khóa biểu bằng giọng nói hoặc văn bản, sử dụng Google Gemini Live API.
- Hệ thống cho phép người dùng hỏi lịch học theo ngày và nhận phản hồi tự động bằng tiếng Việt.
- Tính năng chính:

  🎤 Nhận diện giọng nói (real-time streaming)
  💬 Trả lời bằng tiếng Việt
  📅 Kiểm tra lịch học theo ngày
  🔧 Tích hợp Function Calling (get_schedule)
  🔊 Phản hồi bằng âm thanh từ Gemini Live API
  -Cách hoạt động:
  Người dùng hỏi: "Cho tôi xem lịch học ngày 2026-02-21", "Lịch học ngày mai như thế nào",....

# Cách cài đặt:
📌 Yêu cầu trước khi cài
Máy bạn cần có:
✅ Node.js (>= 18)
✅ npm (cài cùng Node)
✅ Git
✅ API Key từ Google Gemini
Kiểm tra nhanh:
  +)node -v
  +)npm -v
  +)git --version
# Cách chạy:
📥 Bước 1: Clone project
git clone https://github.com/huyj62005/AI-agent-Check-class-schedule.git
cd AI-agent-Check-class-schedule/live-api-web-console
📦 Bước 2: Cài dependencies
npm install
🔑 Bước 3: Tạo file .env
Tạo file .env trong thư mục live-api-web-console
Nội dung:VITE_GEMINI_API_KEY=your_api_key_here
👉 Thay your_api_key_here bằng API key của bạn.
▶️ Bước 4: Chạy project
npm run dev
=>Sau đó mở trình duyệt tại: http://localhost:5173
# Code ban đầu - Gemini Live API: https://github.com/google-gemini/live-api-web-console
