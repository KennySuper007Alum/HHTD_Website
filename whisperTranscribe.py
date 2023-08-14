import os

import whisper


def speechToText():
    # 載入模型
    model = whisper.load_model("medium")

    # 歷遍資料夾中的所有wav檔案
    for filename in os.listdir():
        if filename.endswith(".wav"):
            # 使用whisper轉寫音訊
            result = model.transcribe(full_path)
            # 儲存結果到"Whisper_text"資料夾，以原檔名但改成.txt為檔案名稱
