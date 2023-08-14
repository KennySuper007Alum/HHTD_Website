import os
import ssl
import urllib.request

import whisper
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

ssl._create_default_https_context = ssl._create_unverified_context

app = Flask(__name__, static_folder='static')
CORS(app)
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'wav'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 初始化模型為 None
model = None

# 檢查檔案名稱是否合法
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    global model
    if 'audio' not in request.files:
        return jsonify(success=False, error='No audio part'), 400
    file = request.files['audio']
    if file.filename == '':
        return jsonify(success=False, error='No selected file'), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        model = whisper.load_model("medium")
        result = model.transcribe(filepath)

        # 轉錄好的文字
        transcribed_text = result

        return jsonify(success=True, transcribed_text=transcribed_text)

    return jsonify(success=False, error='Invalid file format'), 400

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True, port=5500)
