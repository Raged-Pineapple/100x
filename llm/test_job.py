import os
import json
from dotenv import load_dotenv
from job import extract_fields

load_dotenv()

def main():
    try:
        # Open a log file for writing output
        with open("test_output.log", "w") as log_file:
            # Read the job description from the file
            with open("../test_job_input.txt") as f:
                job_desc = f.read().strip()
            
            log_file.write(f"Job Description: '{job_desc}'\n")
            
            # Extract job fields
            job_fields = extract_fields(job_desc)
            
            if job_fields:
                log_file.write(f"Extracted Job Fields: {job_fields}\n")
                log_file.write(f"Title: {job_fields.title}\n")
                log_file.write(f"Skills: {job_fields.skills}\n")
                log_file.write(f"Experience: {job_fields.experience}\n")
                log_file.write(f"Location: {job_fields.location}\n")
                
                # Also print to console
                print("Job fields extracted successfully. See test_output.log for details.")
            else:
                log_file.write("Failed to extract job fields\n")
                print("Failed to extract job fields. See test_output.log for details.")
            
    except Exception as e:
        error_msg = f"Error in test script: {str(e)}"
        print(error_msg)
        with open("test_output.log", "w") as log_file:
            log_file.write(error_msg)

if __name__ == "__main__":
    main()
