# Job Matching Workflow

A Python-based workflow for extracting job fields from job descriptions, scoring resumes against job requirements, and managing this process via a workflow system.

## Overview

This project implements a job matching system that:
1. Extracts structured data from job descriptions (title, skills, experience, location)
2. Scores candidate resumes against the extracted job requirements
3. Outputs ranked candidates based on their match to the job

The system uses pattern matching for job field extraction and a configurable scoring algorithm to evaluate resumes.

## Features

- **Job Field Extraction**: Extracts key information from job descriptions using pattern matching
- **Resume Scoring**: Evaluates resumes against job requirements
- **Workflow Management**: Implements both direct sequential and graph-based workflow approaches
- **Detailed Logging**: Comprehensive logging for debugging and tracking execution

## Project Structure

- `flow.py`: Main workflow implementation with job extraction and resume scoring
- `job.py`: Job field extraction logic
- `schema.py`: Data models for Job and Resume objects
- `test_job.py`: Test script for job field extraction
- `test_job_input.txt`: Sample job description for testing
- `flow_output.log`: Detailed execution logs
- `requirements.txt`: Project dependencies

## Requirements

- Python 3.8+
- Dependencies listed in `requirements.txt`:
  - langchain
  - langgraph
  - openai
  - pydantic
  - python-dotenv
  - google-generativeai

## Setup

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On Unix/MacOS
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Create a `.env` file with your API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

## Usage

Run the main workflow:
```
python flow.py
```

This will:
1. Read the job description from `test_job_input.txt`
2. Extract job fields (title, skills, experience, location)
3. Score a sample resume against the job requirements
4. Output results to console and `flow_output.log`

## Testing

Test job field extraction independently:
```
python test_job.py
```

## Implementation Details

### Job Field Extraction

The system extracts job fields using regex pattern matching to identify:
- Job title
- Required skills
- Experience requirements
- Location

### Resume Scoring

Resumes are scored based on their match to the job requirements. The current implementation uses a placeholder scoring mechanism that can be enhanced with more sophisticated algorithms.

### Workflow

The project implements two workflow approaches:
1. **Direct Sequential**: Calls extraction and scoring functions directly
2. **Simplified Graph Workflow**: Implements a workflow that mimics a state graph with proper state handling

## Future Enhancements

- Enhanced scoring algorithm with weighted skill matching
- LLM integration for more accurate field extraction (when API quota issues are resolved)
- User interface for uploading job descriptions and viewing scored resumes
- Scalability improvements for handling larger resume databases
- Comprehensive testing and validation

## License

MIT
