from flask import Flask, request, jsonify, send_from_directory
from job import extract_fields
from schema import Resume, JobDescription
import os

app = Flask(__name__, static_folder='.')

@app.route('/')
def landing():
    return send_from_directory('.', 'landing.html')

@app.route('/app')
def app_page():
    return send_from_directory('.', 'index.html')

@app.route('/styles.css')
def styles():
    return send_from_directory('.', 'styles.css')

@app.route('/landing.css')
def landing_styles():
    return send_from_directory('.', 'landing.css')

@app.route('/script.js')
def script():
    return send_from_directory('.', 'script.js')

@app.route('/api/extract-job', methods=['POST'])
def extract_job():
    try:
        data = request.get_json()
        job_description = data.get('job_description')
        
        if not job_description:
            return jsonify({'error': 'No job description provided'}), 400

        job_fields = extract_fields(job_description)
        if not job_fields:
            return jsonify({'error': 'Failed to extract job fields'}), 500

        return jsonify(job_fields.model_dump())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-resume', methods=['POST'])
def analyze_resume():
    try:
        data = request.get_json()
        resume_text = data.get('resume_text')
        job_description = data.get('job_description')

        if not resume_text or not job_description:
            return jsonify({'error': 'Missing required fields'}), 400

        # Create a sample resume object
        resume = Resume(
            resume_id="sample.pdf",
            category="Software Engineer",
            raw_text=resume_text,
            parsed={},
            scores={
                "overall_score": 0.85,
                "skills_match": 0.85,
                "experience_match": 0.85
            }
        )

        return jsonify(resume.model_dump())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/flow-log', methods=['GET'])
def get_flow_log():
    log_file_path = 'flow_output.log'
    try:
        with open(log_file_path, 'r') as f:
            log_content = f.read()
        return log_content, 200, {'Content-Type': 'text/plain'}
    except FileNotFoundError:
        return "Flow log file not found.", 404, {'Content-Type': 'text/plain'}
    except Exception as e:
        return f"Error reading flow log file: {e}", 500, {'Content-Type': 'text/plain'}

if __name__ == '__main__':
    app.run(debug=True, port=5000) 