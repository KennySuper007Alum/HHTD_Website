import os
import whisper

# 設定資料夾路徑
audio_folder = "drive-download-20230809T151446Z-001"
output_folder = "Whisper_text"

# 檢查是否已經有"Whisper_text"這個資料夾，若沒有則建立
if not os.path.exists(output_folder):
    os.mkdir(output_folder)

# 載入模型
model = whisper.load_model("medium")

# 歷遍資料夾中的所有wav檔案
for filename in os.listdir(audio_folder):
    if filename.endswith(".wav"):
        # 獲得完整的wav檔案路徑
        full_path = os.path.join(audio_folder, filename)
        
        # 使用whisper轉寫音訊
        result = model.transcribe(full_path)
        
        # 儲存結果到"Whisper_text"資料夾，以原檔名但改成.txt為檔案名稱
        output_filename = os.path.join(output_folder, os.path.splitext(filename)[0] + ".txt")
        with open(output_filename, 'w') as f:
            f.write(result["text"])

print("Transcription completed!")
