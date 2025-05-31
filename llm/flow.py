### workflow.py
import os
import json
from typing import Dict, Any, Optional
from langgraph.graph import StateGraph, END
from schema import Resume, JobDescription
from job import extract_fields
from dotenv import load_dotenv

load_dotenv()

# Define a proper state class for LangGraph
class GraphState(dict):
    """State object for the LangGraph workflow."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

def node_extract_job_fields(state):
    """Extract job fields from the job description in the state."""
    try:
        # Get the job description from the state
        job_description = state.get("job_description")
        if not job_description:
            raise ValueError("No job description provided in state")

        # Extract job fields using our extraction function
        job_fields = extract_fields(job_description)
        if not job_fields:
            raise ValueError("Failed to extract job fields")

        # Return a new state with the job fields added
        return {**state, "job_fields": job_fields}
    except Exception as e:
        print(f"Error in extract_job_fields node: {str(e)}")
        return {**state, "error": str(e)}

def node_score_resumes(state):
    """Score resumes against the job fields in the state."""
    try:
        # Get job fields and resumes from the state
        job_fields = state.get("job_fields")
        resumes = state.get("resumes")

        if not job_fields:
            raise ValueError("No job fields found in state")
        if not resumes:
            raise ValueError("No resumes provided in state")

        # Score each resume
        def score_resume(resume, job):
            # Simple scoring logic - just a placeholder
            score = 0.85  # dummy value
            resume_copy = Resume.model_validate(resume.model_dump())
            resume_copy.scores = {"overall_score": score}
            return resume_copy

        scored = [score_resume(r, job_fields) for r in resumes if r]

        if not scored:
            raise ValueError("No resumes were successfully scored")

        # Return a new state with the scored resumes added
        return {**state, "scored_resumes": scored}
    except Exception as e:
        print(f"Error in score_resumes node: {str(e)}")
        return {**state, "error": str(e)}

def main():
    # Open a log file for writing output
    with open("flow_output.log", "w") as log_file:
        try:
            log_file.write("Starting job matching workflow\n")
            
            # Read job description
            with open("../test_job_input.txt") as f:
                job_desc = f.read().strip()
            log_file.write(f"Job description: '{job_desc}'\n")
            
            if not job_desc:
                raise ValueError("Empty job description file")

            # Create a sample resume
            resumes = [
                Resume(
                    resume_id="abc123.pdf",
                    category="Accountant",
                    raw_text="...",
                    parsed={
                        "name": "John Doe",
                        "education": [
                            {"degree": "MBA", "field": "Executive Leadership", "institution": "University of Texas", "start_year": 2016, "end_year": 2018},
                            {"degree": "BSc", "field": "Accounting", "institution": "Richland College", "start_year": 2005, "end_year": 2008}
                        ],
                        "certifications": ["CPA", "CMA", "Lean Six Sigma Green Belt"],
                        "skills": {
                            "hard": ["QuickBooks", "ERP (SAP & Oracle)", "SQL", "Python"],
                            "soft": ["Leadership"]
                        },
                        "experience": [
                            {"title": "Online Teacher", "company": "Udemy", "start_year": 2017, "end_year": None, "description": "Teaching Accounting..."}
                        ],
                        "languages": [
                            {"name": "English", "level": "Native"}
                        ],
                        "achievements": [],
                        "interests": [],
                        "memberships": []
                    },
                    meta={"source": "livecareer-csv"}
                )
            ]
            
            log_file.write("Created sample resume\n")

            # Step 1: Extract job fields directly without using the graph
            log_file.write("\nStep 1: Extracting job fields\n")
            job_fields = extract_fields(job_desc)
            if not job_fields:
                raise ValueError("Failed to extract job fields")
            
            log_file.write(f"Extracted job fields:\n")
            log_file.write(f"  Title: {job_fields.title}\n")
            log_file.write(f"  Skills: {job_fields.skills}\n")
            log_file.write(f"  Experience: {job_fields.experience}\n")
            log_file.write(f"  Location: {job_fields.location}\n")

            # Step 2: Score resumes directly without using the graph
            log_file.write("\nStep 2: Scoring resumes\n")
            
            # Placeholder score function
            def score_resume(resume: Resume, job: JobDescription):
                score = 0.85  # dummy value
                resume.scores = {"overall_score": score}
                return resume

            scored_resumes = [score_resume(r, job_fields) for r in resumes if r]
            
            if not scored_resumes:
                raise ValueError("No resumes were successfully scored")
            
            log_file.write(f"Scored {len(scored_resumes)} resumes\n")
            
            # Print results
            log_file.write("\nResults:\n")
            for r in scored_resumes:
                log_file.write(json.dumps(r.model_dump(), indent=2) + "\n")
            
            # Also print to console for confirmation
            print("Job matching workflow completed successfully.")
            print("See flow_output.log for detailed results.")
            
            # First, use the direct approach which we know works
            log_file.write("\nUsing direct sequential approach:\n")
            try:
                # Step 1: Extract job fields
                log_file.write("Step 1: Extracting job fields\n")
                job_data = {"job_description": job_desc, "resumes": resumes}
                
                # Extract job fields
                job_data = node_extract_job_fields(job_data)
                log_file.write(f"After extraction: job_fields={job_data.get('job_fields')}\n")
                
                # Step 2: Score resumes
                if "job_fields" in job_data and not "error" in job_data:
                    log_file.write("Step 2: Scoring resumes\n")
                    result = node_score_resumes(job_data)
                    
                    if "scored_resumes" in result:
                        log_file.write(f"Direct approach produced {len(result['scored_resumes'])} scored resumes\n")
                    else:
                        log_file.write("Direct approach did not produce scored resumes\n")
                else:
                    log_file.write(f"Error in job extraction step: {job_data.get('error', 'Unknown error')}\n")
                    
            except Exception as direct_exc:
                log_file.write(f"Exception during direct approach: {str(direct_exc)}\n")
            
            # Now let's implement a simpler version of the graph workflow
            log_file.write("\nImplementing a simplified graph workflow:\n")
            try:
                # Define a simple workflow function that doesn't use LangGraph
                def simple_workflow(input_data):
                    log_file.write("Starting simple workflow\n")
                    
                    # Step 1: Extract job fields
                    job_data = node_extract_job_fields(input_data)
                    log_file.write(f"After extraction: job_fields extracted\n")
                    
                    # Check for errors
                    if "error" in job_data:
                        log_file.write(f"Error in extraction: {job_data['error']}\n")
                        return job_data
                    
                    # Step 2: Score resumes
                    result = node_score_resumes(job_data)
                    log_file.write("After scoring: resumes scored\n")
                    
                    return result
                
                # Create initial state
                initial_data = {"job_description": job_desc, "resumes": resumes}
                
                # Run the workflow
                workflow_result = simple_workflow(initial_data)
                
                # Check results
                if "scored_resumes" in workflow_result:
                    log_file.write(f"Workflow produced {len(workflow_result['scored_resumes'])} scored resumes\n")
                    log_file.write("Simplified workflow successful!\n")
                else:
                    log_file.write("Workflow did not produce scored resumes\n")
                    if "error" in workflow_result:
                        log_file.write(f"Workflow error: {workflow_result['error']}\n")
                    
            except Exception as graph_exc:
                log_file.write(f"Exception during graph execution: {str(graph_exc)}\n")
            
        except Exception as e:
            error_msg = f"Error in main workflow: {str(e)}"
            log_file.write(error_msg + "\n")
            print(error_msg)
            return None

if __name__ == "__main__":
    main()


