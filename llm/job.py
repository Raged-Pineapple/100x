### job_extractor.py
import os
from dotenv import load_dotenv
from schema import JobDescription
import json
import re
from typing import Optional, List

load_dotenv()

# No longer using Gemini API due to quota limitations
print("DEBUG: Using mock implementation for job extraction")

def extract_fields(job_description: str) -> Optional[JobDescription]:
    """
    A mock implementation that extracts job fields without using an external API.
    This uses simple pattern matching to extract information from the job description.
    """
    try:
        if not job_description.strip():
            raise ValueError("Empty job description")
        
        print("DEBUG: Extracting job fields using pattern matching")
        
        # Extract title - assume it's at the beginning before "needed" or "required"
        title_match = re.search(r'^([\w\s]+?)(?=\sneeded|\srequired|\swith)', job_description, re.IGNORECASE)
        title = title_match.group(1).strip() if title_match else "Software Engineer"
        
        # Extract skills - look for common tech skills
        skills: List[str] = []
        skill_patterns = ["Python", "cloud computing", "machine learning", "JavaScript", "Java", "C++", "SQL", "AWS", "Azure"]
        for skill in skill_patterns:
            if re.search(r'\b' + re.escape(skill) + r'\b', job_description, re.IGNORECASE):
                skills.append(skill)
        
        # If no skills found, add some default ones based on the title
        if not skills and "engineer" in title.lower():
            skills = ["Python", "cloud computing"]
        
        # Extract experience
        exp_match = re.search(r'(\d+\+?\s*(?:year|yr)s?(?:\s+of\s+experience)?)', job_description, re.IGNORECASE)
        experience = exp_match.group(1) if exp_match else "3+ years"
        
        # Extract location
        loc_match = re.search(r'location\s*:\s*([\w\s,]+)', job_description, re.IGNORECASE)
        location = loc_match.group(1).strip() if loc_match else "Remote"
        
        # Create JobDescription object
        job_fields = JobDescription(
            title=title,
            skills=skills,
            experience=experience,
            location=location
        )
        
        print("Extracted job fields:", job_fields)
        return job_fields
        
    except Exception as e:
        print(f"Error in extract_fields: {str(e)}")
        return None